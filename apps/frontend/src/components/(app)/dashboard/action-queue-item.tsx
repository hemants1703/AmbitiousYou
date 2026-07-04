"use client";

import { ConfirmMilestoneCompletion } from "@/components/(app)/ambitions/confirm-milestone-completion";
import { LinkifiedText } from "@/components/linkified-text";
import { useMoveDetail } from "@/components/(app)/ambitions/move-detail-context";
import { MoveKindBadge } from "@/components/(app)/ambitions/move-kind-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBackgroundRefresh } from "@/lib/(app)/mutations/background-refresh";
import { useOptionalDashboardMoves } from "@/lib/(app)/mutations/dashboard-moves-context";
import { MOVE_KIND_STYLE } from "@/lib/(app)/tracked-item";
import type { ItemKind } from "@/lib/dashboard/tracked-items";
import { toggleMilestoneCompletionAction } from "@/lib/actions/(app)/milestones/toggle-milestone-completion";
import { toggleTaskCompletionAction } from "@/lib/actions/(app)/tasks/toggle-task-completion";
import { EyeIcon, FlagIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ActionQueueItemProps {
  id: string;
  kind: ItemKind;
  title: string;
  description: string | null;
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
  const moveDetail = useMoveDetail();
  const dashboardMoves = useOptionalDashboardMoves();
  const refreshInBackground = useBackgroundRefresh();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function openDetail() {
    moveDetail.open({
      id: props.id,
      kind: props.kind,
      title: props.title,
      description: props.description ?? "",
      date: props.date,
      completed: false,
      ambitionName: props.ambitionName,
      ambitionId: props.ambitionId,
    });
  }

  function handleComplete() {
    if (done || isPending) return;

    setDone(true);
    dashboardMoves?.removeOpenItem(props.id, props.kind);

    startTransition(async () => {
      const toggle = props.kind === "task" ? toggleTaskCompletionAction : toggleMilestoneCompletionAction;
      const result = await toggle(props.id);

      if (result.error) {
        setDone(false);
        toast.error(result.error);
        refreshInBackground();
        return;
      }

      toast.success(`Completed “${props.title}”`);
      refreshInBackground();
    });
  }

  const overdue = props.daysUntil < 0;
  const isMilestone = props.kind === "milestone";
  const kindStyle = MOVE_KIND_STYLE[props.kind];

  if (done) {
    return null;
  }

  return (
    <div className={cn("group rounded-2xl border border-l-4 bg-background/80 p-3", kindStyle.stripe, overdue && "border-destructive/30")}>
      <div className="flex items-start gap-3">
        <CompletionControl isMilestone={isMilestone} isPending={isPending} title={props.title} onComplete={handleComplete} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openDetail}
              className="min-w-0 text-left font-medium wrap-anywhere hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
              {props.title}
            </button>
            {props.isNextMove ? (
              <Badge variant="secondary" className="gap-1 text-[10px] uppercase tracking-wide">
                <SparklesIcon className="size-3" />
                Next
              </Badge>
            ) : null}
          </div>

          {props.description ? (
            <p className="line-clamp-2 text-sm whitespace-pre-wrap text-muted-foreground wrap-anywhere">
              <LinkifiedText text={props.description} />
            </p>
          ) : null}

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <MoveKindBadge kind={props.kind} />
            <p className={cn("text-xs text-muted-foreground", overdue && "font-medium text-destructive")}>{formatDue(props.daysUntil)}</p>
            <Link prefetch href={`/ambitions/${props.ambitionId}?ref=dashboard`} className="text-xs text-muted-foreground hover:text-foreground hover:underline truncate" translate="no">
              {props.ambitionName}
            </Link>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0 rounded-lg text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100" aria-label="View details" onClick={openDetail}>
          <EyeIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

interface CompletionControlProps {
  isMilestone: boolean;
  isPending: boolean;
  title: string;
  onComplete: () => void;
}

function CompletionControl(props: CompletionControlProps) {
  if (!props.isMilestone) {
    return (
      <button
        type="button"
        disabled={props.isPending}
        onClick={props.onComplete}
        aria-label={`Mark task "${props.title}" as complete`}
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/40 transition-colors hover:border-accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none">
        {props.isPending ? <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" /> : null}
      </button>
    );
  }

  return (
    <ConfirmMilestoneCompletion title={props.title} onConfirm={props.onComplete}>
      <button
        type="button"
        disabled={props.isPending}
        aria-label={`Mark milestone "${props.title}" as reached`}
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/40 text-transparent transition-colors hover:border-accent-brand hover:text-accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none">
        {props.isPending ? <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" /> : <FlagIcon className="size-3" />}
      </button>
    </ConfirmMilestoneCompletion>
  );
}
