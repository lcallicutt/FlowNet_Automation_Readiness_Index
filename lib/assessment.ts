export interface Question {
  id: string;
  text: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  questions: Question[];
  lowScoreAdvice: string;
  nextStep: string;
}

export const SCALE_LABELS: Record<number, string> = {
  1: "Not in place",
  2: "Manual and inconsistent",
  3: "Somewhat organized",
  4: "Mostly systemized",
  5: "Automated or optimized",
};

export const CATEGORIES: Category[] = [
  {
    id: "lead-capture",
    name: "Lead Capture",
    icon: "🧲",
    description: "How new leads and inquiries enter your world.",
    questions: [
      { id: "lc1", text: "New leads and inquiries are captured through a consistent channel (form, landing page, or intake process)." },
      { id: "lc2", text: "Every new lead is stored in one central place (CRM, database, or organized list) rather than scattered inboxes." },
      { id: "lc3", text: "New leads automatically receive a confirmation or welcome message when they reach out." },
    ],
    lowScoreAdvice:
      "Your business may be missing opportunities because leads are not being captured consistently. Start with a simple contact form, CRM pipeline, and automatic confirmation email.",
    nextStep: "Set up a lead capture form connected to a simple CRM pipeline with an automatic confirmation email.",
  },
  {
    id: "follow-up",
    name: "Follow-Up",
    icon: "🔁",
    description: "What happens after someone shows interest.",
    questions: [
      { id: "fu1", text: "There is a defined follow-up process for new leads and inquiries (not just memory)." },
      { id: "fu2", text: "Follow-up messages go out on a reliable schedule, even during busy weeks." },
      { id: "fu3", text: "Leads who go quiet are re-engaged automatically or on a planned cadence." },
    ],
    lowScoreAdvice:
      "You may be relying too much on memory or manual reminders. Add an automated follow-up sequence for new leads and inquiries.",
    nextStep: "Build a 3-touch automated follow-up sequence for every new lead or inquiry.",
  },
  {
    id: "communication",
    name: "Customer Communication",
    icon: "💬",
    description: "How you keep customers, clients, or members informed.",
    questions: [
      { id: "cc1", text: "Routine updates (newsletters, announcements, reminders) go out on a consistent schedule." },
      { id: "cc2", text: "Common questions are answered with reusable templates, FAQs, or automated replies." },
      { id: "cc3", text: "Communication is segmented so people receive messages relevant to them." },
    ],
    lowScoreAdvice:
      "Inconsistent communication makes it hard to build trust. Set up an email platform with reusable templates and a simple recurring sending schedule.",
    nextStep: "Choose one communication channel and set up a recurring, templated update rhythm.",
  },
  {
    id: "website",
    name: "Website & Online Presence",
    icon: "🌐",
    description: "How well your website works for you 24/7.",
    questions: [
      { id: "wp1", text: "Your website clearly explains what you do and what a visitor should do next." },
      { id: "wp2", text: "Your website captures leads, bookings, donations, or sales — not just information." },
      { id: "wp3", text: "Your website content and listings (hours, services, links) are current and maintained." },
    ],
    lowScoreAdvice:
      "Your website may be acting like a brochure instead of a system. Add clear calls-to-action and at least one way for visitors to take a next step (form, booking, or payment).",
    nextStep: "Add one clear call-to-action and a lead capture form to your website homepage.",
  },
  {
    id: "scheduling",
    name: "Scheduling",
    icon: "📅",
    description: "How appointments and meetings get booked.",
    questions: [
      { id: "sc1", text: "People can book time with you without back-and-forth messages." },
      { id: "sc2", text: "Booked appointments trigger automatic confirmations and reminders." },
      { id: "sc3", text: "Your calendar, availability, and bookings stay in sync automatically." },
    ],
    lowScoreAdvice:
      "Back-and-forth scheduling is a silent time thief. Use a booking tool with automatic confirmations and reminders so appointments book themselves.",
    nextStep: "Set up an online booking link with automatic confirmations and reminders.",
  },
  {
    id: "payments",
    name: "Payments & Donations",
    icon: "💳",
    description: "How money comes in and gets recorded.",
    questions: [
      { id: "pd1", text: "People can pay or donate online without manual invoicing or chasing." },
      { id: "pd2", text: "Payments and donations trigger automatic receipts and thank-you messages." },
      { id: "pd3", text: "Recurring payments, giving, or subscriptions are supported and automated." },
    ],
    lowScoreAdvice:
      "Manual payment collection slows cash flow and creates friction. Add online payment or giving options with automatic receipts and support for recurring transactions.",
    nextStep: "Enable online payments or giving with automatic receipts and a recurring option.",
  },
  {
    id: "client-management",
    name: "Client/Member Management",
    icon: "🗂️",
    description: "How you track relationships and their history.",
    questions: [
      { id: "cm1", text: "Client, customer, or member records live in one organized system." },
      { id: "cm2", text: "You can quickly see a person's history — interactions, purchases, attendance, or giving." },
      { id: "cm3", text: "Onboarding new clients or members follows a repeatable, semi-automated process." },
    ],
    lowScoreAdvice:
      "Relationship data scattered across spreadsheets and inboxes limits growth. Centralize records in a CRM or membership system with a repeatable onboarding flow.",
    nextStep: "Move client or member records into one CRM and document a repeatable onboarding checklist.",
  },
  {
    id: "reporting",
    name: "Reporting & Data",
    icon: "📊",
    description: "How you know what's working.",
    questions: [
      { id: "rd1", text: "You review key numbers (leads, revenue, attendance, engagement) on a regular schedule." },
      { id: "rd2", text: "Reports are generated automatically or with minimal manual effort." },
      { id: "rd3", text: "Data from different tools (website, email, payments) is connected or consolidated." },
    ],
    lowScoreAdvice:
      "Without visible numbers, decisions rely on gut feel. Start with a simple dashboard that pulls your 3–5 most important metrics automatically.",
    nextStep: "Pick 3 key metrics and set up a simple automated dashboard or weekly report.",
  },
  {
    id: "documentation",
    name: "Documentation / SOPs",
    icon: "📘",
    description: "Whether your processes live outside your head.",
    questions: [
      { id: "ds1", text: "Your repeatable tasks and processes are written down as checklists or SOPs." },
      { id: "ds2", text: "Someone new could complete your core tasks using your documentation alone." },
      { id: "ds3", text: "Documentation is stored centrally and kept up to date." },
    ],
    lowScoreAdvice:
      "Your business knowledge may be living in your head. Start documenting repeatable tasks so they can later be automated or delegated.",
    nextStep: "Document your top 3 repeatable tasks as step-by-step checklists this week.",
  },
  {
    id: "ai-automation",
    name: "AI & Automation Usage",
    icon: "🤖",
    description: "How much technology already works for you.",
    questions: [
      { id: "ai1", text: "You currently use automation tools (Zapier, Make, n8n, email automation, etc.) for repetitive work." },
      { id: "ai2", text: "You use AI tools (writing, chat assistants, summarization) in your regular workflow." },
      { id: "ai3", text: "You have a clear idea of which tasks you want to automate next." },
    ],
    lowScoreAdvice:
      "You're likely doing work a machine could handle. Start with one simple automation — like auto-sending a welcome email — and build from there.",
    nextStep: "Pick one repetitive weekly task and automate it end-to-end as a pilot project.",
  },
];

