"use client";

import { useState } from "react";
import Link from "next/link";
import {
  WEBSITE_GOALS,
  INDUSTRIES,
  auditGrade,
  type AuditResult,
  type WebsiteGoal,
} from "@/lib/audit";
import { saveAudit, saveUser } from "@/lib/storage";
import ScoreRing from "@/components/ScoreRing";
import CategoryBar from "@/components/CategoryBar";
import BookingLink from "@/components/BookingLink";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState<WebsiteGoal>(WEBSITE_GOALS[0]);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+\S*$/i.test(url.trim())) {
      setError("Please enter a valid website URL (e.g. yoursite.com).");
      return;
    }
    if (!businessName.trim()) {
      setError("Please enter your business or organization name.");
      return;
    }
    if (!/.+@.+\..+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setScanning(true);

    // The scan runs server-side: the browser can't fetch third-party sites
    // (CORS), and URL validation has to happen somewhere untrusted input
    // can't bypass it.
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          businessName: businessName.trim(),
          industry,
          email: email.trim(),
          goal,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          data?.error ?? "We couldn't scan that website. Please try again."
        );
        setScanning(false);
        return;
      }

      saveAudit(data.result);
      saveUser({ email: email.trim() });
      setResult(data.result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Audit request failed:", err);
      setError(
        "We couldn't reach the scanner. Please check your connection and try again."
      );
    } finally {
      setScanning(false);
    }
  }

  if (result) {
    const grade = auditGrade(result.overallScore);
    return (
      <div className="bg-navy-50/60 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <span className="eyebrow">Website Automation Audit</span>
            <h1 className="section-title">{result.input.businessName}</h1>
            <p className="mt-2 text-sm text-navy-500">
              {result.input.url} · Goal: {result.input.goal}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-5">
            <div className="card flex flex-col items-center justify-center text-center lg:col-span-2">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
                Website Automation Score
              </h2>
              <ScoreRing score={result.overallScore} color={grade.color} />
              <span
                className="mt-4 rounded-full px-4 py-1.5 text-sm font-bold text-white"
                style={{ backgroundColor: grade.color }}
              >
                {grade.label}
              </span>
              <div className="mt-4 w-full rounded-lg bg-teal-50 px-3 py-2.5 text-left">
                <p className="text-xs font-semibold text-teal-800">
                  ✓ Live scan of your site
                </p>
                <p className="mt-1 break-all text-[11px] leading-relaxed text-teal-700/90">
                  {result.scannedUrl}
                </p>
                {!result.lighthouseUnavailable && (
                  <p className="mt-1 text-[11px] leading-relaxed text-teal-700/90">
                    Includes Google Lighthouse mobile &amp; SEO scores.
                  </p>
                )}
              </div>
              {result.jsRenderingCaveat && (
                <div className="mt-3 w-full rounded-lg border border-gold-300 bg-gold-300/20 px-3 py-2.5 text-left">
                  <p className="text-[11px] leading-relaxed text-navy-600">
                    <span className="font-semibold">Heads up:</span> most of this
                    site&apos;s content loads via JavaScript, so forms and widgets
                    added after page load may not be detected. Scores for those
                    areas may read lower than reality.
                  </p>
                </div>
              )}
            </div>

            <div className="card lg:col-span-3">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-navy-500">
                Automation Readiness by Area
              </h2>
              <div className="space-y-5">
                {result.ratings.map((r) => (
                  <div key={r.id}>
                    <CategoryBar
                      name={r.fromLighthouse ? `${r.label} (Lighthouse)` : r.label}
                      score={r.score}
                    />
                    <p className="mt-1 text-xs leading-relaxed text-navy-500">{r.note}</p>
                    {r.evidence.length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {r.evidence.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-1.5 text-[11px] leading-relaxed text-navy-400"
                          >
                            <span className="mt-px shrink-0">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              {result.lighthouseUnavailable && (
                <p className="mt-4 text-[11px] text-navy-400">
                  Google Lighthouse data was unavailable for this scan, so Mobile
                  and SEO were scored from page markup only.
                </p>
              )}
            </div>
          </div>

          <div className="card mt-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-navy-500">
              🚀 Suggested Automation Opportunities
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {result.opportunities.map((op) => (
                <li
                  key={op}
                  className="flex items-start gap-2.5 rounded-xl border border-navy-100 bg-navy-50/50 px-4 py-3 text-sm leading-relaxed text-navy-700"
                >
                  <span className="mt-0.5 text-teal-500">✓</span>
                  {op}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <BookingLink className="btn-gold">Get My Full Audit Report</BookingLink>
            <BookingLink className="btn-primary">
              Book a FlowNet Consultation
            </BookingLink>
            <button
              type="button"
              onClick={() => {
                setResult(null);
                window.scrollTo({ top: 0 });
              }}
              className="btn-secondary w-full"
            >
              Audit Another Website
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-navy-500">
            Haven&apos;t taken the readiness assessment yet?{" "}
            <Link href="/assessment" className="font-semibold text-teal-600 hover:underline">
              Get your Automation Readiness Score →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-50/60 py-12 sm:py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="eyebrow">Free Tool</span>
          <h1 className="section-title">Website Automation Audit</h1>
          <p className="mt-3 text-navy-600">
            See how well your website captures leads, follows up, and turns
            visitors into customers, donors, or members.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5 !p-6 sm:!p-8">
          <div>
            <label htmlFor="url" className="label">Website URL</label>
            <input
              id="url"
              type="text"
              className="input"
              placeholder="https://yoursite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="businessName" className="label">Business / organization name</label>
            <input
              id="businessName"
              type="text"
              className="input"
              placeholder="e.g. Grace Community Church"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="industry" className="label">Industry</label>
            <select
              id="industry"
              className="input"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="email" className="label">Email address</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <span className="label">Main goal for your website</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {WEBSITE_GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition ${
                    goal === g
                      ? "border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-200"
                      : "border-navy-200 text-navy-700 hover:border-teal-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={scanning} className="btn-primary w-full !py-3.5">
            {scanning ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Scanning your website…
              </>
            ) : (
              "Run My Free Audit"
            )}
          </button>
          <p className="text-center text-xs text-navy-400">
            {scanning
              ? "This takes up to 30 seconds. We're loading your site and running Google Lighthouse."
              : "Live scan of your site · No credit card required"}
          </p>
        </form>
      </div>
    </div>
  );
}
