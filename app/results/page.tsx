"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLatestAssessment } from "@/lib/storage";
import { getReadinessLevel, type AssessmentResult } from "@/lib/assessment";
import ScoreRing from "@/components/ScoreRing";
import CategoryBar from "@/components/CategoryBar";
import BookingLink from "@/components/BookingLink";

export default function ResultsPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResult(getLatestAssessment());
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-navy-400">
        Loading your results…
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <span className="text-5xl">📋</span>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">No results yet</h1>
        <p className="mt-2 text-navy-600">
          Complete the free Automation Readiness Assessment to see your score
          and personalized recommendations.
        </p>
        <Link href="/assessment" className="btn-primary mt-6">
          Start Free Assessment
        </Link>
      </div>
    );
  }

  const level = getReadinessLevel(result.overallScore);

  return (
    <div className="bg-navy-50/60 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="eyebrow">Your Automation Readiness Report</span>
          <h1 className="section-title">
            You&apos;re in{" "}
            <span style={{ color: level.color }}>{level.name}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-navy-600">{level.summary}</p>
        </div>

        {/* Score + breakdown */}
        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          <div className="card flex flex-col items-center justify-center text-center lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
              Overall Readiness Score
            </h2>
            <ScoreRing score={result.overallScore} color={level.color} />
            <div className="mt-5 w-full rounded-xl bg-teal-50 px-4 py-3">
              <p className="text-sm font-semibold text-teal-800">
                ⏱️ Estimated time-saving opportunity
              </p>
              <p className="mt-1 text-2xl font-extrabold text-teal-700">
                ~{result.estimatedHoursSavedPerWeek} hours/week
              </p>
              <p className="mt-1 text-xs text-teal-700/80">
                by automating your weakest systems
              </p>
            </div>
          </div>

          <div className="card lg:col-span-3">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-navy-500">
              Category Breakdown
            </h2>
            <div className="space-y-4">
              {result.categoryScores.map((c) => (
                <CategoryBar key={c.id} name={c.name} icon={c.icon} score={c.score} />
              ))}
            </div>
          </div>
        </div>

        {/* Weakest areas + recommendations */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
              🔍 Your 3 Biggest Opportunities
            </h2>
            <div className="space-y-4">
              {result.recommendations.map((rec, i) => (
                <div key={rec.category} className="rounded-xl border border-navy-100 bg-navy-50/50 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-navy-900">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-xs text-navy-950">
                      {i + 1}
                    </span>
                    {rec.icon} {rec.category}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{rec.advice}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
              ✅ Recommended Next Steps
            </h2>
            <ol className="space-y-4">
              {result.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-navy-700">{step}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl bg-navy-950 p-5 text-white">
              <p className="text-sm font-semibold">Want the full picture?</p>
              <p className="mt-1 text-xs leading-relaxed text-navy-300">
                The Pro Audit includes your complete report, a website
                automation audit, a priority roadmap, and 10 recommended
                workflows tailored to your scores.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <BookingLink className="btn-gold">Get My Full Report</BookingLink>
          <BookingLink className="btn-primary">
            Book a FlowNet Consultation
          </BookingLink>
          <Link href="/dashboard" className="btn-secondary w-full">
            View My Dashboard
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-navy-500">
          Want to see how your website measures up too?{" "}
          <Link href="/audit" className="font-semibold text-teal-600 hover:underline">
            Run the free Website Automation Audit →
          </Link>
        </p>
      </div>
    </div>
  );
}
