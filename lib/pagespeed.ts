/**
 * Google PageSpeed Insights (Lighthouse) client.
 *
 * Supplies the two ratings that HTML inspection can't honestly measure —
 * real mobile performance and SEO scores. Every failure path returns null so
 * the audit falls back to markup-based heuristics instead of blocking: a slow
 * or rate-limited Google API must never cost the visitor their report.
 */

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const TIMEOUT_MS = 25_000;

export interface LighthouseScores {
  /** 0–100, mobile strategy. */
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  /** Largest Contentful Paint, seconds. */
  lcpSeconds: number | null;
}

function toScore(value: unknown): number | null {
  return typeof value === "number" ? Math.round(value * 100) : null;
}

export async function fetchLighthouse(url: string): Promise<LighthouseScores | null> {
  const key = process.env.PAGESPEED_API_KEY;

  const params = new URLSearchParams({ url, strategy: "mobile" });
  for (const category of ["performance", "seo", "accessibility", "best-practices"]) {
    params.append("category", category);
  }
  if (key) params.set("key", key);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${ENDPOINT}?${params}`, { signal: controller.signal });
    if (!res.ok) {
      console.warn(
        `PageSpeed API responded ${res.status}${key ? "" : " (no PAGESPEED_API_KEY set)"}`
      );
      return null;
    }

    const data = await res.json();
    const categories = data?.lighthouseResult?.categories;
    if (!categories) return null;

    const lcpMs =
      data?.lighthouseResult?.audits?.["largest-contentful-paint"]?.numericValue;

    return {
      performance: toScore(categories.performance?.score),
      seo: toScore(categories.seo?.score),
      accessibility: toScore(categories.accessibility?.score),
      bestPractices: toScore(categories["best-practices"]?.score),
      lcpSeconds: typeof lcpMs === "number" ? Math.round(lcpMs / 100) / 10 : null,
    };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.warn("PageSpeed API timed out");
    } else {
      console.warn("PageSpeed API failed:", err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}
