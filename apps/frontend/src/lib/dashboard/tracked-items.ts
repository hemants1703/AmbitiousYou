import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import type { Ambition, Milestone, Task } from "@ambitiousyou/shared/types";

/**
 * Shared, pure helpers for reasoning about an ambition's tracked work (tasks or
 * milestones) across the dashboard. Kept framework-free so both server
 * aggregation and client rendering stay consistent.
 */

export type TrackedItem = Task | Milestone;

export type ItemKind = "task" | "milestone";

/**
 * A single open (incomplete) tracked item flattened together with the context of
 * its parent ambition, so it can live in cross-ambition views like the action
 * queue. Dates are pre-resolved to numbers/strings where they cross to the
 * client to avoid timezone-sensitive hydration mismatches.
 */
export interface QueueItem {
  id: string;
  kind: ItemKind;
  title: string;
  description: string | null;
  /** Deadline (task) or target date (milestone). */
  date: Date;
  /** Whole days from today; negative means overdue. */
  daysUntil: number;
  ambitionId: string;
  ambitionName: string;
  ambitionPriority: Ambition["ambitionPriority"];
  ambitionMotivation: string | null;
}

export function getItemTitle(item: TrackedItem): string {
  return "task" in item ? item.task : item.milestone;
}

export function getItemDescription(item: TrackedItem): string | null {
  return "taskDescription" in item ? item.taskDescription : item.milestoneDescription;
}

export function getItemDate(item: TrackedItem): Date | string {
  return "taskDeadline" in item ? item.taskDeadline : item.milestoneTargetDate;
}

export function isItemCompleted(item: TrackedItem): boolean {
  return "taskCompleted" in item ? item.taskCompleted : item.milestoneCompleted;
}

export function getItemKind(item: TrackedItem): ItemKind {
  return "task" in item ? "task" : "milestone";
}

export function getTrackedItems(ambition: AmbitionDetails): TrackedItem[] {
  // An ambition's "moves" are its tasks and milestones combined.
  return [...(ambition.tasks ?? []), ...(ambition.milestones ?? [])];
}

/**
 * Whole calendar days from today to the given date. Both endpoints are
 * normalized to local midnight so the result is an exact integer of days
 * (negative = in the past). Mirrors the logic already used on the ambition
 * detail page so urgency reads identically across the app.
 */
export function getDaysUntil(dateValue: Date | string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);

  const dayInMilliseconds = 1000 * 60 * 60 * 24;
  return Math.round((target.getTime() - today.getTime()) / dayInMilliseconds);
}

export function priorityWeight(priority: Ambition["ambitionPriority"]): number {
  if (priority === "high") return 3;
  if (priority === "medium") return 2;
  return 1;
}

/** Most urgent first: overdue (most negative) → soonest → higher priority. */
export function sortByUrgency(first: QueueItem, second: QueueItem): number {
  if (first.daysUntil !== second.daysUntil) {
    return first.daysUntil - second.daysUntil;
  }
  return priorityWeight(second.ambitionPriority) - priorityWeight(first.ambitionPriority);
}

function toQueueItem(item: TrackedItem, ambition: AmbitionDetails): QueueItem {
  const date = new Date(getItemDate(item));

  return {
    id: item.id,
    kind: getItemKind(item),
    title: getItemTitle(item),
    description: getItemDescription(item),
    date,
    daysUntil: getDaysUntil(date),
    ambitionId: ambition.id,
    ambitionName: ambition.ambitionName,
    ambitionPriority: ambition.ambitionPriority,
    ambitionMotivation: ambition.ambitionMotivation,
  };
}

/**
 * Every open item across the supplied (active) ambitions, sorted by urgency.
 */
export function flattenOpenItems(ambitions: AmbitionDetails[]): QueueItem[] {
  const openItems: QueueItem[] = [];

  for (const ambition of ambitions) {
    if (ambition.ambitionStatus !== "active") continue;

    for (const item of getTrackedItems(ambition)) {
      if (isItemCompleted(item)) continue;
      openItems.push(toQueueItem(item, ambition));
    }
  }

  return openItems.sort(sortByUrgency);
}

export interface DeadlineBuckets {
  overdue: number;
  today: number;
  thisWeek: number;
  nextWeek: number;
}

/** Counts of open items by deadline pressure window. */
export function bucketByDeadline(items: QueueItem[]): DeadlineBuckets {
  const buckets: DeadlineBuckets = { overdue: 0, today: 0, thisWeek: 0, nextWeek: 0 };

  for (const item of items) {
    if (item.daysUntil < 0) buckets.overdue += 1;
    else if (item.daysUntil === 0) buckets.today += 1;
    else if (item.daysUntil <= 7) buckets.thisWeek += 1;
    else if (item.daysUntil <= 14) buckets.nextWeek += 1;
  }

  return buckets;
}

