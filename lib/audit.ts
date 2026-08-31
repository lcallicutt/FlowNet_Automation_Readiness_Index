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
  placeholder?: boolean;
}

export interface AuditResult {
  input: AuditInput;
  overallScore: number;
  ratings: AuditRating[];
  opportunities: string[];
  completedAt: string;
}

/**
 * IMPORTANT: this generator does NOT scan the submitted site. Scores are
 * illustrative estimates derived from a hash of the URL, so the same URL
 * always produces the same numbers. Every rating is therefore marked as an
 * estimate in the UI, and no note claims to have detected anything on the
 * visitor's site — they describe what good looks like instead.
 *
 * Being replaced by a real server-side scan (/api/audit).
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function seededScore(seed: number, salt: number, min: number, max: number): number {
  const x = Math.sin(seed + salt * 9973) * 10000;
  const frac = x - Math.floor(x);
  return Math.round(min + frac * (max - min));
}

interface RatingSpec {
  id: string;
  label: string;
  salt: number;
  min: number;
  max: number;
  weight: number;
  placeholder?: boolean;
  note: (score: number) => string;
  opportunity: string;
  /** Include the opportunity when score is below this threshold. */
  threshold: number;
}

const RATING_SPECS: RatingSpec[] = [
  {
    id: "lead-capture",
    label: "Lead Capture",
    salt: 1,
    min: 25,
    max: 85,
    weight: 1.2,
    threshold: 70,
    note: () =>
      "What strong lead capture looks like: a form above the fold with a clear value exchange — a guide, checklist, or newsletter — so visitors have a reason to leave their email.",
    opportunity: "Add a lead capture form above the fold with a clear value exchange (guide, checklist, or newsletter)",
  },
  {
    id: "cta",
    label: "Call-to-Action Strength",
    salt: 2,
    min: 30,
    max: 90,
    weight: 1.2,
    threshold: 70,
    note: () =>
      "What strong CTAs look like: one primary action per page, in high-contrast buttons with specific action language — \"Book your free call,\" not \"Submit.\"",
    opportunity: "Add stronger, high-contrast CTA buttons with one primary action per page",
  },
  {
    id: "follow-up",
    label: "Follow-Up Readiness",
    salt: 3,
    min: 20,
    max: 80,
    weight: 1.1,
    threshold: 65,
    note: () =>
      "What strong follow-up looks like: every inquiry triggers an instant confirmation, then an automated sequence — no lead waits on someone remembering to reply.",
    opportunity: "Add an automatic email confirmation and a 3-touch follow-up workflow for every inquiry",
  },
  {
    id: "booking-payment",
    label: "Booking / Payment Readiness",
    salt: 4,
    min: 20,
    max: 85,
    weight: 1.1,
    threshold: 65,
    note: () =>
      "What strong booking/payment looks like: visitors self-serve in a few clicks — pick a time or pay online — without trading emails or phone tag first.",
    opportunity: "Add self-service appointment booking and online payment or donation processing",
  },
  {
    id: "trust",
    label: "Trust Signals",
    salt: 5,
    min: 35,
    max: 90,
    weight: 1.0,
    threshold: 70,
    note: () =>
      "What strong trust signals look like: specific testimonials with real names and results, review counts, and credentials placed right next to your primary CTAs.",
    opportunity: "Add testimonials, reviews, and credibility markers near your primary CTAs",
  },
  {
    id: "mobile",
    label: "Mobile Readiness",
    salt: 6,
    min: 40,
    max: 90,
    weight: 0.7,
    placeholder: true,
    threshold: 60,
    note: () =>
      "What strong mobile readiness looks like: tap targets big enough for thumbs, forms that complete on one screen, and fast loads on a phone connection.",
    opportunity: "Verify mobile usability: tap targets, load speed, and form completion on small screens",
  },
  {
    id: "seo",
    label: "SEO Readiness",
    salt: 7,
    min: 30,
    max: 85,
    weight: 0.7,
    placeholder: true,
    threshold: 60,
    note: () =>
      "What strong SEO readiness looks like: a descriptive title and meta description on every page, one clear H1, and analytics installed so you can measure what's working.",
    opportunity: "Add analytics tracking and baseline SEO metadata so you can measure what's working",
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

export function generateAudit(input: AuditInput): AuditResult {
  const normalizedUrl = input.url.trim().toLowerCase().replace(/\/+$/, "");
  const seed = hashString(normalizedUrl + input.goal);

  const ratings: AuditRating[] = RATING_SPECS.map((spec) => {
    const score = seededScore(seed, spec.salt, spec.min, spec.max);
    return {
      id: spec.id,
      label: spec.label,
      score,
      note: spec.note(score),
      placeholder: spec.placeholder,
    };
  });

  const weightTotal = RATING_SPECS.reduce((s, r) => s + r.weight, 0);
  const overallScore = Math.round(
    ratings.reduce((sum, r, i) => sum + r.score * RATING_SPECS[i].weight, 0) /
      weightTotal
  );

  const opportunities = RATING_SPECS.filter(
    (spec, i) => ratings[i].score < spec.threshold
  ).map((spec) => spec.opportunity);

  opportunities.push(GOAL_OPPORTUNITIES[input.goal]);

  return {
    input,
    overallScore,
    ratings,
    opportunities: Array.from(new Set(opportunities)).slice(0, 8),
    completedAt: new Date().toISOString(),
  };
}

export function auditGrade(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "#13a4a1" };
  if (score >= 65) return { label: "Good", color: "#2cc0bb" };
  if (score >= 50) return { label: "Needs Work", color: "#e3a93a" };
  return { label: "At Risk", color: "#d97706" };
}
