import Link from "next/link";
import {
  DEEP_DIVE_AUDIT_PAYMENT_URL,
  STRATEGY_SESSION_PAYMENT_URL,
  CARE_PLAN_PAYMENT_URL,
} from "@/lib/config";

interface Tier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: { label: string; href: string; external: boolean };
  highlight: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Readiness Snapshot",
    price: "$0",
    period: "forever free",
    description: "Your score and top recommendations in two minutes.",
    features: [
      "Basic Automation Readiness Score",
      "Basic category breakdown",
      "3 personalized recommendations",
      "Estimated time-saving opportunity",
      "Website Automation Audit (basic)",
    ],
    cta: { label: "Start Free", href: "/assessment", external: false },
    highlight: false,
  },
  {
    name: "Deep Dive Audit",
    price: "$97",
    period: "one-time",
    description:
      "The full report and roadmap, emailed within 24 hours. $97 credits toward the next step.",
    features: [
      "Full Automation Readiness Report",
      "Complete Website Automation Audit",
      "Priority automation roadmap",
      "10 recommended workflows",
      "Tool suggestions for each workflow",
    ],
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
    period: "one-time",
    description:
      "The audit plus a 60-minute working call and a roadmap you can hand to any builder.",
    features: [
      "Everything in the Deep Dive Audit",
      "60-minute FlowNet Automation strategy call",
      "Custom automation roadmap",
      "Specific tool recommendations",
      "Next-step implementation plan",
      "30 days of email follow-up support",
    ],
    cta: {
      label: "Book Session",
      href: STRATEGY_SESSION_PAYMENT_URL,
      external: true,
    },
    highlight: false,
  },
  {
    name: "Care Plan Standard",
    price: "$249",
    period: "per month",
    description: "We implement your roadmap and keep it running.",
    features: [
      "Implementation of your roadmap",
      "Monitoring and maintenance of live workflows",
      "3 improvement hours per month",
      "Monthly health report",
      "Includes Grace Ministry Hub for churches",
      "Next-business-day support",
      "Cancel anytime with 30 days notice",
    ],
    cta: {
      label: "Start Standard",
      href: CARE_PLAN_PAYMENT_URL,
      external: true,
    },
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-navy-50/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <h1 className="section-title">Simple pricing. Serious time savings.</h1>
          <p className="mt-4 text-navy-600">
            Start with a free score. Upgrade when you&apos;re ready for the
            complete roadmap, or let us build it with you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 ${
                tier.highlight
                  ? "border-teal-400 shadow-lift ring-1 ring-teal-400"
                  : "border-navy-100 shadow-soft"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Most Popular
                </span>
              )}
              <h2 className="text-lg font-bold text-navy-900">{tier.name}</h2>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-navy-900">
                  {tier.price}
                </span>
                <span className="text-sm text-navy-500">{tier.period}</span>
              </div>
              <p className="mt-3 text-sm text-navy-600">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-navy-700">
                    <span className="mt-0.5 shrink-0 text-teal-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                {tier.cta.external ? (
                  <a
                    href={tier.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full ${
                      tier.highlight ? "btn-primary" : "btn-outline-teal"
                    }`}
                  >
                    {tier.cta.label}
                  </a>
                ) : (
                  <Link
                    href={tier.cta.href}
                    className={`w-full ${
                      tier.highlight ? "btn-primary" : "btn-outline-teal"
                    }`}
                  >
                    {tier.cta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl rounded-2xl bg-navy-950 p-8 text-center text-white">
          <h3 className="text-xl font-bold">Not sure which is right for you?</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-300">
            Take the Readiness Snapshot first. Your score will show you exactly
            how much opportunity is on the table, then you can decide if the
            full roadmap is worth it. (Hint: it usually pays for itself in the
            first week of saved time.)
          </p>
          <Link href="/assessment" className="btn-primary mt-6">
            Start the Readiness Snapshot
          </Link>
        </div>
      </div>
    </div>
  );
}
