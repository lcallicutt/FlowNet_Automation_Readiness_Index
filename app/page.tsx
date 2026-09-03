import Link from "next/link";
import { CATEGORIES } from "@/lib/assessment";
import {
  DEEP_DIVE_AUDIT_PAYMENT_URL,
  STRATEGY_SESSION_PAYMENT_URL,
} from "@/lib/config";
import ScoreRing from "@/components/ScoreRing";
import CategoryBar from "@/components/CategoryBar";

const AUDIENCES = [
  {
    icon: "⛪",
    title: "Churches & Ministries",
    text: "Automate follow-up with visitors, online giving, event registration, and member communication.",
  },
  {
    icon: "🏪",
    title: "Small Businesses",
    text: "Capture more leads, follow up automatically, and stop losing revenue to manual busywork.",
  },
  {
    icon: "🤝",
    title: "Nonprofits",
    text: "Streamline donor management, recurring giving, volunteer coordination, and impact reporting.",
  },
  {
    icon: "🎯",
    title: "Coaches & Consultants",
    text: "Automate discovery-call booking, client onboarding, and follow-up so you can focus on clients.",
  },
  {
    icon: "🚀",
    title: "Solo Founders",
    text: "Build systems that let you operate like a team of five — before you can afford one.",
  },
  {
    icon: "🔧",
    title: "Local Service Providers",
    text: "Automate quotes, scheduling, reminders, reviews, and repeat-business follow-up.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Take the free assessment",
    text: "Answer 30 quick questions across 10 operational areas. It takes about 5 minutes — no tech knowledge required.",
  },
  {
    step: "2",
    title: "Get your readiness score",
    text: "See your overall Automation Readiness Score out of 100, your readiness level, and a breakdown by category.",
  },
  {
    step: "3",
    title: "Follow your roadmap",
    text: "Get prioritized recommendations for what to automate first — and how much time you could save each week.",
  },
];

const SAMPLE_SCORES = [
  { name: "Lead Capture", icon: "🧲", score: 45 },
  { name: "Follow-Up", icon: "🔁", score: 32 },
  { name: "Scheduling", icon: "📅", score: 78 },
  { name: "Payments & Donations", icon: "💳", score: 85 },
  { name: "Documentation / SOPs", icon: "📘", score: 25 },
];

