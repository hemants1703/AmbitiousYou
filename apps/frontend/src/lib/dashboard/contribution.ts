import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import { eachDayOfInterval, startOfWeek, subWeeks } from "date-fns";
import { dayKey, getItemCompletedAt, getItemKind, getTrackedItems, isItemCompleted } from "./tracked-items";

/**
 * Pure, server-side aggregation for the GitHub-style contribution calendar. Buckets completed moves by
 * their completion day across a rolling ~52 weeks (Sunday-aligned, so columns are full weeks) and emits
 * a serializable week × weekday grid. Mirrors {@link buildMovementSeries} conventions: local-midnight
 * bucketing, `now` injectable, only strings/numbers cross to the client (no Date objects), and the same
 * "currently-completed move with a non-null completion timestamp" rule so the calendar and the bar chart
 * never disagree about a day.
 */

export interface ContributionDay {
  /** Local calendar day, yyyy-mm-dd. */
  dateKey: string;
  /** Full tooltip label, e.g. "Jun 12, 2026". */
  label: string;
  taskCount: number;
  milestoneCount: number;
  count: number;
  /** 0 = none; 1–4 scaled against the user's busiest day in range. */
  level: 0 | 1 | 2 | 3 | 4;
}

/** Seven slots, Sunday → Saturday. `null` = a day outside the range (future days in the current week). */
export type ContributionWeek = (ContributionDay | null)[];

export interface ContributionMonthLabel {
  /** Column (week) index the month's first appearance aligns to. */
  weekIndex: number;
  label: string;
}

export interface ContributionStats {
  totalCompleted: number;
  activeDays: number;
  longestStreak: number;
  /** Consecutive days ending today, each with at least one completion. */
  currentStreak: number;
  /** Year totals by move kind. */
  taskCount: number;
  milestoneCount: number;
  /** The single busiest day in range. */
  bestDay: { dateKey: string; label: string; count: number } | null;
  /** The weekday the user completes the most moves on. */
  busiestWeekday: { index: number; label: string; count: number } | null;
  hasAnyCompletionEver: boolean;
}

export interface ContributionCalendar {
  weeks: ContributionWeek[];
  numWeeks: number;
  monthLabels: ContributionMonthLabel[];
  /** "Sun".."Sat", index 0..6 → grid rows. */
  weekdayLabels: string[];
  stats: ContributionStats;
  rangeStartKey: string;
  rangeEndKey: string;
}

const FULL_LABEL_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });
const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKS_BACK = 52;

function toLocalMidnight(value: Date | string): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function buildContributionCalendar(ambitions: AmbitionDetails[], now: Date = new Date()): ContributionCalendar {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayKey = dayKey(today);

  // Sunday-aligned start 52 weeks back, end on the Saturday of the current week → 53 full columns.
  const startDate = startOfWeek(subWeeks(today, WEEKS_BACK), { weekStartsOn: 0 });
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + (6 - today.getDay()));
  endDate.setHours(0, 0, 0, 0);
  const rangeStartKey = dayKey(startDate);

  // Count completed moves per day. yyyy-mm-dd keys compare lexicographically == chronologically.
  const counts = new Map<string, { task: number; milestone: number; total: number }>();
  let hasAnyCompletionEver = false;
  for (const ambition of ambitions) {
    for (const item of getTrackedItems(ambition)) {
      if (!isItemCompleted(item)) continue;
      const completedAt = getItemCompletedAt(item);
      if (!completedAt) continue;
      hasAnyCompletionEver = true;
      const day = toLocalMidnight(completedAt);
      if (!day) continue;
      const key = dayKey(day);
      if (key < rangeStartKey || key > todayKey) continue;
      const bucket = counts.get(key) ?? { task: 0, milestone: 0, total: 0 };
      if (getItemKind(item) === "task") bucket.task += 1;
      else bucket.milestone += 1;
      bucket.total += 1;
      counts.set(key, bucket);
    }
  }

  let maxCount = 0;
  for (const bucket of counts.values()) if (bucket.total > maxCount) maxCount = bucket.total;
  const levelFor = (count: number): ContributionDay["level"] => {
    if (count <= 0) return 0;
    if (maxCount <= 0) return 1; // unreachable for count > 0, but keeps the divide safe
    return Math.min(4, Math.ceil((count / maxCount) * 4)) as ContributionDay["level"];
  };

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks: ContributionWeek[] = [];
  const monthLabels: ContributionMonthLabel[] = [];
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
  let bestDay: ContributionStats["bestDay"] = null;
  let lastMonth = -1;

  for (let w = 0; w * 7 < allDays.length; w += 1) {
    const week: ContributionWeek = [];
    let monthMarked = false;
    for (let d = 0; d < 7; d += 1) {
      const date = allDays[w * 7 + d];
      if (!date) {
        week.push(null);
        continue;
      }
      const dn = new Date(date);
      dn.setHours(0, 0, 0, 0);
      const key = dayKey(dn);
      if (key > todayKey) {
        week.push(null); // future day in the current week
        continue;
      }
      const bucket = counts.get(key);
      const count = bucket?.total ?? 0;
      const label = FULL_LABEL_FORMATTER.format(dn);
      week.push({
        dateKey: key,
        label,
        taskCount: bucket?.task ?? 0,
        milestoneCount: bucket?.milestone ?? 0,
        count,
        level: levelFor(count),
      });
      if (count > 0) {
        weekdayTotals[dn.getDay()] += count;
        if (bestDay === null || count > bestDay.count) bestDay = { dateKey: key, label, count };
      }
      // Mark the month at the first real day of the week whose month differs from the previous column.
      if (!monthMarked) {
        const month = dn.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ weekIndex: w, label: MONTH_FORMATTER.format(dn) });
          lastMonth = month;
        }
        monthMarked = true;
      }
    }
    weeks.push(week);
  }

  let totalCompleted = 0;
  let activeDays = 0;
  let taskCount = 0;
  let milestoneCount = 0;
  for (const bucket of counts.values()) {
    totalCompleted += bucket.total;
    taskCount += bucket.task;
    milestoneCount += bucket.milestone;
    if (bucket.total > 0) activeDays += 1;
  }

  // Streaks over the contiguous day sequence (start → today).
  const sequence: number[] = [];
  for (const date of allDays) {
    const dn = new Date(date);
    dn.setHours(0, 0, 0, 0);
    const key = dayKey(dn);
    if (key > todayKey) break;
    sequence.push(counts.get(key)?.total ?? 0);
  }
  let longestStreak = 0;
  let run = 0;
  for (const total of sequence) {
    if (total > 0) {
      run += 1;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }
  let currentStreak = 0;
  for (let i = sequence.length - 1; i >= 0; i -= 1) {
    if (sequence[i] > 0) currentStreak += 1;
    else break;
  }

  let busiestWeekday: ContributionStats["busiestWeekday"] = null;
  for (let i = 0; i < 7; i += 1) {
    if (weekdayTotals[i] > 0 && (busiestWeekday === null || weekdayTotals[i] > busiestWeekday.count)) {
      busiestWeekday = { index: i, label: WEEKDAY_LONG[i], count: weekdayTotals[i] };
    }
  }

  return {
    weeks,
    numWeeks: weeks.length,
    monthLabels,
    weekdayLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    stats: { totalCompleted, activeDays, longestStreak, currentStreak, taskCount, milestoneCount, bestDay, busiestWeekday, hasAnyCompletionEver },
    rangeStartKey,
    rangeEndKey: todayKey,
  };
}
