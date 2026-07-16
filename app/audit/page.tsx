"use client";

import { useState } from "react";
import Link from "next/link";
import {
  WEBSITE_GOALS,
  INDUSTRIES,
  generateAudit,
  auditGrade,
  type AuditResult,
  type WebsiteGoal,
} from "@/lib/audit";
import { saveAudit, saveUser } from "@/lib/storage";
import ScoreRing from "@/components/ScoreRing";
import CategoryBar from "@/components/CategoryBar";
import PlaceholderButton from "@/components/PlaceholderButton";

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState<string>(INDUSTRIES[0]);
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState<WebsiteGoal>(WEBSITE_GOALS[0]);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  function handleSubmit(e: React.FormEvent) {
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

    // Simulated scan delay — replace with a live website scanner API later.
    setTimeout(() => {
      const audit = generateAudit({
        url: url.trim(),
        businessName: businessName.trim(),
        industry,
        email: email.trim(),
        goal,
      });
      saveAudit(audit);
      saveUser({ email: email.trim() });
      setResult(audit);
      setScanning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1800);
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
              <p className="mt-4 text-xs leading-relaxed text-navy-400">
                Simulated audit for demonstration. Live website scanning is a
                planned integration.
              </p>
            </div>

            <div className="card lg:col-span-3">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-navy-500">
                Automation Readiness by Area
              </h2>
              <div className="space-y-4">
                {result.ratings.map((r) => (
                  <div key={r.id}>
                    <CategoryBar
                      name={r.placeholder ? `${r.label} *` : r.label}
                      score={r.score}
                    />
                    <p className="mt-1 text-xs leading-relaxed text-navy-500">{r.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-navy-400">
                * Placeholder rating pending live scanner integration.
              </p>
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
            <PlaceholderButton kind="stripe" className="btn-gold">
              Get Full Audit Report — $97
            </PlaceholderButton>
            <Link href="/book" className="btn-primary w-full">
              Book a FlowNet Consultation
            </Link>
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
                Analyzing your website…
              </>
            ) : (
              "Run My Free Audit"
            )}
          </button>
          <p className="text-center text-xs text-navy-400">
            Instant results · No credit card required
          </p>
        </form>
      </div>
    </div>
  );
}
