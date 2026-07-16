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
