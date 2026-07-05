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
- Local storage persistence (swap for Supabase later)
- Mock/simulated logic clearly marked for future integrations

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Planned Integrations

The code is structured so these can be connected later without rework:

- **Supabase** — replace `lib/storage.ts` with database queries for user
  accounts and saved reports
- **Stripe** — replace `components/PlaceholderButton.tsx` (kind `stripe`)
  with real checkout sessions
- **OpenAI / Claude API** — enrich `lib/assessment.ts` recommendations with
  personalized AI-generated roadmaps
- **Website scanner API** — replace the deterministic mock generator in
  `lib/audit.ts` with live scanning
- **PDF generation** — wire the PDF placeholder button to a report generator
- **n8n / GoHighLevel** — route captured emails and leads
- **Google Analytics** — add tracking
