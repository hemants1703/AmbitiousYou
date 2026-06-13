"use client";

import { ConfirmMilestoneCompletion } from "@/components/(app)/ambitions/confirm-milestone-completion";
import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDate, getDate, getDateLabel, getDaysUntil, getDescription, getKind, getTitle, isCompleted, isMilestone, MOVE_KIND_STYLE, toMoveDetail, type DraftState, type TrackedItem } from "@/lib/(app)/tracked-item";
import { cn } from "@/lib/utils";
import { CheckIcon, EyeIcon, FlagIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { useMoveDetail } from "@/components/(app)/ambitions/move-detail-context";
import { TrackedItemDraftEditor } from "./tracked-item-draft-editor";

interface TrackedItemRowProps {
  item: TrackedItem;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  editDraft: DraftState;
  dateDisabled: Matcher[];
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

export function TrackedItemRow(props: TrackedItemRowProps) {
  const { item } = props;
  const moveDetail = useMoveDetail();
  const completed = isCompleted(item);
  const isMs = isMilestone(item);
  const kind = getKind(item);
  const daysUntil = getDaysUntil(getDate(item));

  if (props.isEditing) {
    return (
      <TrackedItemDraftEditor
        label={`Editing ${kind}`}
        draft={props.editDraft}
        dateDisabled={props.dateDisabled}
        isPending={props.isPending}
        lockKind
        onChange={props.onEditChange}
        onSubmit={props.onSaveEdit}
        onCancel={props.onCancelEdit}
      />
    );
  }

  if (props.isConfirmingDelete) {
    return (
      <div className="space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <p className="text-sm font-medium text-destructive">Delete this {kind}?</p>
        <p className="line-clamp-2 text-sm text-muted-foreground wrap-anywhere">{getTitle(item)}</p>
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
    <div className={cn("group rounded-2xl bg-background border border-border/60 border-l-4 p-3", MOVE_KIND_STYLE[kind].stripe)}>
      <div className="flex items-start gap-3">
        <CompletionControl item={item} isMilestone={isMs} completed={completed} isPending={props.isPending} onToggle={props.onToggle} />

        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => moveDetail.open(toMoveDetail(item))}
            aria-label={`View details of ${kind}: ${getTitle(item)}`}
            className="block min-h-6 w-full cursor-pointer rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <p className={cn("font-medium wrap-anywhere", completed && "text-muted-foreground line-through")}>{getTitle(item)}</p>
            {getDescription(item) ? <p className="line-clamp-2 text-sm text-muted-foreground wrap-anywhere">{getDescription(item)}</p> : null}
          </button>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <MoveKindBadge kind={kind} />
            {isMs && completed ? (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Reached</span>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">
                  {getDateLabel(item)} {formatDate(getDate(item))}
                </p>
                {!completed && (
                  <Badge variant="outline" className={cn("hidden sm:inline-flex", daysUntil < 0 && "border-destructive/30 bg-destructive/10 text-destructive")}>
                    {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* All per-move actions live in one dropdown to keep the row uncluttered (the title is still click-to-view). */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground" aria-label={`Options for ${kind}`}>
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => moveDetail.open(toMoveDetail(item))}>
              <EyeIcon className="size-4" />
              View details
            </DropdownMenuItem>

            {/* Reached milestones are locked achievements — no editing, only removal. */}
            {!(isMs && completed) && (
              <DropdownMenuItem disabled={props.isPending} onClick={props.onStartEdit}>
                <PencilIcon className="size-4" />
                Edit {kind}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" disabled={props.isPending} onClick={props.onStartDelete}>
              <Trash2Icon className="size-4" />
              Delete {kind}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

interface CompletionControlProps {
  item: TrackedItem;
  isMilestone: boolean;
  completed: boolean;
  isPending: boolean;
  onToggle: () => void;
}

/**
 * Tasks use a normal checkbox (toggle freely). Milestones are one-way: completing
 * one requires confirmation (it's permanent), and once reached it shows a locked
 * indicator with no way to reopen.
 */
function CompletionControl(props: CompletionControlProps) {
  if (!props.isMilestone) {
    return (
      <Checkbox
        checked={props.completed}
        disabled={props.isPending}
        onCheckedChange={props.onToggle}
        className="mt-0.5 rounded-full border-2 border-muted-foreground/40 text-transparent transition-colors hover:border-primary dark:hover:border-chart-1 hover:text-primary dark:hover:text-chart-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        aria-label={props.completed ? "Mark task as not completed" : "Mark task as completed"}
      />
    );
  }

  if (props.completed) {
    return (
      <span
        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        aria-label="Milestone reached — locked"
        title="Reached — milestones can't be reopened">
        <CheckIcon className="size-3.5" />
      </span>
    );
  }

  return (
    <ConfirmMilestoneCompletion title={getTitle(props.item)} onConfirm={props.onToggle}>
      <button
        type="button"
        disabled={props.isPending}
        aria-label={`Mark milestone "${getTitle(props.item)}" as reached`}
        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/40 text-transparent transition-colors hover:border-primary dark:hover:border-chart-1 hover:text-primary dark:hover:text-chart-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
        <FlagIcon className="size-3" />
      </button>
    </ConfirmMilestoneCompletion>
  );
}
