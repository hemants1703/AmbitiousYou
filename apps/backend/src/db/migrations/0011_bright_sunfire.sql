ALTER TABLE "settings" ADD COLUMN "week_start_day" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "week_end_day" integer DEFAULT 6 NOT NULL;