export const QUESTIONS_PER_CATEGORY = 3;
export const TOTAL_QUESTIONS = CATEGORIES.length * QUESTIONS_PER_CATEGORY;

export interface CategoryScore {
  id: string;
  name: string;
  icon: string;
  /** 0–100 */
  score: number;
  /** raw 3–15 */
  raw: number;
}

export interface ReadinessLevel {
  name: string;
  min: number;
  max: number;
  color: string;
  summary: string;
}

export const READINESS_LEVELS: ReadinessLevel[] = [
  {
    name: "Manual Mode",
    min: 0,
    max: 39,
    color: "#e3a93a",
    summary:
      "Most of your operations depend on manual effort and memory. The good news: you have the biggest time-saving opportunity ahead of you.",
  },
  {
    name: "System Starter",
    min: 40,
    max: 59,
    color: "#6189c0",
    summary:
      "You have some systems in place, but they're inconsistent. A few focused automations would free up meaningful time every week.",
  },
  {
    name: "Automation Ready",
    min: 60,
    max: 79,
    color: "#2cc0bb",
    summary:
      "Your foundations are solid. You're in a strong position to layer in automation and AI that compounds your existing systems.",
  },
  {
    name: "Scalable Systems",
    min: 80,
    max: 100,
    color: "#13a4a1",
    summary:
      "Your operations are well systemized. Focus on optimizing, connecting tools, and using AI for higher-leverage work.",
  },
];

