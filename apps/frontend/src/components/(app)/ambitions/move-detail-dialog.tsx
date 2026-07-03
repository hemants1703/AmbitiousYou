"use client";

import { DetailActionsMenu } from "@/components/(app)/detail-actions-menu";
import { TrackedItemDraftEditor } from "@/components/(app)/ambitions/(ambitionId)/ambition-details/tracked-item-draft-editor";
import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { MOVE_KIND_HEADER_STRIPE, MOVE_KIND_SURFACE, moveCompletionLabel, moveDateLabel, moveTimestamp, moveUrgency, URGENCY_BADGE } from "@/components/(app)/ambitions/move-display";
import { PendingButton } from "@/components/(app)/mutations/pending-button";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBackgroundRefresh } from "@/lib/(app)/mutations/background-refresh";
import { deleteMilestoneAction } from "@/lib/actions/(app)/milestones/delete-milestone";
import { updateMilestoneAction } from "@/lib/actions/(app)/milestones/update-milestone";
import { deleteTaskAction } from "@/lib/actions/(app)/tasks/delete-task";
import { updateTaskAction } from "@/lib/actions/(app)/tasks/update-task";
import { emptyDraft, formatDate, getDaysUntil, MOVE_KIND_STYLE, toDateInputValue, toMoveDetail, type DraftState, type MoveDetail } from "@/lib/(app)/tracked-item";
import { cn } from "@/lib/utils";
import { CalendarDaysIcon, CheckCircle2Icon, FlagIcon, ListTodoIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { Matcher } from "react-day-picker";
import { toast } from "sonner";
import { useMoveDetail } from "@/components/(app)/ambitions/move-detail-context";

interface MoveDetailDialogProps {
  detail: MoveDetail | null;
  ambitionStartDate?: Date | string;
  ambitionEndDate?: Date | string;
  onOpenChange: (open: boolean) => void;
}

type DialogMode = "read" | "edit" | "delete";

export function MoveDetailDialog(props: MoveDetailDialogProps) {
  return (
    <Dialog open={props.detail !== null} onOpenChange={props.onOpenChange}>
      {props.detail ? (
        <MoveDetailContent
          detail={props.detail}
          ambitionStartDate={props.ambitionStartDate}
          ambitionEndDate={props.ambitionEndDate}
          onOpenChange={props.onOpenChange}
        />
      ) : null}
    </Dialog>
  );
}

function MoveDetailContent(props: { detail: MoveDetail; ambitionStartDate?: Date | string; ambitionEndDate?: Date | string; onOpenChange: (open: boolean) => void }) {
  const { detail } = props;
  const moveDetail = useMoveDetail();
  const [mode, setMode] = useState<DialogMode>("read");
  const [editDraft, setEditDraft] = useState<DraftState>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const refreshInBackground = useBackgroundRefresh();

  const style = MOVE_KIND_STYLE[detail.kind];
  const KindIcon = detail.kind === "task" ? ListTodoIcon : FlagIcon;
  const isMs = detail.kind === "milestone";
  const daysUntil = getDaysUntil(detail.date);
  const urgency = moveUrgency(daysUntil, detail.completed, detail.kind);
  const completionLabel = moveCompletionLabel(detail);
  const dateLabel = moveDateLabel(detail.kind);
  const hasDescription = Boolean(detail.description.trim());
  const timestamp = moveTimestamp(detail);
  const canEdit = Boolean(detail.id) && !(isMs && detail.completed);
  const canDelete = Boolean(detail.id);

  const dateDisabled = useMemo<Matcher[]>(() => {
    if (!props.ambitionStartDate || !props.ambitionEndDate) return [];
    return [{ before: new Date(props.ambitionStartDate) }, { after: new Date(props.ambitionEndDate) }];
  }, [props.ambitionStartDate, props.ambitionEndDate]);

  useEffect(() => {
    setMode("read");
    setEditDraft(emptyDraft);
    setError(null);
  }, [detail.id, detail.updatedAt]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setMode("read");
      setEditDraft(emptyDraft);
      setError(null);
    }
    props.onOpenChange(open);
  }

  function handleStartEdit() {
    setEditDraft({
      kind: detail.kind,
      title: detail.title,
      description: detail.description,
      date: toDateInputValue(new Date(detail.date)),
    });
    setError(null);
    setMode("edit");
  }

  function handleSave() {
    if (!detail.id) return;
    const title = editDraft.title.trim();
    if (!title || !editDraft.date) return;

    startTransition(async () => {
      setError(null);
      const description = editDraft.description.trim();

      if (detail.kind === "task") {
        const result = await updateTaskAction(detail.id!, {
          task: title,
          taskDescription: description,
          taskCompleted: detail.completed,
          taskDeadline: editDraft.date,
        });
        if (result.error || !result.task) {
          setError(result.error ?? "Failed to update move. Please try again.");
          return;
        }
        moveDetail.syncDetail({
          ...toMoveDetail(result.task),
          ambitionName: detail.ambitionName,
        });
      } else {
        const result = await updateMilestoneAction(detail.id!, {
          milestone: title,
          milestoneDescription: description,
          milestoneCompleted: detail.completed,
          milestoneTargetDate: editDraft.date,
        });
        if (result.error || !result.milestone) {
          setError(result.error ?? "Failed to update move. Please try again.");
          return;
        }
        moveDetail.syncDetail({
          ...toMoveDetail(result.milestone),
          ambitionName: detail.ambitionName,
        });
      }

      toast.success("Move updated");
      setMode("read");
      refreshInBackground();
    });
  }

  function handleDelete() {
    if (!detail.id) return;

    startTransition(async () => {
      setError(null);
      const result = detail.kind === "task" ? await deleteTaskAction(detail.id!) : await deleteMilestoneAction(detail.id!);
      if (result.error) {
        setError(result.error);
        return;
      }

      toast.success(`${isMs ? "Milestone" : "Task"} deleted`);
      handleOpenChange(false);
      refreshInBackground();
    });
  }

  return (
    <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg" showCloseButton={false}>
      <div className={cn("relative border-b px-6 pt-6 pb-4", MOVE_KIND_SURFACE[detail.kind])}>
        <div className="absolute top-4 right-4">
          <DetailActionsMenu
            disabled={isPending}
            onEdit={canEdit ? handleStartEdit : undefined}
            onDelete={canDelete ? () => setMode("delete") : undefined}
            editLabel={`Edit ${detail.kind}`}
            deleteLabel={`Delete ${detail.kind}`}
          />
        </div>

        <DialogHeader className={cn("border-l-4 pr-10 pl-3", MOVE_KIND_HEADER_STRIPE[detail.kind])}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em]", style.text)}>
              <KindIcon className="size-3.5" aria-hidden="true" />
              {style.label}
            </span>
            <MoveKindBadge kind={detail.kind} />
            {mode === "read" ? (
              <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums", URGENCY_BADGE[urgency.tone])}>
                {detail.completed ? <CheckCircle2Icon className="mr-1 size-3" aria-hidden="true" /> : null}
                {urgency.label}
              </span>
            ) : null}
          </div>

          {mode === "read" ? (
            <>
              <DialogTitle className="mt-2 text-xl leading-snug wrap-anywhere">{detail.title}</DialogTitle>
              {detail.ambitionName ? (
                <DialogDescription>
                  Part of{" "}
                  {detail.ambitionId ? (
                    <Link
                      prefetch
                      href={`/ambitions/${detail.ambitionId}`}
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                      translate="no"
                      onClick={() => handleOpenChange(false)}>
                      {detail.ambitionName}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground" translate="no">
                      {detail.ambitionName}
                    </span>
                  )}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">{isMs ? "Milestone details" : "Task details"}</DialogDescription>
              )}
            </>
          ) : mode === "edit" ? (
            <>
              <DialogTitle>Editing {detail.kind}</DialogTitle>
              <DialogDescription>Update the title, date, or description.</DialogDescription>
            </>
          ) : (
            <>
              <DialogTitle className="text-destructive">Delete this {detail.kind}?</DialogTitle>
              <DialogDescription>This cannot be undone.</DialogDescription>
            </>
          )}
        </DialogHeader>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-4">
        {error ? (
          <div role="alert" aria-live="polite" className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {mode === "read" ? (
          <>
            {detail.completed ? (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2Icon className="size-4 shrink-0" aria-hidden="true" />
                {completionLabel ?? (isMs ? "Milestone reached — a permanent win on this ambition." : "Completed")}
              </div>
            ) : (
              <div className={cn("flex items-start gap-3 rounded-2xl border p-3", MOVE_KIND_SURFACE[detail.kind])}>
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/80", style.text)} aria-hidden="true">
                  <CalendarDaysIcon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{dateLabel} date</p>
                  <p className="font-medium tabular-nums">{formatDate(detail.date)}</p>
                  <p className={cn("text-xs", urgency.tone === "overdue" ? "font-medium text-destructive" : "text-muted-foreground")}>{urgency.label}</p>
                </div>
              </div>
            )}

            {hasDescription ? (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">About this move</p>
                <div className="max-h-[min(40vh,18rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border/60 bg-muted/15 p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground wrap-anywhere">{detail.description}</p>
                </div>
              </div>
            ) : null}

            {timestamp ? <p className="text-xs text-muted-foreground">{timestamp}</p> : null}
          </>
        ) : null}

        {mode === "edit" ? (
          <TrackedItemDraftEditor
            label={`Editing ${detail.kind}`}
            draft={editDraft}
            dateDisabled={dateDisabled}
            isPending={isPending}
            lockKind
            onChange={setEditDraft}
            onSubmit={handleSave}
            onCancel={() => setMode("read")}
          />
        ) : null}

        {mode === "delete" ? (
          <div className={cn("rounded-2xl border p-4", MOVE_KIND_SURFACE[detail.kind])}>
            <p className="font-medium wrap-anywhere">{detail.title}</p>
            {hasDescription ? <p className="mt-2 text-sm whitespace-pre-wrap text-muted-foreground wrap-anywhere">{detail.description}</p> : null}
          </div>
        ) : null}
      </div>

      <DialogFooter className="border-t bg-muted/20 px-6 py-4">
        {mode === "delete" ? (
          <>
            <PendingButton type="button" variant="destructive" size="sm" isPending={isPending} onClick={handleDelete}>
              <Trash2Icon className="size-3.5" />
              Yes, delete
            </PendingButton>
            <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={() => setMode("read")}>
              Cancel
            </Button>
          </>
        ) : (
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              Close
            </Button>
          </DialogClose>
        )}
      </DialogFooter>
    </DialogContent>
  );
}
