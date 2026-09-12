CREATE TYPE "public"."UserPlan" AS ENUM('free', 'pro');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" "UserPlan" DEFAULT 'free' NOT NULL;