export function getReadinessLevel(score: number): ReadinessLevel {
  return (
    READINESS_LEVELS.find((l) => score >= l.min && score <= l.max) ??
    READINESS_LEVELS[0]
  );
}

/**
 * CRM tier names used for the database record and GHL contact tagging.
 * Same score bands as the on-screen readiness levels.
 */
export const TIERS = [
  { name: "Leaking", min: 0, max: 39 },
  { name: "Patching", min: 40, max: 59 },
  { name: "Flowing", min: 60, max: 79 },
  { name: "Optimized", min: 80, max: 100 },
] as const;

export type Tier = (typeof TIERS)[number]["name"];

export function getTier(score: number): Tier {
  return (TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0]).name;
}

export interface AssessmentResult {
  overallScore: number;
  levelName: string;
  tier: Tier;
  categoryScores: CategoryScore[];
  weakestCategories: CategoryScore[];
  recommendations: { category: string; icon: string; advice: string }[];
  nextSteps: string[];
  estimatedHoursSavedPerWeek: number;
  completedAt: string;
  email?: string;
  businessType?: string;
  name?: string;
}

/**
 * answers: map of question id -> 1..5
 */
export function calculateResults(
  answers: Record<string, number>,
  email?: string,
  businessType?: string,
  name?: string
): AssessmentResult {
  const categoryScores: CategoryScore[] = CATEGORIES.map((cat) => {
    const raw = cat.questions.reduce((sum, q) => sum + (answers[q.id] ?? 1), 0);
    const max = cat.questions.length * 5;
    return {
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      raw,
      score: Math.round((raw / max) * 100),
    };
  });

  const totalRaw = categoryScores.reduce((s, c) => s + c.raw, 0);
  const overallScore = Math.round((totalRaw / (TOTAL_QUESTIONS * 5)) * 100);

  const weakestCategories = [...categoryScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const recommendations = weakestCategories.map((weak) => {
    const cat = CATEGORIES.find((c) => c.id === weak.id)!;
    return { category: cat.name, icon: cat.icon, advice: cat.lowScoreAdvice };
  });

  const nextSteps = weakestCategories.map(
    (weak) => CATEGORIES.find((c) => c.id === weak.id)!.nextStep
  );

  // Rough model: a fully manual operation wastes ~20 hrs/week on automatable work.
  const estimatedHoursSavedPerWeek = Math.max(
    1,
    Math.round(((100 - overallScore) / 100) * 20)
  );

  return {
    overallScore,
    levelName: getReadinessLevel(overallScore).name,
    tier: getTier(overallScore),
    categoryScores,
    weakestCategories,
    recommendations,
    nextSteps,
    estimatedHoursSavedPerWeek,
    completedAt: new Date().toISOString(),
    email,
    businessType,
    name,
  };
}
