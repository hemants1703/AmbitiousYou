"use client";

import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, getDate, getDateLabel, getDaysUntil, getDescription, getKind, getTitle, isCompleted, isMilestone, MOVE_KIND_STYLE, type TrackedItem } from "@/lib/(app)/tracked-item";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";

interface MoveDetailDialogProps {
  item: TrackedItem | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Read-only detail view for a single move. Lists every field — kind, status,
 * date, the FULL (unclamped, scrollable) description, and timestamps — so a long
 * description can be read in full, which no list surface allows (they all clamp
 * to two lines). Mutations stay on the row; this view never edits.
 */
export function MoveDetailDialog(props: MoveDetailDialogProps) {
  const { item } = props;

  return (
    <Dialog open={item !== null} onOpenChange={props.onOpenChange}>
      {item && <MoveDetailContent item={item} />}
    </Dialog>
  );
}

function MoveDetailContent(props: { item: TrackedItem }) {
  const { item } = props;
  const kind = getKind(item);
  const style = MOVE_KIND_STYLE[kind];
  const completed = isCompleted(item);
  const isMs = isMilestone(item);
  const description = getDescription(item);
  const daysUntil = getDaysUntil(getDate(item));

  // Reached milestones intentionally show no date (they're a moment, not a deadline) —
  // mirrors the row. Open items and completed tasks keep their Due/Target date.
  const showDate = !(isMs && completed);

  const timestamp =
    item.updatedAt && item.createdAt && new Date(item.updatedAt).getTime() !== new Date(item.createdAt).getTime()
      ? `Updated ${formatDate(item.updatedAt)}`
      : item.createdAt
        ? `Added ${formatDate(item.createdAt)}`
        : "";

  return (
    <DialogContent>
      <DialogHeader className={cn("border-l-4 pl-3", style.stripe)}>
        <div className="flex flex-wrap items-center gap-2">
          <MoveKindBadge kind={kind} />
          {completed ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2Icon className="size-3.5" />
              {isMs ? "Reached" : "Completed"}
            </span>
          ) : (
            <Badge variant="outline" className={cn("tabular-nums", daysUntil < 0 && "border-destructive/30 bg-destructive/10 text-destructive")}>
              {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d left`}
            </Badge>
          )}
        </div>

        <DialogTitle className="wrap-break-word">{getTitle(item)}</DialogTitle>

        {showDate ? (
          <DialogDescription>
            {getDateLabel(item)} {formatDate(getDate(item))}
          </DialogDescription>
        ) : (
          <DialogDescription className="sr-only">Milestone reached</DialogDescription>
        )}
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {description ? (
          <p className="text-sm whitespace-pre-wrap text-muted-foreground wrap-break-word">{description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description provided.</p>
        )}
      </div>

      {timestamp ? <p className="text-xs text-muted-foreground">{timestamp}</p> : null}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
