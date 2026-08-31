import {
  pgTable,
  uuid,
  text,
  jsonb,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const readinessAssessments = pgTable("readiness_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  businessType: text("business_type"),
  /** All question responses, keyed by question id (1–5 each). */
  answers: jsonb("answers").notNull(),
  /** Score per category: [{ id, name, score, raw }, ...] */
  categoryScores: jsonb("category_scores").notNull(),
  /** Overall readiness score, 0–100. */
  totalScore: integer("total_score").notNull(),
  /** Leaking | Patching | Flowing | Optimized */
  tier: text("tier").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ReadinessAssessmentRow = typeof readinessAssessments.$inferSelect;
export type NewReadinessAssessment = typeof readinessAssessments.$inferInsert;

export const websiteAudits = pgTable("website_audits", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull(),
  industry: text("industry"),
  goal: text("goal"),
  /** URL as submitted by the visitor. */
  url: text("url").notNull(),
  /** URL actually scanned, after following redirects. */
  scannedUrl: text("scanned_url"),
  /** Raw detection output from lib/signals.ts. */
  signals: jsonb("signals").notNull(),
  /** Per-category ratings: [{ id, label, score, note, evidence }, ...] */
  ratings: jsonb("ratings").notNull(),
  /** Overall audit score, 0–100. */
  overallScore: integer("overall_score").notNull(),
  /** Excellent | Good | Needs Work | At Risk */
  grade: text("grade").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WebsiteAuditRow = typeof websiteAudits.$inferSelect;
export type NewWebsiteAudit = typeof websiteAudits.$inferInsert;
