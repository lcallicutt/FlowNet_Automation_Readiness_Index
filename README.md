# FlowNet Automation Readiness Index

**Know what to automate before you automate.**

A SaaS web app that helps churches, small businesses, nonprofits, coaches, and
solo founders evaluate how ready they are for automation and AI-powered
systems — and shows them what to automate first.

## Tools

1. **Automation Readiness Index** — a 30-question assessment across 10
   operational categories (lead capture, follow-up, communication, website,
   scheduling, payments, client management, reporting, documentation, and
   AI/automation usage). Produces a 0–100 readiness score, a readiness level,
   a category breakdown, top-3 weakest areas, prioritized recommendations,
   and an estimated weekly time-saving opportunity.
2. **Website Automation Audit** — enter a URL, business name, industry,
   email, and website goal to receive a simulated automation audit with
   ratings for lead capture, CTAs, follow-up readiness, booking/payments,
   trust signals, mobile, and SEO, plus suggested automation opportunities.

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page — hero, audiences, how it works, sample scores, pricing preview, FAQ |
| `/assessment` | Multi-step readiness quiz (10 categories × 3 questions, 1–5 scale) with email capture |
| `/results` | Score, readiness level, category breakdown, recommendations, and upgrade CTAs |
| `/audit` | Website Automation Audit form and simulated results |
| `/pricing` | Free / Pro Audit ($97) / Strategy Session ($297) tiers |
| `/dashboard` | Latest scores, assessment history, next steps, upgrade and booking CTAs |

## Scoring

Each of the 30 questions is answered on a 1–5 scale
(1 = Not in place → 5 = Automated or optimized). The overall score is the
percentage of the maximum possible points. Readiness levels:

| Score | Level |
| --- | --- |
| 0–39 | Manual Mode |
| 40–59 | System Starter |
| 60–79 | Automation Ready |
| 80–100 | Scalable Systems |

## Tech Stack

- [Next.js 14](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Neon Postgres](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) for assessment storage
- localStorage cache for the results/dashboard pages
- Mock/simulated logic clearly marked for future integrations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup (Neon via Vercel)

Assessment submissions are stored in a `readiness_assessments` table in Neon
Postgres (see `db/schema.ts`). One-time setup:

1. In the Vercel dashboard, open the project → **Storage** tab → **Create
   Database** → choose **Neon** (Marketplace) → connect it to this project.
   Vercel injects `DATABASE_URL` into all environments automatically.
2. For local dev, copy the connection string into `.env.local`
   (see `.env.example`).
3. Create the table: `npm run db:push` (applies `db/schema.ts` directly), or
   run the committed SQL migration in `drizzle/` against the database.

### Lead flow

Completing the assessment requires name + email + business type before the
score is shown. Submissions POST to `/api/assessment`, which recomputes the
scores server-side, inserts the row into Neon, and then — if
`GHL_WEBHOOK_URL` is set — POSTs a small tagging payload (`name`, `email`,
`tier`, `top_weakest_category`) to GoHighLevel. The webhook is a
notification only: if it fails, the assessment is still saved and the user
still sees their score. Tiers: 0–39 Leaking, 40–59 Patching, 60–79 Flowing,
80–100 Optimized.

## Planned Integrations

The code is structured so these can be connected later without rework:

- **User accounts** — replace the localStorage layer in `lib/storage.ts`
  with per-user queries against the existing Neon database
- **Stripe** — swap `components/BookingLink.tsx` usages for real checkout
  sessions where an instant purchase is wanted (all upgrade CTAs currently
  route to the consultation booking calendar in `lib/config.ts`)
- **OpenAI / Claude API** — enrich `lib/assessment.ts` recommendations with
  personalized AI-generated roadmaps
- **Website scanner API** — replace the deterministic mock generator in
  `lib/audit.ts` with live scanning
- **PDF generation** — add a report download to the dashboard (the earlier
  placeholder button is hidden until the feature exists)
- **GoHighLevel** — set `GHL_WEBHOOK_URL` to enable contact tagging (already
  wired in `app/api/assessment/route.ts`)
- **Google Analytics** — add tracking
