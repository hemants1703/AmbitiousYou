import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { parseISO } from "date-fns";

/**
 * Shared, framework-free helpers for the tracked work (tasks or milestones) of a
 * single ambition. Kept in one place so the Execution Board (inline preview),
 * its management drawer, and the ambition-details section all reason about items
 * identically.
 */

/** The two sub-types of a "move". A move is a Task (reversible) or a Milestone (permanent). */
export type MoveKind = "task" | "milestone";
/** @deprecated Ambitions are no longer single-method; use {@link MoveKind} for a move's sub-type. */
export type TrackingMethod = MoveKind;
export type TrackedItem = Task | Milestone;

export type DraftState = {
  kind: MoveKind;
  title: string;
  description: string;
  date: string;
};

export const emptyDraft: DraftState = { kind: "task", title: "", description: "", date: "" };

/** Max title length for a move — mirrors varchar(255) on tasks.task / milestones.milestone. */
export const MOVE_TITLE_MAX_LENGTH = 255;

/**
 * The normalized, read-only shape the move detail dialog renders. Built from a full
 * TrackedItem (via {@link toMoveDetail}) on the ambition pages, or assembled directly
 * from a flattened cross-ambition item on the dashboard. Timestamps and `ambitionName`
 * are optional, so a surface that genuinely lacks them simply omits those lines.
 */
export interface MoveDetail {
  id?: string;
  kind: MoveKind;
  title: string;
  description: string;
  /** Deadline (task) or target date (milestone). */
  date: Date | string;
  completed: boolean;
  completedAt?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  /** Parent ambition, shown for cross-ambition surfaces (e.g. the dashboard queue). */
  ambitionName?: string;
  ambitionId?: string;
}

/**
 * Color identity for each move kind, applied consistently everywhere a task or
 * milestone shows (badge, card left-stripe, picker selected-state). Task = teal
 * (calm, in your control), Milestone = fuchsia (an aspirational peak). Full literal
 * Tailwind strings so the JIT keeps them, and `text-600/dark:text-400` so the hue
 * reads the same in light and dark mode.
 */
export const MOVE_KIND_STYLE: Record<MoveKind, { label: string; text: string; badge: string; stripe: string; selected: string }> = {
  task: {
    label: "Task",
    text: "text-teal-600 dark:text-teal-400",
    badge: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
    stripe: "border-l-teal-500",
    selected: "data-[state=on]:border-teal-500 data-[state=on]:bg-teal-500/5",
  },
  milestone: {
    label: "Milestone",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    badge: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    stripe: "border-l-fuchsia-500",
    selected: "data-[state=on]:border-fuchsia-500 data-[state=on]:bg-fuchsia-500/5",
  },
};

export function isMilestone(item: TrackedItem): item is Milestone {
  return "milestone" in item;
}

/** A persisted item's sub-type, derived structurally (Task and Milestone rows are disjoint). */
export function getKind(item: TrackedItem): MoveKind {
  return "task" in item ? "task" : "milestone";
}

/** Short date label for a move: tasks have a deadline ("Due"), milestones a target ("Target"). */
export function getDateLabel(item: TrackedItem): "Due" | "Target" {
  return "task" in item ? "Due" : "Target";
}

/** Past-tense completion verb: tasks are "completed", milestones are "reached". */
export function getCompletedVerb(item: TrackedItem): "completed" | "reached" {
  return "task" in item ? "completed" : "reached";
}

export function getTitle(item: TrackedItem): string {
  return "task" in item ? item.task : item.milestone;
}

export function getDescription(item: TrackedItem): string {
  return ("taskDescription" in item ? item.taskDescription : item.milestoneDescription) ?? "";
}

export function getDate(item: TrackedItem): Date | string {
  return "taskDeadline" in item ? item.taskDeadline : item.milestoneTargetDate;
}

export function isCompleted(item: TrackedItem): boolean {
  return "taskCompleted" in item ? item.taskCompleted : item.milestoneCompleted;
}

export function getCompletedAt(item: TrackedItem): Date | string | null {
  return "taskCompletedAt" in item ? item.taskCompletedAt : item.milestoneCompletedAt;
}

/** e.g. "Completed Jul 3, 2026" or "Reached Jul 3, 2026". */
export function formatCompletedLabel(item: TrackedItem): string {
  const verb = getCompletedVerb(item);
  const label = verb === "completed" ? "Completed" : "Reached";
  const completedAt = getCompletedAt(item);
  return completedAt ? `${label} ${formatDate(completedAt)}` : label;
}

/** Project a persisted move into the normalized {@link MoveDetail} the detail dialog reads. */
export function toMoveDetail(item: TrackedItem): MoveDetail {
  return {
    id: item.id,
    kind: getKind(item),
    title: getTitle(item),
    description: getDescription(item),
    date: getDate(item),
    completed: isCompleted(item),
    completedAt: getCompletedAt(item),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    ambitionId: item.ambitionId,
  };
}

/** Format a Date as the local-calendar `YYYY-MM-DD` a date input/picker expects. */
export function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

/** Parse a `YYYY-MM-DD` value as local midnight (NOT UTC) to avoid off-by-one drift. */
export function toSelectedDate(dateValue: string): Date | undefined {
  return dateValue ? parseISO(dateValue) : undefined;
}

export function formatDate(dateValue: Date | string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

/** Whole calendar days from today to the date (negative = overdue). */
export function getDaysUntil(dateValue: Date | string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);

  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Most urgent first: overdue ahead of upcoming, then soonest date. */
export function sortByPriority(firstItem: TrackedItem, secondItem: TrackedItem): number {
  const firstDaysUntil = getDaysUntil(getDate(firstItem));
  const secondDaysUntil = getDaysUntil(getDate(secondItem));

  if (firstDaysUntil < 0 && secondDaysUntil >= 0) return -1;
  if (firstDaysUntil >= 0 && secondDaysUntil < 0) return 1;

  return new Date(getDate(firstItem)).getTime() - new Date(getDate(secondItem)).getTime();
}
