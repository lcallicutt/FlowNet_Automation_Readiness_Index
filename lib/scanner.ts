import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Server-side website scanner.
 *
 * SECURITY: this module fetches URLs submitted by anonymous visitors, which is
 * a classic SSRF vector. Every hop (including each redirect) is re-validated
 * against private, loopback, link-local and cloud-metadata address ranges
 * before a request is made.
 *
 * Known limitation: a hostname could resolve to a safe IP during validation
 * and a private one at connect time (DNS rebinding). Closing that fully needs
 * a custom agent pinned to the validated IP; for a public marketing audit the
 * per-hop checks below are the proportionate defense.
 */

const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;
const MAX_BYTES = 2_000_000; // 2 MB of HTML is far more than any real page needs

const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);
const BLOCKED_TLD_SUFFIXES = [".local", ".internal", ".localhost", ".home.arpa"];

function ipv4ToInt(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + Number.parseInt(octet, 10), 0) >>> 0;
}

/** CIDR ranges that must never be reachable from the scanner. */
const BLOCKED_V4_RANGES: Array<[string, number]> = [
  ["0.0.0.0", 8], // "this" network
  ["10.0.0.0", 8], // private
  ["100.64.0.0", 10], // carrier-grade NAT
  ["127.0.0.0", 8], // loopback
  ["169.254.0.0", 16], // link-local — includes 169.254.169.254 cloud metadata
  ["172.16.0.0", 12], // private
  ["192.0.0.0", 24], // IETF protocol assignments
  ["192.168.0.0", 16], // private
  ["198.18.0.0", 15], // benchmarking
  ["224.0.0.0", 4], // multicast
  ["240.0.0.0", 4], // reserved
];

function isBlockedV4(ip: string): boolean {
  const value = ipv4ToInt(ip);
  return BLOCKED_V4_RANGES.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    return (value & mask) === (ipv4ToInt(base) & mask);
  });
}

function isBlockedV6(ip: string): boolean {
  const addr = ip.toLowerCase().replace(/^\[|\]$/g, "");
  // IPv4-mapped (::ffff:10.0.0.1) — unwrap and check as v4.
  const mapped = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isBlockedV4(mapped[1]);
  if (addr === "::" || addr === "::1") return true;
  if (addr.startsWith("fc") || addr.startsWith("fd")) return true; // unique local
  if (addr.startsWith("fe8") || addr.startsWith("fe9")) return true; // link-local
  if (addr.startsWith("fea") || addr.startsWith("feb")) return true;
  return false;
}

function isBlockedAddress(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isBlockedV4(ip);
  if (version === 6) return isBlockedV6(ip);
  return true; // unparseable — refuse
}

export class ScanError extends Error {
  constructor(
    message: string,
    readonly code:
      | "invalid_url"
      | "blocked_host"
      | "unreachable"
      | "not_html"
      | "too_large"
      | "timeout"
  ) {
    super(message);
  }
}

/** Throws unless the URL is a public http(s) address safe to request. */
async function assertSafeUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ScanError("That doesn't look like a valid web address.", "invalid_url");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ScanError("Only http and https addresses can be scanned.", "invalid_url");
  }

  const host = url.hostname.toLowerCase();
  if (
    BLOCKED_HOSTNAMES.has(host) ||
    BLOCKED_TLD_SUFFIXES.some((suffix) => host.endsWith(suffix))
  ) {
    throw new ScanError("That address can't be scanned.", "blocked_host");
  }

  // A bare IP in the URL still has to clear the range checks.
  if (isIP(host) && isBlockedAddress(host)) {
    throw new ScanError("That address can't be scanned.", "blocked_host");
  }

  if (!isIP(host)) {
    let addresses: Array<{ address: string }>;
    try {
      addresses = await lookup(host, { all: true });
    } catch {
      throw new ScanError("We couldn't reach that website.", "unreachable");
    }
    if (addresses.length === 0 || addresses.some((a) => isBlockedAddress(a.address))) {
      throw new ScanError("That address can't be scanned.", "blocked_host");
    }
  }

  return url;
}

export interface FetchedPage {
  finalUrl: string;
  html: string;
  /** Milliseconds to first byte of the final response. */
  responseTimeMs: number;
  isHttps: boolean;
}

/**
 * Fetch a page with redirects followed manually so each hop is re-validated.
 */
export async function fetchSite(rawUrl: string): Promise<FetchedPage> {
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  let current = await assertSafeUrl(withProtocol);
  const startedAt = Date.now();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          // Identify honestly; some sites block unknown agents outright.
          "User-Agent":
            "FlowNetAuditBot/1.0 (+https://flownetautomation.com; website automation audit)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        throw new ScanError("That website took too long to respond.", "timeout");
      }
      throw new ScanError("We couldn't reach that website.", "unreachable");
    }
    clearTimeout(timer);

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) {
        throw new ScanError("We couldn't reach that website.", "unreachable");
      }
      // Re-validate the redirect target — this is what stops a public URL from
      // bouncing the scanner into a private or metadata address.
      current = await assertSafeUrl(new URL(location, current).toString());
      continue;
    }

    if (!res.ok) {
      throw new ScanError(
        `That website responded with an error (${res.status}).`,
        "unreachable"
      );
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("html")) {
      throw new ScanError("That address didn't return a web page.", "not_html");
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength > MAX_BYTES) {
      throw new ScanError("That page is too large to scan.", "too_large");
    }

    return {
      finalUrl: current.toString(),
      html: new TextDecoder().decode(buffer),
      responseTimeMs: Date.now() - startedAt,
      isHttps: current.protocol === "https:",
    };
  }

  throw new ScanError("That website redirected too many times.", "unreachable");
}
