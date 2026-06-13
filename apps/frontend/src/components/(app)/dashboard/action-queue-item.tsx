"use client";

import { ConfirmMilestoneCompletion } from "@/components/(app)/ambitions/confirm-milestone-completion";
import { useMoveDetail } from "@/components/(app)/ambitions/move-detail-context";
import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOVE_KIND_STYLE } from "@/lib/(app)/tracked-item";
import type { ItemKind } from "@/lib/dashboard/tracked-items";
import { CheckIcon, EyeIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleTaskCompletionAction } from "@/lib/actions/(app)/tasks/toggle-task-completion";
import { toggleMilestoneCompletionAction } from "@/lib/actions/(app)/milestones/toggle-milestone-completion";

interface ActionQueueItemProps {
  id: string;
  kind: ItemKind;
  title: string;
  description: string | null;
  /** Deadline (task) or target date (milestone) — shown in the detail dialog, not the row. */
  date: Date;
  ambitionId: string;
  ambitionName: string;
  daysUntil: number;
  isNextMove?: boolean;
}

function formatDue(daysUntil: number): string {
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d overdue`;
  if (daysUntil === 0) return "Due today";
  if (daysUntil === 1) return "Due tomorrow";
  return `${daysUntil}d left`;
}

export function ActionQueueItem(props: ActionQueueItemProps) {
  const router = useRouter();
  const moveDetail = useMoveDetail();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function openDetail() {
    moveDetail.open({
      kind: props.kind,
      title: props.title,
      description: props.description ?? "",
      date: props.date,
      // The action queue only surfaces open items.
      completed: false,
      ambitionName: props.ambitionName,
    });
  }

  function handleComplete() {
    if (done || isPending) return;

    // Optimistically mark complete; revert on failure.
    setDone(true);

    startTransition(async () => {
      const toggle = props.kind === "task" ? toggleTaskCompletionAction : toggleMilestoneCompletionAction;
      const result = await toggle(props.id);

      if (result.error) {
        setDone(false);
        toast.error(result.error);
        return;
      }

      toast.success(`Completed “${props.title}”`);
      // Re-run the server fetch so the queue, buckets, and ambition % reflect reality.
      router.refresh();
    });
  }

  const overdue = props.daysUntil < 0;
  const isMilestone = props.kind === "milestone";

  const completeButton = (
    <button
      type="button"
      onClick={isMilestone ? undefined : handleComplete}
      disabled={isPending || done}
      aria-label={isMilestone ? `Mark milestone “${props.title}” reached` : `Mark task “${props.title}” complete`}
      className={cn(
        // Visual circle is 24px; the ::before expands the touch target to ~44px for mobile (AGENTS.md).
        "relative mt-0.5 flex size-6 shrink-0 touch-manipulation items-center justify-center rounded-full border transition-colors before:absolute before:-inset-2.5 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40 text-transparent hover:border-primary dark:hover:border-chart-1 hover:text-primary/50 dark:hover:text-chart-1/50 disabled:opacity-50",
      )}>
      {isPending ? <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" /> : <CheckIcon className="size-3.5" />}
    </button>
  );

  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border border-l-4 p-3 transition-colors", props.isNextMove ? "border-primary/30 dark:border-chart-1/30 bg-primary/5 dark:bg-chart-1/5" : "border-border/60 bg-background/60", MOVE_KIND_STYLE[props.kind].stripe, done && "opacity-60")}>
      {/* Completing a milestone is irreversible, so it goes through a confirm dialog; tasks toggle directly. */}
      {isMilestone ? <ConfirmMilestoneCompletion title={props.title} onConfirm={handleComplete}>{completeButton}</ConfirmMilestoneCompletion> : completeButton}

      <div className="min-w-0 flex-1 space-y-1">
        {props.isNextMove ? (
          <p className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary dark:text-chart-1">
            <SparklesIcon className="size-3" />
            Your next move
          </p>
        ) : null}

        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={openDetail}
            aria-label={`View details of ${props.kind}: ${props.title}`}
            className={cn("min-w-0 line-clamp-2 cursor-pointer rounded-md text-left font-medium wrap-anywhere focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", done && "text-muted-foreground line-through")}>
            {props.title}
          </button>
          <Badge variant="outline" className={cn("shrink-0 tabular-nums", overdue && "border-destructive/30 bg-destructive/10 text-destructive")}>
            {formatDue(props.daysUntil)}
          </Badge>
        </div>

        {props.description ? <p className="line-clamp-1 text-sm text-muted-foreground wrap-anywhere">{props.description}</p> : null}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MoveKindBadge kind={props.kind} />
          <span aria-hidden="true">·</span>
          <Link href={`/ambitions/${props.ambitionId}`} prefetch className="min-w-0 truncate transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none" translate="no">
            {props.ambitionName}
          </Link>
        </div>
      </div>

      {/* Always visible so peeking the full details is discoverable (the title is also clickable). */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
        aria-label={`View details of ${props.kind}`}
        onClick={openDetail}>
        <EyeIcon className="size-4" />
      </Button>
    </div>
  );
}
