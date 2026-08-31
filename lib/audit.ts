import type { SiteSignals } from "./signals";
import type { LighthouseScores } from "./pagespeed";

export const WEBSITE_GOALS = [
  "Get more leads",
  "Book appointments",
  "Accept donations/payments",
  "Sell products",
  "Share information",
  "Build authority",
] as const;

export type WebsiteGoal = (typeof WEBSITE_GOALS)[number];

export const INDUSTRIES = [
  "Church / Ministry",
  "Small Business",
  "Nonprofit",
  "Coach / Consultant",
  "Solo Founder / Creator",
  "Local Service Provider",
  "Other",
] as const;

export interface AuditInput {
  url: string;
  businessName: string;
  industry: string;
  email: string;
  goal: WebsiteGoal;
}

export interface AuditRating {
  id: string;
  label: string;
  /** 0–100 */
  score: number;
  note: string;
  /** What the scan actually found, shown to the visitor as proof. */
  evidence: string[];
  /** True when this rating comes from Lighthouse rather than markup checks. */
  fromLighthouse?: boolean;
}

export interface AuditResult {
  input: AuditInput;
  overallScore: number;
  ratings: AuditRating[];
  opportunities: string[];
  completedAt: string;
  /** Final URL after redirects — what was actually scanned. */
  scannedUrl: string;
  /** True when Lighthouse data was unavailable and heuristics were used. */
  lighthouseUnavailable: boolean;
  /** True when the page looks JS-rendered, so markup checks may under-report. */
  jsRenderingCaveat: boolean;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

const list = (items: string[]) =>
  items.length <= 1
    ? items[0] ?? ""
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

interface ScoredCategory {
  score: number;
  note: string;
  evidence: string[];
  fromLighthouse?: boolean;
}

function scoreLeadCapture(s: SiteSignals): ScoredCategory {
  let score = 0;
  const evidence: string[] = [];

  if (s.formCount > 0) {
    score += 30;
    evidence.push(`${s.formCount} form${s.formCount === 1 ? "" : "s"} found on the page`);
  }
  if (s.hasEmailInput) {
    score += 25;
    evidence.push("Email capture field present");
  }
  if (s.formProviders.length > 0) {
    score += 25;
    evidence.push(`Form platform detected: ${list(s.formProviders)}`);
  }
  if (s.formCount >= 2) score += 10;
  if (s.chatWidgets.length > 0) {
    score += 10;
    evidence.push(`Chat widget detected: ${list(s.chatWidgets)}`);
  }

  if (evidence.length === 0) evidence.push("No forms or email capture found on the homepage");

  const note =
    score >= 70
      ? "Lead capture is in place. Test placement and the offer to lift conversion further."
      : score >= 40
        ? "Some capture exists, but it isn't backed by a form platform that can trigger follow-up automatically."
        : "Visitors have no obvious way to leave their details, so traffic likely leaves without becoming a lead.";

  return { score: clamp(score), note, evidence };
}

function scoreCta(s: SiteSignals): ScoredCategory {
  const evidence: string[] = [];
  let score: number;

  if (s.ctaCount === 0) score = 15;
  else if (s.ctaCount <= 2) score = 50;
  else if (s.ctaCount <= 6) score = 80;
  else score = 90;

  if (s.ctaCount > 0) {
    evidence.push(
      `${s.ctaCount} action-oriented call${s.ctaCount === 1 ? "" : "s"}-to-action found (e.g. "book", "get started", "contact us")`
    );
  } else {
    evidence.push("No action-oriented CTA language found — links read as navigation, not next steps");
  }
  if (s.buttonCount > 0) {
    score += 5;
    evidence.push(`${s.buttonCount} button element${s.buttonCount === 1 ? "" : "s"} on the page`);
  }
  if (s.ctaCount > 12) {
    score -= 10;
    evidence.push("Many competing CTAs — one primary action per page converts better");
  }

  const note =
    score >= 70
      ? "Clear next steps are present. Test stronger action language and higher contrast."
      : score >= 45
        ? "CTAs exist but are limited. Make the primary action obvious and repeat it down the page."
        : "Visitors aren't told clearly what to do next, which caps every other improvement.";

  return { score: clamp(score), note, evidence };
}

function scoreFollowUp(s: SiteSignals): ScoredCategory {
  let score = 0;
  const evidence: string[] = [];

  if (s.crmProviders.length > 0) {
    score += 60;
    evidence.push(`Marketing/CRM platform detected: ${list(s.crmProviders)}`);
  }
  if (s.chatWidgets.length > 0) {
    score += 20;
    evidence.push(`Chat widget detected: ${list(s.chatWidgets)}`);
  }
  if (s.formProviders.length > 0) {
    score += 20;
    evidence.push(`Form platform capable of triggering follow-up: ${list(s.formProviders)}`);
  }

  if (evidence.length === 0) {
    evidence.push("No marketing automation or CRM platform detected in the page code");
  }

  const note =
    score >= 70
      ? "The tooling for automated follow-up is installed. Make sure sequences actually run on every inquiry."
      : score >= 40
        ? "Partial follow-up tooling found. Connect it to an automated sequence so no lead waits on a manual reply."
        : "Nothing detected that can follow up automatically — inquiries likely depend on someone remembering to reply.";

  return { score: clamp(score), note, evidence };
}

function scoreBookingPayment(s: SiteSignals): ScoredCategory {
  let score = 0;
  const evidence: string[] = [];

  if (s.bookingProviders.length > 0) {
    score += 55;
    evidence.push(`Online booking detected: ${list(s.bookingProviders)}`);
  }
  if (s.paymentProviders.length > 0) {
    score += 45;
    evidence.push(`Payment/giving platform detected: ${list(s.paymentProviders)}`);
  }

  if (evidence.length === 0) {
    evidence.push("No booking or payment platform detected");
  }

  const note =
    score >= 70
      ? "Visitors can self-serve. Reduce steps in the flow to cut drop-off."
      : score >= 40
        ? "One half of the transaction is covered. Adding the other removes a manual back-and-forth."
        : "Booking or paying appears to require email or phone tag, which loses people who won't wait.";

  return { score: clamp(score), note, evidence };
}

function scoreTrust(s: SiteSignals): ScoredCategory {
  let score = 20; // a plain site still carries some baseline credibility
  const evidence: string[] = [];

  if (s.hasReviewSchema) {
    score += 30;
    evidence.push("Review/rating structured data found (helps search engines show stars)");
  }
  if (s.reviewPlatforms.length > 0) {
    score += 30;
    evidence.push(`Review platform embedded: ${list(s.reviewPlatforms)}`);
  }
  if (s.hasTestimonialLanguage) {
    score += 20;
    evidence.push("Testimonial or review language found in page copy");
  }
  if (s.isHttps) {
    score += 10;
    evidence.push("Served over HTTPS");
  } else {
    score -= 20;
    evidence.push("Not served over HTTPS — browsers may warn visitors");
  }

  if (evidence.length === 0) evidence.push("No testimonials, reviews, or rating markup found");

  const note =
    score >= 70
      ? "Solid credibility signals. Keep testimonials specific and recent."
      : score >= 45
        ? "Some proof is present. Named testimonials with concrete results convert better than generic praise."
        : "Little social proof found. Adding reviews near your primary CTA is usually the cheapest conversion win.";

  return { score: clamp(score), note, evidence };
}

function scoreMobile(s: SiteSignals, lh: LighthouseScores | null): ScoredCategory {
  if (lh?.performance != null) {
    const evidence = [`Google Lighthouse mobile performance score: ${lh.performance}/100`];
    if (lh.lcpSeconds != null) {
      evidence.push(`Largest Contentful Paint: ${lh.lcpSeconds}s (under 2.5s is good)`);
    }
    if (s.hasViewportMeta) evidence.push("Mobile viewport tag present");
    else evidence.push("No mobile viewport tag — the page may not scale on phones");

    const note =
      lh.performance >= 70
        ? "Mobile performance is solid. Most visitors will get a fast, usable experience."
        : lh.performance >= 45
          ? "Mobile performance is middling. Slow loads on phone connections cost form completions."
          : "Mobile performance is poor. On a phone connection many visitors leave before the page is usable.";

    return { score: clamp(lh.performance), note, evidence, fromLighthouse: true };
  }

  // Fallback: markup-only heuristics (clearly weaker, and labelled as such).
  let score = 30;
  const evidence: string[] = [];
  if (s.hasViewportMeta) {
    score += 45;
    evidence.push("Mobile viewport tag present");
  } else {
    evidence.push("No mobile viewport tag found");
  }
  if (s.hasResponsiveImages) {
    score += 15;
    evidence.push("Responsive images in use");
  }
  if (s.responseTimeMs < 1500) {
    score += 10;
    evidence.push(`Server responded in ${(s.responseTimeMs / 1000).toFixed(1)}s`);
  } else {
    evidence.push(`Slow server response: ${(s.responseTimeMs / 1000).toFixed(1)}s`);
  }
  evidence.push("Full Lighthouse mobile scoring was unavailable for this scan");

  return {
    score: clamp(score),
    note: "Based on page markup only — connect a successful Lighthouse run for a full mobile score.",
    evidence,
  };
}

function scoreSeo(s: SiteSignals, lh: LighthouseScores | null): ScoredCategory {
  const evidence: string[] = [];

  if (s.title) evidence.push(`Page title: "${s.title.slice(0, 80)}"`);
  else evidence.push("No page title found");
  if (s.metaDescription) evidence.push("Meta description present");
  else evidence.push("No meta description — search engines will invent one");
  if (s.h1Count === 1) evidence.push("Exactly one H1 heading (ideal)");
  else if (s.h1Count === 0) evidence.push("No H1 heading found");
  else evidence.push(`${s.h1Count} H1 headings — one is best`);
  if (s.hasOpenGraph) evidence.push("Open Graph tags present (controls link previews)");
  else evidence.push("No Open Graph tags — shared links won't preview well");
  if (s.hasStructuredData) evidence.push("Structured data (JSON-LD) present");
  if (s.analytics.length > 0) evidence.push(`Analytics installed: ${list(s.analytics)}`);
  else evidence.push("No analytics detected — you can't measure what's working");

  if (lh?.seo != null) {
    const note =
      lh.seo >= 80
        ? "Search fundamentals are in good shape."
        : lh.seo >= 55
          ? "Search fundamentals are partly in place. Fixing the gaps below is mostly quick work."
          : "Search fundamentals need attention — this limits how much traffic the site can earn.";
    return {
      score: clamp(lh.seo),
      note,
      evidence: [`Google Lighthouse SEO score: ${lh.seo}/100`, ...evidence],
      fromLighthouse: true,
    };
  }

  let score = 0;
  if (s.title) score += 20;
  if (s.metaDescription) score += 20;
  if (s.h1Count === 1) score += 15;
  else if (s.h1Count > 1) score += 7;
  if (s.hasOpenGraph) score += 15;
  if (s.hasStructuredData) score += 15;
  if (s.analytics.length > 0) score += 15;

  return {
    score: clamp(score),
    note: "Based on page markup only — connect a successful Lighthouse run for a full SEO score.",
    evidence: [...evidence, "Full Lighthouse SEO scoring was unavailable for this scan"],
  };
}

interface CategorySpec {
  id: string;
  label: string;
  weight: number;
  threshold: number;
  opportunity: string;
  score: (s: SiteSignals, lh: LighthouseScores | null) => ScoredCategory;
}

const CATEGORY_SPECS: CategorySpec[] = [
  {
    id: "lead-capture",
    label: "Lead Capture",
    weight: 1.2,
    threshold: 70,
    opportunity:
      "Add a lead capture form above the fold with a clear value exchange (guide, checklist, or newsletter)",
    score: scoreLeadCapture,
  },
  {
    id: "cta",
    label: "Call-to-Action Strength",
    weight: 1.2,
    threshold: 70,
    opportunity: "Add stronger, high-contrast CTA buttons with one primary action per page",
    score: scoreCta,
  },
  {
    id: "follow-up",
    label: "Follow-Up Readiness",
    weight: 1.1,
    threshold: 65,
    opportunity:
      "Add an automatic email confirmation and a 3-touch follow-up workflow for every inquiry",
    score: scoreFollowUp,
  },
  {
    id: "booking-payment",
    label: "Booking / Payment Readiness",
    weight: 1.1,
    threshold: 65,
    opportunity: "Add self-service appointment booking and online payment or donation processing",
    score: scoreBookingPayment,
  },
  {
    id: "trust",
    label: "Trust Signals",
    weight: 1.0,
    threshold: 70,
    opportunity: "Add testimonials, reviews, and credibility markers near your primary CTAs",
    score: scoreTrust,
  },
  {
    id: "mobile",
    label: "Mobile Readiness",
    weight: 0.9,
    threshold: 65,
    opportunity: "Improve mobile load speed and form usability on small screens",
    score: scoreMobile,
  },
  {
    id: "seo",
    label: "SEO Readiness",
    weight: 0.8,
    threshold: 65,
    opportunity: "Add analytics tracking and baseline SEO metadata so you can measure what's working",
    score: scoreSeo,
  },
];

const GOAL_OPPORTUNITIES: Record<WebsiteGoal, string> = {
  "Get more leads": "Add a chatbot or AI assistant to engage visitors and qualify leads 24/7",
  "Book appointments": "Add automated appointment reminders to reduce no-shows",
  "Accept donations/payments": "Add recurring giving/payment options with automatic receipts",
  "Sell products": "Add abandoned-cart and post-purchase follow-up workflows",
  "Share information": "Add an email newsletter signup so visitors can subscribe to updates",
  "Build authority": "Add a lead magnet (guide or resource) to convert readers into subscribers",
};

/** Builds the audit from real scan signals. */
export function scoreAudit(
  input: AuditInput,
  signals: SiteSignals,
  lighthouse: LighthouseScores | null,
  scannedUrl: string
): AuditResult {
  const ratings: AuditRating[] = CATEGORY_SPECS.map((spec) => {
    const result = spec.score(signals, lighthouse);
    return {
      id: spec.id,
      label: spec.label,
      score: result.score,
      note: result.note,
      evidence: result.evidence,
      fromLighthouse: result.fromLighthouse,
    };
  });

  const weightTotal = CATEGORY_SPECS.reduce((sum, spec) => sum + spec.weight, 0);
  const overallScore = Math.round(
    ratings.reduce((sum, r, i) => sum + r.score * CATEGORY_SPECS[i].weight, 0) / weightTotal
  );

  const opportunities = CATEGORY_SPECS.filter(
    (spec, i) => ratings[i].score < spec.threshold
  ).map((spec) => spec.opportunity);
  opportunities.push(GOAL_OPPORTUNITIES[input.goal]);

  return {
    input,
    overallScore,
    ratings,
    opportunities: Array.from(new Set(opportunities)).slice(0, 8),
    completedAt: new Date().toISOString(),
    scannedUrl,
    lighthouseUnavailable: lighthouse?.performance == null && lighthouse?.seo == null,
    jsRenderingCaveat: signals.looksJsRendered,
  };
}

export function auditGrade(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "#13a4a1" };
  if (score >= 65) return { label: "Good", color: "#2cc0bb" };
  if (score >= 50) return { label: "Needs Work", color: "#e3a93a" };
  return { label: "At Risk", color: "#d97706" };
}
