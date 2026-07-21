CREATE TABLE "readiness_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"business_type" text,
	"answers" jsonb NOT NULL,
	"category_scores" jsonb NOT NULL,
	"total_score" integer NOT NULL,
	"tier" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
