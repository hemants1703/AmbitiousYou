-- Custom SQL migration file, put your code below! --

-- One-time data fix for the date timezone off-by-one bug.
-- Moves added via the ambition-detail page were stored as the user's LOCAL midnight expressed as a UTC
-- instant (e.g. 2026-06-14T18:30:00Z for an IST user who meant 2026-06-15), so on a UTC server they
-- read as the previous calendar day. Rounding each deadline to the nearest UTC day recovers the intended
-- calendar day for any real timezone (|offset| < 12h) and is a no-op for rows already at UTC midnight
-- (quick-add / create-ambition stored those correctly).
-- tasks.task_deadline is timestamptz; milestones.milestone_target_date is timestamp (no tz) — handled separately.
UPDATE "tasks"
SET "task_deadline" = (date_trunc('day', ("task_deadline" AT TIME ZONE 'UTC') + interval '12 hours')) AT TIME ZONE 'UTC';
--> statement-breakpoint
UPDATE "milestones"
SET "milestone_target_date" = date_trunc('day', "milestone_target_date" + interval '12 hours');
