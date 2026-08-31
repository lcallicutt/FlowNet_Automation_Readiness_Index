CREATE TABLE IF NOT EXISTS "website_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"email" text NOT NULL,
	"industry" text,
	"goal" text,
	"url" text NOT NULL,
	"scanned_url" text,
	"signals" jsonb NOT NULL,
	"ratings" jsonb NOT NULL,
	"overall_score" integer NOT NULL,
	"grade" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
