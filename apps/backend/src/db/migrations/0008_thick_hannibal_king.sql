CREATE TYPE "public"."ContractMoveKind" AS ENUM('task', 'milestone');--> statement-breakpoint
CREATE TYPE "public"."ContractStatus" AS ENUM('active', 'completed', 'snoozed');--> statement-breakpoint
CREATE TABLE "daily_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"ambition_id" uuid NOT NULL,
	"move_kind" "ContractMoveKind" NOT NULL,
	"move_id" uuid NOT NULL,
	"local_date" date NOT NULL,
	"status" "ContractStatus" DEFAULT 'active' NOT NULL,
	"if_trigger" text,
	"then_action" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "daily_contracts_user_local_date_key" UNIQUE("user_id","local_date")
);
--> statement-breakpoint
ALTER TABLE "daily_contracts" ADD CONSTRAINT "daily_contracts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "daily_contracts" ADD CONSTRAINT "daily_contracts_ambition_id_ambitions_id_fk" FOREIGN KEY ("ambition_id") REFERENCES "public"."ambitions"("id") ON DELETE cascade ON UPDATE cascade;