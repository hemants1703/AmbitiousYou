CREATE TABLE "weekly_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"ambition_id" uuid NOT NULL,
	"week_start_date" date NOT NULL,
	"moved" text NOT NULL,
	"stalled" text NOT NULL,
	"skip_reason" text,
	"next_week_contract" text NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "weekly_reviews_user_week_key" UNIQUE("user_id","week_start_date")
);
--> statement-breakpoint
ALTER TABLE "weekly_reviews" ADD CONSTRAINT "weekly_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "weekly_reviews" ADD CONSTRAINT "weekly_reviews_ambition_id_ambitions_id_fk" FOREIGN KEY ("ambition_id") REFERENCES "public"."ambitions"("id") ON DELETE cascade ON UPDATE cascade;