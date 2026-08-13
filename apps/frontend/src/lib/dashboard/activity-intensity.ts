/**
 * Shared sequential activity scale for the year heatmap and movement bars.
 *
 * Uses the theme's shadcn chart blues (`--chart-1` → `--chart-4`): light = less,
 * dark = more. Soft secondary viz — readable on inspection, never the dashboard hero.
 */

export type ActivityLevel = 0 | 1 | 2 | 3 | 4;

export const ACTIVITY_LEVELS: ActivityLevel[] = [0, 1, 2, 3, 4];

/** Tailwind classes for heatmap cells / legends. */
export const ACTIVITY_LEVEL_CLASS: Record<ActivityLevel, string> = {
  0: "bg-muted",
  1: "bg-chart-1",
  2: "bg-chart-2",
  3: "bg-chart-3",
  4: "bg-chart-4",
};

/** Paint fills for Recharts bars — theme chart tokens from globals.css. */
export const ACTIVITY_LEVEL_FILL: Record<ActivityLevel, string> = {
  0: "var(--muted)",
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
};

/** Map a day's count onto 0–4 relative to the busiest day in the same range. */
export function activityLevelFor(count: number, maxCount: number): ActivityLevel {
  if (count <= 0) return 0;
  if (maxCount <= 0) return 1;
  return Math.min(4, Math.ceil((count / maxCount) * 4)) as ActivityLevel;
}
