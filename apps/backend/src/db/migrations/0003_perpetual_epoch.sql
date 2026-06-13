ALTER TABLE "tasks" ADD COLUMN "task_completed_at" timestamp (3);--> statement-breakpoint
ALTER TABLE "milestones" ADD COLUMN "milestone_completed_at" timestamp (3);--> statement-breakpoint
-- Backfill: seed already-completed moves with their last-edit time (updated_at) so the movement chart
-- has history on day one. Approximate for pre-existing rows; new completions are stamped exactly.
-- Idempotent: the IS NULL guard only ever fills, never overwrites an exact stamp.
UPDATE "tasks" SET "task_completed_at" = "updated_at" WHERE "task_completed" = true AND "task_completed_at" IS NULL;--> statement-breakpoint
UPDATE "milestones" SET "milestone_completed_at" = "updated_at" WHERE "milestone_completed" = true AND "milestone_completed_at" IS NULL;