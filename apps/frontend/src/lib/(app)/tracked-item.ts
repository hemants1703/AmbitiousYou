import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { parseISO } from "date-fns";

/**
 * Shared, framework-free helpers for the tracked work (tasks or milestones) of a
 * single ambition. Kept in one place so the Execution Board (inline preview),
 * its management drawer, and the ambition-details section all reason about items
 * identically.
 */

export type TrackingMethod = "task" | "milestone";
export type TrackedItem = Task | Milestone;

export type DraftState = {
  title: string;
  description: string;
  date: string;
};

export const emptyDraft: DraftState = { title: "", description: "", date: "" };

export function isMilestone(item: TrackedItem): item is Milestone {
  return "milestone" in item;
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
