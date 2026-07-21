import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { readinessAssessments } from "@/db/schema";
import { CATEGORIES, calculateResults } from "@/lib/assessment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubmissionBody {
  name?: unknown;
  email?: unknown;
  businessType?: unknown;
  answers?: unknown;
}

const VALID_QUESTION_IDS = new Set(
  CATEGORIES.flatMap((c) => c.questions.map((q) => q.id))
);

function validate(body: SubmissionBody): {
  name: string;
  email: string;
  businessType: string;
  answers: Record<string, number>;
} | null {
  const { name, email, businessType, answers } = body;
  if (typeof name !== "string" || !name.trim()) return null;
  if (typeof email !== "string" || !/.+@.+\..+/.test(email)) return null;
  if (typeof businessType !== "string") return null;
  if (typeof answers !== "object" || answers === null || Array.isArray(answers))
    return null;

  const cleanAnswers: Record<string, number> = {};
  for (const [key, value] of Object.entries(answers)) {
    if (!VALID_QUESTION_IDS.has(key)) return null;
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5)
      return null;
    cleanAnswers[key] = value;
  }
  if (Object.keys(cleanAnswers).length !== VALID_QUESTION_IDS.size) return null;

  return {
    name: name.trim().slice(0, 200),
    email: email.trim().toLowerCase().slice(0, 320),
    businessType: businessType.trim().slice(0, 100),
    answers: cleanAnswers,
  };
}

/**
 * Notify GoHighLevel that a new assessment contact exists, for tagging only.
 * GHL is intentionally NOT a second source of truth — the payload carries no
 * assessment data beyond the tier and weakest category. Failures are logged
 * and swallowed: the webhook is a notification, never a dependency.
 */
async function notifyGhl(payload: {
  name: string;
  email: string;
  tier: string;
  top_weakest_category: string;
}) {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`GHL webhook responded ${res.status}`);
    }
  } catch (err) {
    console.error("GHL webhook failed:", err);
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
      { error: "Invalid submission: name, valid email, businessType, and all 30 answers (1–5) are required" },
      { status: 400 }
    );
  }

  // Scores are recomputed server-side so the stored record can't be tampered
  // with by editing the client payload.
  const result = calculateResults(
    input.answers,
    input.email,
    input.businessType,
    input.name
  );

  let id: string;
  try {
    const rows = await getDb()
      .insert(readinessAssessments)
      .values({
        name: input.name,
        email: input.email,
        businessType: input.businessType,
        answers: input.answers,
        categoryScores: result.categoryScores,
        totalScore: result.overallScore,
        tier: result.tier,
      })
      .returning({ id: readinessAssessments.id });
    id = rows[0].id;
  } catch (err) {
    console.error("Failed to save assessment:", err);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }

  await notifyGhl({
    name: input.name,
    email: input.email,
    tier: result.tier,
    top_weakest_category: result.weakestCategories[0]?.name ?? "",
  });

  return NextResponse.json({
    ok: true,
    id,
    totalScore: result.overallScore,
    tier: result.tier,
  });
}
