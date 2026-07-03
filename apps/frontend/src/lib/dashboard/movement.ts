import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { dayKey, getItemCompletedAt, getItemKind, getTrackedItems, isItemCompleted } from "./tracked-items";

/**
 * Pure, server-side aggregation for the dashboard movement chart. Buckets completed moves by their
 * completion day across all of a user's ambitions over a rolling 7/14/30-day window. Output is
 * serializable primitives only (strings/numbers) so it crosses to the client chart without Date
 * objects — all "today"/day-bucket math happens here, avoiding timezone-sensitive hydration drift.
 */

export type MovementWindow = 7 | 14 | 30;

export interface MovementDay {
  /** Local calendar day, yyyy-mm-dd. */
  dateKey: string;
  /** Short axis/tooltip label, e.g. "Jun 13". */
  label: string;
  taskCount: number;
  milestoneCount: number;
  total: number;
}

export interface MovementStats {
  totalCompleted: number;
  /** Mean completions per day across the window, to 1 decimal. */
  dailyAverage: number;
  bestDay: { dateKey: string; label: string; total: number } | null;
  /** Consecutive days ending today, each with at least one completion. */
  currentStreak: number;
  /** Ambitions whose completion date falls inside the window. */
  ambitionsCompletedInWindow: number;
  taskCount: number;
  milestoneCount: number;
  /** Whether any completed move anywhere has a usable completion timestamp (drives the empty state). */
  hasAnyCompletionEver: boolean;
}

export interface MovementSeries {
  window: MovementWindow;
  /** Exactly `window` entries, oldest → newest, zero-filled. */
  days: MovementDay[];
  stats: MovementStats;
}

export const MOVEMENT_WINDOWS: MovementWindow[] = [7, 14, 30];

const LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const DAY_MS = 24 * 60 * 60 * 1000;

function toLocalMidnight(value: Date | string): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Build the per-day series + headline stats for one window. `now` is injectable for testing and so the
 * server owns "today". Only currently-completed moves with a non-null completion timestamp are counted.
 */
export function buildMovementSeries(ambitions: AmbitionDetails[], window: MovementWindow, now: Date = new Date()): MovementSeries {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  // Zero-filled scaffold so quiet days render as empty bars, never gaps.
  const days: MovementDay[] = [];
  const indexByKey = new Map<string, number>();
  for (let offset = window - 1; offset >= 0; offset--) {
    const day = new Date(todayMs - offset * DAY_MS);
    day.setHours(0, 0, 0, 0); // re-normalise after ms subtraction (DST-safe key)
    const key = dayKey(day);
    indexByKey.set(key, days.length);
    days.push({ dateKey: key, label: LABEL_FORMATTER.format(day), taskCount: 0, milestoneCount: 0, total: 0 });
  }

  let hasAnyCompletionEver = false;

  for (const ambition of ambitions) {
    for (const item of getTrackedItems(ambition)) {
      if (!isItemCompleted(item)) continue;
      const completedAt = getItemCompletedAt(item);
      if (!completedAt) continue;
      hasAnyCompletionEver = true;

      const day = toLocalMidnight(completedAt);
      if (!day) continue;
      const index = indexByKey.get(dayKey(day));
      if (index === undefined) continue; // completed outside this window

      const bucket = days[index];
      if (getItemKind(item) === "task") bucket.taskCount += 1;
      else bucket.milestoneCount += 1;
      bucket.total += 1;
    }
  }

  let taskCount = 0;
  let milestoneCount = 0;
  let bestDay: MovementStats["bestDay"] = null;
  for (const day of days) {
    taskCount += day.taskCount;
    milestoneCount += day.milestoneCount;
    if (day.total > 0 && (bestDay === null || day.total > bestDay.total)) {
      bestDay = { dateKey: day.dateKey, label: day.label, total: day.total };
    }
  }
  const totalCompleted = taskCount + milestoneCount;

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].total > 0) currentStreak += 1;
    else break;
  }

  let ambitionsCompletedInWindow = 0;
  for (const ambition of ambitions) {
    if (ambition.ambitionStatus !== "completed" || !ambition.ambitionCompletionDate) continue;
    const completedDay = toLocalMidnight(ambition.ambitionCompletionDate);
    if (completedDay && indexByKey.has(dayKey(completedDay))) ambitionsCompletedInWindow += 1;
  }

  return {
    window,
    days,
    stats: {
      totalCompleted,
      dailyAverage: Math.round((totalCompleted / window) * 10) / 10,
      bestDay,
      currentStreak,
      ambitionsCompletedInWindow,
      taskCount,
      milestoneCount,
      hasAnyCompletionEver,
    },
  };
}

/** Build all three windows at once (cheap passes over in-memory data) so the client toggle is instant. */
export function buildAllMovementSeries(ambitions: AmbitionDetails[], now: Date = new Date()): Record<MovementWindow, MovementSeries> {
  return {
    7: buildMovementSeries(ambitions, 7, now),
    14: buildMovementSeries(ambitions, 14, now),
    30: buildMovementSeries(ambitions, 30, now),
  };
}
