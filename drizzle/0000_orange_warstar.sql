CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"original_text" text NOT NULL,
	"summary" text,
	"summary_data" jsonb,
	"author" text,
	"publish_date" timestamp,
	"featured_image" text,
	"word_count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);
