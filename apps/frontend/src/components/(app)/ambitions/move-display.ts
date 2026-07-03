import type { MoveDetail, MoveKind, TrackedItem } from "@/lib/(app)/tracked-item";
import { formatDate, getDate, getDaysUntil, sortByPriority } from "@/lib/(app)/tracked-item";

export const MOVE_KIND_SURFACE: Record<MoveKind, string> = {
  task: "border-teal-500/30 bg-teal-500/10 dark:border-teal-500/20 dark:bg-teal-500/10",
  milestone: "border-fuchsia-500/30 bg-fuchsia-500/10 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10",
};

export const MOVE_KIND_HEADER_STRIPE: Record<MoveKind, string> = {
  task: "border-l-teal-500 dark:border-l-teal-400",
  milestone: "border-l-fuchsia-500 dark:border-l-fuchsia-400",
};

export interface MoveUrgency {
  label: string;
  tone: "completed" | "overdue" | "today" | "soon" | "default";
}

export function moveUrgency(daysUntil: number, completed: boolean, kind: MoveKind): MoveUrgency {
  if (completed) {
    return { label: kind === "milestone" ? "Reached" : "Completed", tone: "completed" };
  }
  if (daysUntil < 0) return { label: `${Math.abs(daysUntil)}d overdue`, tone: "overdue" };
  if (daysUntil === 0) return { label: "Due today", tone: "today" };
  if (daysUntil === 1) return { label: "Due tomorrow", tone: "soon" };
  if (daysUntil <= 3) return { label: `${daysUntil}d left`, tone: "soon" };
  return { label: `${daysUntil}d left`, tone: "default" };
}

export const URGENCY_BADGE: Record<MoveUrgency["tone"], string> = {
  completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  overdue: "border-destructive/30 bg-destructive/10 text-destructive",
  today: "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-200",
  soon: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  default: "border-border/60 bg-muted/30 text-muted-foreground",
};

export function moveDateLabel(kind: MoveKind): "Due" | "Target" {
  return kind === "task" ? "Due" : "Target";
}

export function moveTimestamp(detail: Pick<MoveDetail, "createdAt" | "updatedAt">) {
  if (detail.updatedAt && detail.createdAt && new Date(detail.updatedAt).getTime() !== new Date(detail.createdAt).getTime()) {
    return `Updated ${formatDate(detail.updatedAt)}`;
  }
  if (detail.createdAt) return `Added ${formatDate(detail.createdAt)}`;
  return "";
}

export function moveCompletionLabel(detail: Pick<MoveDetail, "kind" | "completed" | "completedAt">): string | null {
  if (!detail.completed) return null;
  const label = detail.kind === "milestone" ? "Reached" : "Completed";
  return detail.completedAt ? `${label} ${formatDate(detail.completedAt)}` : label;
}

export function descriptionNeedsExpand(text: string): boolean {
  return text.length > 140 || text.split("\n").length > 2;
}

export type OpenMoveBucket = "overdue" | "dueSoon" | "later";

export interface OpenMoveGroup {
  id: OpenMoveBucket;
  label: string;
  headerClass: string;
  items: TrackedItem[];
}

/** Buckets open moves by deadline pressure so the workspace reads top-down by urgency. */
export function groupOpenMovesByUrgency(items: TrackedItem[]): OpenMoveGroup[] {
  const overdue: TrackedItem[] = [];
  const dueSoon: TrackedItem[] = [];
  const later: TrackedItem[] = [];

  for (const item of items) {
    const daysUntil = getDaysUntil(getDate(item));
    if (daysUntil < 0) overdue.push(item);
    else if (daysUntil <= 7) dueSoon.push(item);
    else later.push(item);
  }

  const sort = (bucket: TrackedItem[]) => [...bucket].sort(sortByPriority);

  return [
    { id: "overdue", label: "Overdue", headerClass: "text-destructive", items: sort(overdue) },
    { id: "dueSoon", label: "Due within a week", headerClass: "text-amber-700 dark:text-amber-300", items: sort(dueSoon) },
    { id: "later", label: "Coming up", headerClass: "text-muted-foreground", items: sort(later) },
  ].filter((group) => group.items.length > 0);
}

/** Slice open moves in urgency order, then re-bucket for display. */
export function paginateOpenMoveGroups(items: TrackedItem[], limit: number): OpenMoveGroup[] {
  const ordered = groupOpenMovesByUrgency(items).flatMap((group) => group.items);
  return groupOpenMovesByUrgency(ordered.slice(0, limit));
}

export function countOverdueMoves(items: TrackedItem[]): number {
  return items.filter((item) => getDaysUntil(getDate(item)) < 0).length;
}
