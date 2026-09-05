"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAssessments, getLatestAudit } from "@/lib/storage";
import { getReadinessLevel, type AssessmentResult } from "@/lib/assessment";
import { auditGrade, type AuditResult } from "@/lib/audit";
import ScoreRing from "@/components/ScoreRing";
import BookingLink from "@/components/BookingLink";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAssessments(getAssessments());
    setAudit(getLatestAudit());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-navy-400">
        Loading your dashboard…
      </div>
    );
  }

  const latest = assessments[0] ?? null;

  if (!latest && !audit) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="text-5xl">👋</span>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">Welcome to FlowNet</h1>
        <p className="mt-2 text-navy-600">
          Your dashboard will show your scores, history, and recommended next
          steps once you complete an assessment or website audit.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/assessment" className="btn-primary">Start Free Assessment</Link>
          <Link href="/audit" className="btn-secondary">Run Website Audit</Link>
        </div>
      </div>
    );
  }

  const level = latest ? getReadinessLevel(latest.overallScore) : null;
  const grade = audit ? auditGrade(audit.overallScore) : null;

  return (
    <div className="bg-navy-50/60 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1 className="text-3xl font-bold text-navy-900">Your Results</h1>
            <p className="mt-1 text-sm text-navy-500">
              Showing assessments completed in this browser. Results are saved
              on this device only.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/assessment" className="btn-secondary !px-4 !py-2 text-sm">
              Retake Assessment
            </Link>
            <Link href="/audit" className="btn-secondary !px-4 !py-2 text-sm">
              New Website Audit
            </Link>
          </div>
        </div>

        {/* Score cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card flex flex-col items-center text-center">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
              Latest Readiness Score
            </h2>
            {latest && level ? (
              <>
                <ScoreRing score={latest.overallScore} size={140} color={level.color} />
                <span
                  className="mt-3 rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: level.color }}
                >
                  {level.name}
                </span>
                <Link
                  href="/results"
                  className="mt-3 text-sm font-semibold text-teal-600 hover:underline"
                >
                  View full results →
                </Link>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-6">
                <p className="text-sm text-navy-500">No assessment yet</p>
                <Link href="/assessment" className="btn-primary mt-4 !px-4 !py-2 text-sm">
                  Take Assessment
                </Link>
              </div>
            )}
          </div>

          <div className="card flex flex-col items-center text-center">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
              Website Audit Score
            </h2>
            {audit && grade ? (
              <>
                <ScoreRing score={audit.overallScore} size={140} color={grade.color} />
                <span
                  className="mt-3 rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: grade.color }}
                >
                  {grade.label}
                </span>
                <p className="mt-3 truncate text-xs text-navy-500" title={audit.input.url}>
                  {audit.input.url}
                </p>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-6">
                <p className="text-sm text-navy-500">No website audit yet</p>
                <Link href="/audit" className="btn-primary mt-4 !px-4 !py-2 text-sm">
                  Run Audit
                </Link>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy-500">
              Upgrade Your Roadmap
            </h2>
            <p className="text-sm leading-relaxed text-navy-600">
              Get your full report with a priority roadmap and 10 recommended
              workflows, or book a strategy session to build it together.
            </p>
            <div className="mt-5 space-y-3">
              <BookingLink className="btn-gold">Get My Deep Dive Audit</BookingLink>
              <BookingLink className="btn-primary">
                Book a Consultation ($297)
              </BookingLink>
            </div>
          </div>
        </div>

        {/* Next steps + history */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
              ✅ Recommended Next Steps
            </h2>
            {latest ? (
              <ol className="space-y-4">
                {latest.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-navy-700">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-navy-500">
                Complete the readiness assessment to get personalized next steps.
              </p>
            )}
          </div>

          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
              📋 Completed Assessments
            </h2>
            {assessments.length > 0 ? (
              <ul className="divide-y divide-navy-100">
                {assessments.slice(0, 6).map((a, i) => {
                  const l = getReadinessLevel(a.overallScore);
                  return (
                    <li key={a.completedAt + i} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-navy-900">
                          Automation Readiness Assessment
                        </p>
                        <p className="text-xs text-navy-500">
                          {new Date(a.completedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {a.businessType ? ` · ${a.businessType}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                          style={{ backgroundColor: l.color }}
                        >
                          {l.name}
                        </span>
                        <span className="text-lg font-extrabold text-navy-900">
                          {a.overallScore}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-navy-500">No assessments completed yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