export interface DayGroup {
  /** Stable key for the calendar day (yyyy-mm-dd). */
  dateKey: string;
  label: string;
  daysUntil: number;
  items: QueueItem[];
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", { weekday: "long" });

function dayLabel(item: QueueItem): string {
  if (item.daysUntil === 0) return "Today";
  if (item.daysUntil === 1) return "Tomorrow";
  return WEEKDAY_FORMATTER.format(item.date);
}

function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Upcoming open items (due today through `withinDays`) grouped by calendar day,
 * earliest first. Overdue items are intentionally excluded — they belong to the
 * action queue / attention surfaces, not the "coming up" preview.
 */
export function groupUpcomingByDay(items: QueueItem[], withinDays = 7): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  for (const item of items) {
    if (item.daysUntil < 0 || item.daysUntil > withinDays) continue;

    const key = dayKey(item.date);
    const existing = groups.get(key);

    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, { dateKey: key, label: dayLabel(item), daysUntil: item.daysUntil, items: [item] });
    }
  }

  return [...groups.values()].sort((first, second) => first.daysUntil - second.daysUntil);
}

export type AttentionSeverity = "overdue" | "stalled" | "ready";

export interface AttentionFlag {
  ambitionId: string;
  ambitionName: string;
  priority: Ambition["ambitionPriority"];
  severity: AttentionSeverity;
  reason: string;
}

/**
 * Gentle early-warning flags for active ambitions, so nothing slips silently:
 *  - overdue: has at least one open item past its date
 *  - ready:   every tracked item is done but the ambition isn't marked complete
 *  - stalled: target date is within a week and progress is still under half
 * At most one flag per ambition, most severe first.
 */
export function computeAttentionFlags(ambitions: AmbitionDetails[]): AttentionFlag[] {
  const flags: AttentionFlag[] = [];

  for (const ambition of ambitions) {
    if (ambition.ambitionStatus !== "active") continue;

    const trackedItems = getTrackedItems(ambition);
    const openItems = trackedItems.filter((item) => !isItemCompleted(item));
    const overdueOpen = openItems.filter((item) => getDaysUntil(getItemDate(item)) < 0);
    const daysToDeadline = getDaysUntil(ambition.ambitionEndDate);
    const progress = ambition.ambitionPercentageCompleted ?? 0;

    const base = {
      ambitionId: ambition.id,
      ambitionName: ambition.ambitionName,
      priority: ambition.ambitionPriority,
    };

    if (overdueOpen.length > 0) {
      flags.push({ ...base, severity: "overdue", reason: `${pluralize(overdueOpen.length, "move")} overdue` });
      continue;
    }

    if (trackedItems.length > 0 && openItems.length === 0) {
      flags.push({ ...base, severity: "ready", reason: "All work done — ready to mark complete" });
      continue;
    }

    if (daysToDeadline >= 0 && daysToDeadline <= 7 && progress < 50) {
      flags.push({
        ...base,
        severity: "stalled",
        reason: daysToDeadline === 0 ? `Due today — ${progress}% done` : `Due in ${pluralize(daysToDeadline, "day")} — ${progress}% done`,
      });
    }
  }

  const severityRank: Record<AttentionSeverity, number> = { overdue: 0, stalled: 1, ready: 2 };
  return flags.sort((first, second) => severityRank[first.severity] - severityRank[second.severity] || priorityWeight(second.priority) - priorityWeight(first.priority));
}

export interface LeadMotivation {
  ambitionId: string;
  ambitionName: string;
  motivation: string;
}

/**
 * The single "why" to surface prominently at the top of the dashboard: the
 * motivation of the user's most pressing ambition (the one owning the most urgent
 * open move, since `openItems` arrives urgency-sorted), falling back to any active
 * ambition that has a motivation set. Returns null when none is set, so the banner
 * stays hidden rather than rendering an empty shell.
 */
export function pickLeadMotivation(openItems: QueueItem[], ambitions: AmbitionDetails[]): LeadMotivation | null {
  const fromQueue = openItems.find((item) => item.ambitionMotivation?.trim());
  if (fromQueue?.ambitionMotivation) {
    return { ambitionId: fromQueue.ambitionId, ambitionName: fromQueue.ambitionName, motivation: fromQueue.ambitionMotivation.trim() };
  }

  const fromAmbition = ambitions.find((ambition) => ambition.ambitionMotivation?.trim());
  if (fromAmbition?.ambitionMotivation) {
    return { ambitionId: fromAmbition.id, ambitionName: fromAmbition.ambitionName, motivation: fromAmbition.ambitionMotivation.trim() };
  }

  return null;
}

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
