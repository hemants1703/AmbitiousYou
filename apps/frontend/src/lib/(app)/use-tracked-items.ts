import { createMilestoneAction } from "@/lib/actions/(app)/milestones/create-milestone";
import { deleteMilestoneAction } from "@/lib/actions/(app)/milestones/delete-milestone";
import { toggleMilestoneCompletionAction } from "@/lib/actions/(app)/milestones/toggle-milestone-completion";
import { updateMilestoneAction } from "@/lib/actions/(app)/milestones/update-milestone";
import { createTaskAction } from "@/lib/actions/(app)/tasks/create-task";
import { deleteTaskAction } from "@/lib/actions/(app)/tasks/delete-task";
import { toggleTaskCompletionAction } from "@/lib/actions/(app)/tasks/toggle-task-completion";
import { updateTaskAction } from "@/lib/actions/(app)/tasks/update-task";
import { getCompletedVerb, isCompleted, isMilestone, type DraftState, type TrackedItem } from "@/lib/(app)/tracked-item";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface UseTrackedItemsParams {
  ambitionId: string;
  /** The merged list of moves (tasks + milestones) for this ambition. */
  sourceItems: TrackedItem[];
}

export interface UseTrackedItemsResult {
  items: TrackedItem[];
  openItems: TrackedItem[];
  completedItems: TrackedItem[];
  isPending: boolean;
  error: string | null;
  clearError: () => void;
  /** Umbrella noun for an item — always "move" (each move is a task or a milestone). */
  noun: "move";
  create: (draft: DraftState) => void;
  update: (item: TrackedItem, draft: DraftState) => void;
  toggle: (item: TrackedItem) => void;
  remove: (itemId: string) => void;
}

/**
 * Single source of truth for an ambition's moves (tasks + milestones): optimistic
 * local state + the create/update/toggle/remove server-action handlers. Instantiate
 * ONCE in the Execution Board and pass the result into the management drawer — never
 * call it twice, or the inline preview and the drawer would diverge.
 *
 * Each move's sub-type is derived PER ITEM (duck-typing) so a mixed list dispatches to
 * the right task/milestone action. The one exception is `create`, where the kind comes
 * from `draft.kind` (the optimistic item doesn't exist yet to duck-type).
 */
export function useTrackedItems(params: UseTrackedItemsParams): UseTrackedItemsResult {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [items, setItems] = useState<TrackedItem[]>(params.sourceItems);
  const [syncedSource, setSyncedSource] = useState<TrackedItem[]>(params.sourceItems);
  const [error, setError] = useState<string | null>(null);

  // Re-sync with fresh server data whenever a router.refresh() (or navigation) hands us a new list.
  if (syncedSource !== params.sourceItems) {
    setSyncedSource(params.sourceItems);
    setItems(params.sourceItems);
  }

  function buildOptimisticItem(draft: DraftState): TrackedItem {
    const base = {
      id: crypto.randomUUID(),
      userId: "",
      ambitionId: params.ambitionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (draft.kind === "task") {
      return { ...base, task: draft.title, taskDescription: draft.description, taskCompleted: false, taskCompletedAt: null, taskDeadline: parseISO(draft.date) } satisfies Task;
    }
    return { ...base, milestone: draft.title, milestoneDescription: draft.description, milestoneCompleted: false, milestoneCompletedAt: null, milestoneTargetDate: parseISO(draft.date) } satisfies Milestone;
  }

  function create(draft: DraftState) {
    const title = draft.title.trim();
    if (!title || !draft.date) return;
    setError(null);

    const optimistic = buildOptimisticItem({ ...draft, title });
    const isoDate = parseISO(draft.date).toISOString();
    const description = draft.description.trim();
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) => [optimistic, ...prev]);

      const result =
        draft.kind === "task"
          ? await createTaskAction({ ambitionId: params.ambitionId, task: title, taskDescription: description, taskDeadline: isoDate })
          : await createMilestoneAction({ ambitionId: params.ambitionId, milestone: title, milestoneDescription: description, milestoneTargetDate: isoDate });

      const created = "task" in result ? result.task : result.milestone;
      if (result.error || !created) {
        setError(result.error ?? "Failed to add move. Please try again.");
        setItems(snapshot);
      } else {
        setItems((prev) => prev.map((item) => (item.id === optimistic.id ? created : item)));
        router.refresh();
      }
    });
  }

  function update(item: TrackedItem, draft: DraftState) {
    const title = draft.title.trim();
    if (!title || !draft.date) return;
    setError(null);

    const isoDate = parseISO(draft.date).toISOString();
    const description = draft.description.trim();
    const completed = isCompleted(item);
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) =>
        prev.map((current) => {
          if (current.id !== item.id) return current;
          return isMilestone(current)
            ? ({ ...current, milestone: title, milestoneDescription: description, milestoneTargetDate: parseISO(draft.date), updatedAt: new Date() } as Milestone)
            : ({ ...(current as Task), task: title, taskDescription: description, taskDeadline: parseISO(draft.date), updatedAt: new Date() } as Task);
        }),
      );

      const result = isMilestone(item)
        ? await updateMilestoneAction(item.id, { milestone: title, milestoneDescription: description, milestoneCompleted: completed, milestoneTargetDate: isoDate })
        : await updateTaskAction(item.id, { task: title, taskDescription: description, taskCompleted: completed, taskDeadline: isoDate });

      const updated = "task" in result ? result.task : result.milestone;
      if (result.error || !updated) {
        setError(result.error ?? "Failed to update move. Please try again.");
        setItems(snapshot);
      } else {
        setItems((prev) => prev.map((current) => (current.id === item.id ? updated : current)));
        router.refresh();
      }
    });
  }

  function toggle(item: TrackedItem) {
    setError(null);
    const snapshot = items;
    const wasCompleted = isCompleted(item);
    const kindLabel = isMilestone(item) ? "Milestone" : "Task";
    const verb = getCompletedVerb(item);

    startTransition(async () => {
      setItems((prev) =>
        prev.map((current) => {
          if (current.id !== item.id) return current;
          return isMilestone(current)
            ? ({ ...current, milestoneCompleted: !current.milestoneCompleted } as Milestone)
            : ({ ...(current as Task), taskCompleted: !(current as Task).taskCompleted } as Task);
        }),
      );

      const result = isMilestone(item) ? await toggleMilestoneCompletionAction(item.id) : await toggleTaskCompletionAction(item.id);
      if (result.error) {
        setError(result.error);
        setItems(snapshot);
        toast.error("Failed to update move. Please try again.");
      } else {
        router.refresh();
        toast.success(wasCompleted ? `${kindLabel} marked as not ${verb}.` : `${kindLabel} marked as ${verb}.`);
      }
    });
  }

  function remove(itemId: string) {
    const target = items.find((current) => current.id === itemId);
    if (!target) return;
    setError(null);
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) => prev.filter((current) => current.id !== itemId));

      const result = isMilestone(target) ? await deleteMilestoneAction(itemId) : await deleteTaskAction(itemId);
      if (result.error) {
        setError(result.error);
        setItems(snapshot);
      } else {
        router.refresh();
      }
    });
  }

  const openItems = items.filter((item) => !isCompleted(item));
  const completedItems = items.filter((item) => isCompleted(item));

  return {
    items,
    openItems,
    completedItems,
    isPending,
    error,
    clearError: () => setError(null),
    noun: "move",
    create,
    update,
    toggle,
    remove,
  };
}
