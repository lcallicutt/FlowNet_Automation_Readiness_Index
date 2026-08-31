import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { websiteAudits } from "@/db/schema";
import { fetchSite, ScanError } from "@/lib/scanner";
import { detectSignals } from "@/lib/signals";
import { fetchLighthouse } from "@/lib/pagespeed";
import {
  WEBSITE_GOALS,
  auditGrade,
  scoreAudit,
  type WebsiteGoal,
} from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Lighthouse runs can take ~20s; give the whole scan headroom.
export const maxDuration = 60;

interface SubmissionBody {
  url?: unknown;
  businessName?: unknown;
  email?: unknown;
  industry?: unknown;
  goal?: unknown;
}

/**
 * Per-instance rate limit. Serverless means this is not global — each warm
 * instance keeps its own counter — but it still blunts the obvious abuse of
 * using this endpoint as a free scanning proxy. A shared limit would need
 * Redis or a DB counter; that's the upgrade if abuse actually shows up.
 */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recentScans = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recentScans.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentScans.set(key, hits);
  if (recentScans.size > 5000) recentScans.clear(); // crude memory ceiling
  return hits.length > RATE_LIMIT;
}

function validate(body: SubmissionBody) {
  const { url, businessName, email, industry, goal } = body;
  if (typeof url !== "string" || !url.trim()) return null;
  if (typeof businessName !== "string" || !businessName.trim()) return null;
  if (typeof email !== "string" || !/.+@.+\..+/.test(email)) return null;

  const cleanGoal =
    typeof goal === "string" && (WEBSITE_GOALS as readonly string[]).includes(goal)
      ? (goal as WebsiteGoal)
      : WEBSITE_GOALS[0];

  return {
    url: url.trim().slice(0, 500),
    businessName: businessName.trim().slice(0, 200),
    email: email.trim().toLowerCase().slice(0, 320),
    industry: typeof industry === "string" ? industry.trim().slice(0, 100) : "",
    goal: cleanGoal,
  };
}

type GhlNotifyResult = "skipped" | "sent" | "rejected" | "error";

/** Tagging-only notification, same contract as the assessment webhook. */
async function notifyGhl(payload: {
  business_name: string;
  email: string;
  website: string;
  audit_score: number;
  audit_grade: string;
  top_weakest_area: string;
}): Promise<GhlNotifyResult> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) {
    console.log("GHL webhook skipped: GHL_WEBHOOK_URL is not set");
    return "skipped";
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`GHL webhook responded ${res.status}: ${await res.text().catch(() => "")}`);
      return "rejected";
    }
    console.log("GHL webhook sent successfully");
    return "sent";
  } catch (err) {
    console.error("GHL webhook failed:", err);
    return "error";
  }
}

export async function POST(request: Request) {
  let body: SubmissionBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = validate(body);
  if (!input) {
    return NextResponse.json(
      { error: "A website URL, business name, and valid email are required." },
      { status: 400 }
    );
  }

  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: "Too many scans from this address. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  // 1. Fetch the site (SSRF-guarded, every redirect re-validated).
  let page;
  try {
    page = await fetchSite(input.url);
  } catch (err) {
    if (err instanceof ScanError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: 422 });
    }
    console.error("Unexpected scan failure:", err);
    return NextResponse.json(
      { error: "We couldn't scan that website. Please check the address and try again." },
      { status: 500 }
    );
  }

  // 2. Detect markup signals, and pull Lighthouse in parallel-friendly fashion.
  //    Lighthouse failure returns null and the scoring falls back to heuristics.
  const signals = detectSignals(page);
  const lighthouse = await fetchLighthouse(page.finalUrl);

  const result = scoreAudit(input, signals, lighthouse, page.finalUrl);
  const grade = auditGrade(result.overallScore);

  // 3. Persist. A DB failure must not cost the visitor their report, so it's
  //    logged and swallowed rather than returned as an error.
  let id: string | null = null;
  try {
    const rows = await getDb()
      .insert(websiteAudits)
      .values({
        businessName: input.businessName,
        email: input.email,
        industry: input.industry,
        goal: input.goal,
        url: input.url,
        scannedUrl: page.finalUrl,
        signals,
        ratings: result.ratings,
        overallScore: result.overallScore,
        grade: grade.label,
      })
      .returning({ id: websiteAudits.id });
    id = rows[0].id;
  } catch (err) {
    console.error("Failed to save audit:", err);
  }

  const weakest = [...result.ratings].sort((a, b) => a.score - b.score)[0];
  const ghlStatus = await notifyGhl({
    business_name: input.businessName,
    email: input.email,
    website: page.finalUrl,
    audit_score: result.overallScore,
    audit_grade: grade.label,
    top_weakest_area: weakest?.label ?? "",
  });

  return NextResponse.json({ ok: true, id, result, ghlStatus });
}
