ALTER TABLE "settings" ADD COLUMN "email_account_activity" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "push_ambition_reminders" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_unique" UNIQUE("user_id");