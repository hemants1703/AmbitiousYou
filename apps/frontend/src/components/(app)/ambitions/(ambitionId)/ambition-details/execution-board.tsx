"use client";

import { createMilestoneAction } from "@/actions/(app)/milestones/create-milestone";
import { deleteMilestoneAction } from "@/actions/(app)/milestones/delete-milestone";
import { toggleMilestoneCompletionAction } from "@/actions/(app)/milestones/toggle-milestone-completion";
import { updateMilestoneAction } from "@/actions/(app)/milestones/update-milestone";
import { createTaskAction } from "@/actions/(app)/tasks/create-task";
import { deleteTaskAction } from "@/actions/(app)/tasks/delete-task";
import { toggleTaskCompletionAction } from "@/actions/(app)/tasks/toggle-task-completion";
import { updateTaskAction } from "@/actions/(app)/tasks/update-task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Milestone, Task } from "@ambitiousyou/shared/types";
import { format, parseISO } from "date-fns";
import { CalendarIcon, ListTodoIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type TrackingMethod = "task" | "milestone";
type TrackedItem = Task | Milestone;

interface ExecutionBoardProps {
  ambitionId: string;
  trackingMethod: TrackingMethod;
  tasks: Task[];
  milestones: Milestone[];
}

type DraftState = {
  title: string;
  description: string;
  date: string;
};

const emptyDraft: DraftState = { title: "", description: "", date: "" };

function getTitle(item: TrackedItem): string {
  return "task" in item ? item.task : item.milestone;
}

function getDescription(item: TrackedItem): string {
  return ("taskDescription" in item ? item.taskDescription : item.milestoneDescription) ?? "";
}

function getDate(item: TrackedItem): Date | string {
  return "taskDeadline" in item ? item.taskDeadline : item.milestoneTargetDate;
}

function isCompleted(item: TrackedItem): boolean {
  return "taskCompleted" in item ? item.taskCompleted : item.milestoneCompleted;
}

function toDateInputValue(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function toSelectedDate(dateValue: string): Date | undefined {
  return dateValue ? parseISO(dateValue) : undefined;
}

function formatDate(dateValue: Date | string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(dateValue));
}

function getDaysUntil(dateValue: Date | string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ExecutionBoard(props: ExecutionBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isTask = props.trackingMethod === "task";
  const noun = isTask ? "task" : "milestone";

  const sourceItems: TrackedItem[] = isTask ? props.tasks : props.milestones;
  const [items, setItems] = useState<TrackedItem[]>(sourceItems);
  const [syncedSource, setSyncedSource] = useState<TrackedItem[]>(sourceItems);
  const [error, setError] = useState<string | null>(null);

  // Re-sync with fresh server data whenever a router.refresh() (or navigation) hands us a new list.
  if (syncedSource !== sourceItems) {
    setSyncedSource(sourceItems);
    setItems(sourceItems);
  }

  const [adding, setAdding] = useState(false);
  const [newDraft, setNewDraft] = useState<DraftState>(emptyDraft);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<DraftState>(emptyDraft);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function buildOptimisticItem(draft: DraftState): TrackedItem {
    const base = {
      id: crypto.randomUUID(),
      userId: "",
      ambitionId: props.ambitionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isTask) {
      return { ...base, task: draft.title, taskDescription: draft.description, taskCompleted: false, taskDeadline: new Date(draft.date) } satisfies Task;
    }
    return { ...base, milestone: draft.title, milestoneDescription: draft.description, milestoneCompleted: false, milestoneTargetDate: new Date(draft.date) } satisfies Milestone;
  }

  function handleCreate() {
    const title = newDraft.title.trim();
    if (!title || !newDraft.date) return;
    setError(null);

    const optimistic = buildOptimisticItem({ ...newDraft, title });
    const isoDate = new Date(newDraft.date).toISOString();
    const description = newDraft.description.trim();
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) => [optimistic, ...prev]);
      setNewDraft(emptyDraft);
      setAdding(false);

      const result = isTask
        ? await createTaskAction({ ambitionId: props.ambitionId, task: title, taskDescription: description, taskDeadline: isoDate })
        : await createMilestoneAction({ ambitionId: props.ambitionId, milestone: title, milestoneDescription: description, milestoneTargetDate: isoDate });

      const created = "task" in result ? result.task : result.milestone;
      if (result.error || !created) {
        setError(result.error ?? `Failed to create ${noun}. Please try again.`);
        setItems(snapshot);
      } else {
        setItems((prev) => prev.map((item) => (item.id === optimistic.id ? created : item)));
        router.refresh();
      }
    });
  }

  function handleStartEdit(item: TrackedItem) {
    setConfirmDeleteId(null);
    setEditingId(item.id);
    setEditDraft({
      title: getTitle(item),
      description: getDescription(item),
      date: toDateInputValue(new Date(getDate(item))),
    });
  }

  function handleUpdate(item: TrackedItem) {
    const title = editDraft.title.trim();
    if (!title || !editDraft.date) return;
    setError(null);

    const isoDate = new Date(editDraft.date).toISOString();
    const description = editDraft.description.trim();
    const completed = isCompleted(item);
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) =>
        prev.map((current) => {
          if (current.id !== item.id) return current;
          return isTask
            ? ({ ...(current as Task), task: title, taskDescription: description, taskDeadline: new Date(editDraft.date), updatedAt: new Date() } as Task)
            : ({ ...(current as Milestone), milestone: title, milestoneDescription: description, milestoneTargetDate: new Date(editDraft.date), updatedAt: new Date() } as Milestone);
        }),
      );
      setEditingId(null);
      setEditDraft(emptyDraft);

      const result = isTask
        ? await updateTaskAction(item.id, { task: title, taskDescription: description, taskCompleted: completed, taskDeadline: isoDate })
        : await updateMilestoneAction(item.id, { milestone: title, milestoneDescription: description, milestoneCompleted: completed, milestoneTargetDate: isoDate });

      const updated = "task" in result ? result.task : result.milestone;
      if (result.error || !updated) {
        setError(result.error ?? `Failed to update ${noun}. Please try again.`);
        setItems(snapshot);
      } else {
        setItems((prev) => prev.map((current) => (current.id === item.id ? updated : current)));
        router.refresh();
      }
    });
  }

  function handleToggle(item: TrackedItem) {
    setError(null);
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) =>
        prev.map((current) => {
          if (current.id !== item.id) return current;
          return isTask
            ? ({ ...(current as Task), taskCompleted: !(current as Task).taskCompleted } as Task)
            : ({ ...(current as Milestone), milestoneCompleted: !(current as Milestone).milestoneCompleted } as Milestone);
        }),
      );

      const result = isTask ? await toggleTaskCompletionAction(item.id) : await toggleMilestoneCompletionAction(item.id);
      if (result.error) {
        setError(result.error);
        setItems(snapshot);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete(itemId: string) {
    setError(null);
    const snapshot = items;

    startTransition(async () => {
      setItems((prev) => prev.filter((current) => current.id !== itemId));
      setConfirmDeleteId(null);

      const result = isTask ? await deleteTaskAction(itemId) : await deleteMilestoneAction(itemId);
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListTodoIcon className="size-4 text-primary" />
              Execution Board
            </CardTitle>
            <CardDescription>{isTask ? "Tasks" : "Milestones"} you can add, complete, edit, and remove as the work progresses.</CardDescription>
          </div>
          {!adding && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => {
                setError(null);
                setEditingId(null);
                setConfirmDeleteId(null);
                setAdding(true);
              }}
            >
              <PlusIcon className="size-4" />
              Add {noun}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {adding && (
          <DraftEditor
            label={`New ${noun}`}
            draft={newDraft}
            noun={noun}
            disabledBefore={today}
            isPending={isPending}
            onChange={setNewDraft}
            onSubmit={handleCreate}
            onCancel={() => {
              setAdding(false);
              setNewDraft(emptyDraft);
            }}
          />
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Open</p>
            <Badge variant="outline">{openItems.length}</Badge>
          </div>
          {openItems.length === 0 ? (
            <p className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">No open items right now.</p>
          ) : (
            openItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                noun={noun}
                isEditing={editingId === item.id}
                isConfirmingDelete={confirmDeleteId === item.id}
                editDraft={editDraft}
                disabledBefore={today}
                isPending={isPending}
                onToggle={() => handleToggle(item)}
                onStartEdit={() => handleStartEdit(item)}
                onEditChange={setEditDraft}
                onSaveEdit={() => handleUpdate(item)}
                onCancelEdit={() => {
                  setEditingId(null);
                  setEditDraft(emptyDraft);
                }}
                onStartDelete={() => {
                  setEditingId(null);
                  setConfirmDeleteId(item.id);
                }}
                onConfirmDelete={() => handleDelete(item.id)}
                onCancelDelete={() => setConfirmDeleteId(null)}
              />
            ))
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Completed</p>
            <Badge variant="outline">{completedItems.length}</Badge>
          </div>
          {completedItems.length === 0 ? (
            <p className="rounded-2xl border border-border/60 p-3 text-sm text-muted-foreground">No completed items yet.</p>
          ) : (
            completedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                noun={noun}
                isEditing={editingId === item.id}
                isConfirmingDelete={confirmDeleteId === item.id}
                editDraft={editDraft}
                disabledBefore={today}
                isPending={isPending}
                onToggle={() => handleToggle(item)}
                onStartEdit={() => handleStartEdit(item)}
                onEditChange={setEditDraft}
                onSaveEdit={() => handleUpdate(item)}
                onCancelEdit={() => {
                  setEditingId(null);
                  setEditDraft(emptyDraft);
                }}
                onStartDelete={() => {
                  setEditingId(null);
                  setConfirmDeleteId(item.id);
                }}
                onConfirmDelete={() => handleDelete(item.id)}
                onCancelDelete={() => setConfirmDeleteId(null)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface DraftEditorProps {
  label: string;
  draft: DraftState;
  noun: string;
  disabledBefore: Date;
  isPending: boolean;
  onChange: (draft: DraftState) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function DraftEditor(props: DraftEditorProps) {
  const { draft, onChange } = props;
  const canSave = Boolean(draft.title.trim()) && Boolean(draft.date);

  return (
    <div className="space-y-3 rounded-2xl border border-primary/30 bg-background/50 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{props.label}</p>

      <Input
        autoFocus
        value={draft.title}
        onChange={(event) => onChange({ ...draft, title: event.target.value })}
        placeholder={`${props.noun === "task" ? "Task" : "Milestone"} title`}
        onKeyDown={(event) => {
          if (event.key === "Escape") props.onCancel();
        }}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" data-empty={!draft.date} className="w-full justify-start bg-background text-left font-normal data-[empty=true]:text-muted-foreground">
            <CalendarIcon className="size-4" />
            {draft.date ? format(toSelectedDate(draft.date) ?? new Date(draft.date), "PPP") : <span>{props.noun === "task" ? "Pick a deadline" : "Pick a target date"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={toSelectedDate(draft.date)} onSelect={(selected) => onChange({ ...draft, date: selected ? toDateInputValue(selected) : "" })} disabled={{ before: props.disabledBefore }} />
        </PopoverContent>
      </Popover>

      <Textarea value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} placeholder="Optional description…" rows={3} />

      <div className="flex items-center gap-2">
        <Button type="button" size="sm" disabled={props.isPending || !canSave} onClick={props.onSubmit}>
          Save {props.noun}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={props.isPending} onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface ItemRowProps {
  item: TrackedItem;
  noun: string;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  editDraft: DraftState;
  disabledBefore: Date;
  isPending: boolean;
  onToggle: () => void;
  onStartEdit: () => void;
  onEditChange: (draft: DraftState) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

function ItemRow(props: ItemRowProps) {
  const { item } = props;
  const completed = isCompleted(item);
  const daysUntil = getDaysUntil(getDate(item));

  if (props.isEditing) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-background/50 p-4">
        <DraftEditor
          label={`Editing ${props.noun}`}
          draft={props.editDraft}
          noun={props.noun}
          disabledBefore={props.disabledBefore}
          isPending={props.isPending}
          onChange={props.onEditChange}
          onSubmit={props.onSaveEdit}
          onCancel={props.onCancelEdit}
        />
      </div>
    );
  }

  if (props.isConfirmingDelete) {
    return (
      <div className="space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Delete this {props.noun}?</p>
        <p className="line-clamp-2 text-sm text-muted-foreground wrap-break-word">{getTitle(item)}</p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="destructive" size="sm" disabled={props.isPending} onClick={props.onConfirmDelete}>
            <Trash2Icon className="size-3.5" />
            Yes, delete
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={props.isPending} onClick={props.onCancelDelete}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/60 p-3">
      <div className="flex items-start gap-3">
        <Checkbox checked={completed} disabled={props.isPending} onCheckedChange={props.onToggle} className="mt-0.5" aria-label={completed ? `Mark ${props.noun} as not completed` : `Mark ${props.noun} as completed`} />

        <div className="min-w-0 flex-1">
          <p className={cn("font-medium wrap-break-word", completed && "text-muted-foreground line-through")}>{getTitle(item)}</p>
          {getDescription(item) ? <p className="line-clamp-2 text-sm text-muted-foreground wrap-break-word">{getDescription(item)}</p> : null}
          <p className="mt-1 text-xs text-muted-foreground">
            {props.noun === "task" ? "Due" : "Target"} {formatDate(getDate(item))}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {!completed && (
            <Badge variant="outline" className={cn("hidden sm:inline-flex", daysUntil < 0 && "border-destructive/30 bg-destructive/10 text-destructive")}>
              {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
            </Badge>
          )}
          <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-foreground" aria-label={`Edit ${props.noun}`} disabled={props.isPending} onClick={props.onStartEdit}>
            <PencilIcon className="size-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-7 rounded-lg text-muted-foreground hover:text-destructive" aria-label={`Delete ${props.noun}`} disabled={props.isPending} onClick={props.onStartDelete}>
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
