"use client";

import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate, getDaysUntil, MOVE_KIND_STYLE, type MoveDetail } from "@/lib/(app)/tracked-item";
import { cn } from "@/lib/utils";
import { CheckCircle2Icon } from "lucide-react";

interface MoveDetailDialogProps {
  detail: MoveDetail | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Read-only detail view for a single move (task or milestone). Lists every field —
 * kind, status, date, the FULL (unclamped, scrollable) description, and any
 * timestamps — so a long description can be read in full, which no list surface
 * allows (they all clamp). Shared across the ambition detail page and the dashboard
 * "next moves" card; mutations stay on the rows, this view never edits.
 */
export function MoveDetailDialog(props: MoveDetailDialogProps) {
  const { detail } = props;

  return (
    <Dialog open={detail !== null} onOpenChange={props.onOpenChange}>
      {detail && <MoveDetailContent detail={detail} />}
    </Dialog>
  );
}

function MoveDetailContent(props: { detail: MoveDetail }) {
  const { detail } = props;
  const style = MOVE_KIND_STYLE[detail.kind];
  const completed = detail.completed;
  const isMs = detail.kind === "milestone";
  const dateLabel = isMs ? "Target" : "Due";
  const daysUntil = getDaysUntil(detail.date);

  // Reached milestones intentionally show no date (a moment, not a deadline) — mirrors the row.
  const showDate = !(isMs && completed);

  const timestamp =
    detail.updatedAt && detail.createdAt && new Date(detail.updatedAt).getTime() !== new Date(detail.createdAt).getTime()
      ? `Updated ${formatDate(detail.updatedAt)}`
      : detail.createdAt
        ? `Added ${formatDate(detail.createdAt)}`
        : "";

  return (
    <DialogContent>
      <DialogHeader className={cn("border-l-4 pl-3", style.stripe)}>
        <div className="flex flex-wrap items-center gap-2">
          <MoveKindBadge kind={detail.kind} />
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

        <DialogTitle className="wrap-break-word">{detail.title}</DialogTitle>

        {showDate ? (
          <DialogDescription>
            {dateLabel} {formatDate(detail.date)}
          </DialogDescription>
        ) : (
          <DialogDescription className="sr-only">Milestone reached</DialogDescription>
        )}

        {detail.ambitionName ? (
          <p className="text-xs text-muted-foreground">
            in{" "}
            <span className="font-medium text-foreground" translate="no">
              {detail.ambitionName}
            </span>
          </p>
        ) : null}
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {detail.description ? (
          <p className="text-sm whitespace-pre-wrap text-muted-foreground wrap-break-word">{detail.description}</p>
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