const FAQS = [
  {
    q: "How long does the assessment take?",
    a: "About 5 minutes. There are 30 questions across 10 categories, and each one is a simple 1–5 rating. You'll get your score immediately.",
  },
  {
    q: "Is the free assessment really free?",
    a: "Yes. You get your full Automation Readiness Score, a category breakdown, and your top 3 recommendations at no cost. Paid tiers add the full report, website audit, and strategy support.",
  },
  {
    q: "I'm not technical. Is this for me?",
    a: "Absolutely. The assessment asks about how your operations work today — not about technology. The recommendations are written in plain language with clear first steps.",
  },
  {
    q: "What is the Website Automation Audit?",
    a: "Enter your website URL and we evaluate its automation readiness: lead capture, calls-to-action, follow-up, booking and payment readiness, and trust signals — with specific opportunities to improve.",
  },
  {
    q: "What happens after I get my score?",
    a: "You'll see exactly where you're losing time and what to automate first. From there you can get the Deep Dive Audit for a full report emailed to you, or book a Strategy Session to get a custom roadmap built with you.",
  },
  {
    q: "Do you work with churches and nonprofits?",
    a: "Yes — churches and nonprofits are core to who we serve. The assessment covers giving, member management, volunteer coordination, and communication alongside business use cases.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-96 rounded-full bg-navy-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="mb-5 inline-block rounded-full border border-teal-400/40 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-300">
              Know what to automate before you automate.
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Find out how ready your business is for{" "}
              <span className="bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent">
                automation
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-200">
              Get a clear score, practical recommendations, and a roadmap for
              saving time with smarter systems.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/assessment" className="btn-primary !px-8 !py-3.5 !text-base">
                Start Free Assessment
              </Link>
              <Link
                href="/audit"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-navy-600 bg-navy-900/60 px-8 py-3.5 text-base font-semibold text-white transition hover:border-teal-400 hover:text-teal-300"
              >
                Run Website Audit
              </Link>
            </div>
            <p className="mt-5 text-sm text-navy-400">
              Free · 5 minutes · Instant results · No credit card required
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-navy-700 bg-navy-900/70 p-6 shadow-lift backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-navy-200">Sample Readiness Report</span>
                <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-semibold text-teal-300">
                  Automation Ready
                </span>
              </div>
              <div className="flex justify-center rounded-xl bg-white/[0.04] py-5">
                <ScoreRing score={72} size={150} color="#2cc0bb" dark />
              </div>
              <div className="mt-5 space-y-3">
                {SAMPLE_SCORES.slice(0, 3).map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex justify-between text-xs font-medium text-navy-300">
                      <span>{s.icon} {s.name}</span>
                      <span className="text-white">{s.score}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-navy-700">
                      <div
                        className="h-full rounded-full bg-teal-400"
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="eyebrow">Who it&apos;s for</span>
          <h2 className="section-title">Built for people who wear too many hats</h2>
          <p className="mt-4 text-navy-600">
            If you&apos;re running operations on memory, sticky notes, and late
            nights — this was made for you.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="card transition hover:shadow-lift">
              <span className="text-3xl">{a.icon}</span>
              <h3 className="mt-3 text-lg font-semibold text-navy-900">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-navy-50/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">From guessing to a clear roadmap in 5 minutes</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="card relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-lg font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample score categories */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">What you&apos;ll see</span>
            <h2 className="section-title">A score for every part of your operation</h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              The Automation Readiness Index measures 10 areas of your business
              — from lead capture and follow-up to payments, documentation, and
              AI usage. You&apos;ll see exactly which systems are strong and
              which are costing you hours every week.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-navy-700">
              {CATEGORIES.map((c) => (
                <li key={c.id} className="flex items-center gap-2">
                  <span>{c.icon}</span> {c.name}
                </li>
              ))}
            </ul>
            <Link href="/assessment" className="btn-primary mt-8">
              Get My Score
            </Link>
          </div>
          <div className="card !p-8">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-navy-500">
              Sample category breakdown
            </h3>
            <div className="space-y-5">
              {SAMPLE_SCORES.map((s) => (
                <CategoryBar key={s.name} name={s.name} icon={s.icon} score={s.score} />
              ))}
            </div>
            <p className="mt-6 rounded-lg bg-gold-500/10 px-4 py-3 text-xs leading-relaxed text-navy-700">
              <strong>💡 In this example:</strong> Documentation and Follow-Up are the
              biggest opportunities — automating them first could save 6+ hours per week.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-navy-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow !text-teal-300">Pricing</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start free. Upgrade when you want the full roadmap.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Readiness Snapshot",
                price: "$0",
                desc: "Your readiness score, category breakdown, and top 3 recommendations. Two minutes, no card.",
                cta: { label: "Start Free", href: "/assessment", external: false },
                highlight: false,
              },
              {
                name: "Deep Dive Audit",
                price: "$97",
                desc: "Full readiness report, website audit, priority roadmap, and 10 workflows matched to your weakest areas, emailed within 24 hours. Applies as a $97 credit toward a Strategy Session or Care Plan.",
                cta: {
                  label: "Get the Audit",
                  href: DEEP_DIVE_AUDIT_PAYMENT_URL,
                  external: true,
                },
                highlight: true,
              },
              {
                name: "Strategy Session",
                price: "$297",
                desc: "Everything in the Deep Dive Audit plus a 60-minute working call and a custom automation roadmap you can hand to any builder, including us.",
                cta: {
                  label: "Book Strategy Session",
                  href: STRATEGY_SESSION_PAYMENT_URL,
                  external: true,
                },
                highlight: false,
              },
            ].map((t) => (
              <div
                key={t.name}
                className={`flex flex-col rounded-2xl border p-6 ${
                  t.highlight
                    ? "border-teal-400 bg-navy-900 shadow-lift"
                    : "border-navy-700 bg-navy-900/50"
                }`}
              >
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="mt-2 text-3xl font-extrabold">{t.price}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-300">
                  {t.desc}
                </p>
                <div className="mt-6">
                  {t.cta.external ? (
                    <a
                      href={t.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full ${
                        t.highlight ? "btn-solid-teal" : "btn-outline-teal-dark"
                      }`}
                    >
                      {t.cta.label}
                    </a>
                  ) : (
                    <Link
                      href={t.cta.href}
                      className={`w-full ${
                        t.highlight ? "btn-solid-teal" : "btn-outline-teal-dark"
                      }`}
                    >
                      {t.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/pricing" className="btn-primary !px-8">
              View Full Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">Common questions</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <details key={f.q} className="card group !p-0">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="ml-4 text-teal-500 transition group-open:rotate-45">＋</span>
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-navy-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-teal-600 to-navy-800 py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Stop guessing. Start with a score.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-teal-50">
            In 5 minutes you&apos;ll know exactly where you&apos;re losing time
            — and what to automate first.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-navy-900 shadow-lift transition hover:bg-navy-50"
            >
              Start Free Assessment
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Run Website Audit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
