ALTER TABLE "push_subscriptions" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "ambitions" ADD COLUMN "ambition_end_date_history" jsonb DEFAULT '[]'::jsonb NOT NULL;