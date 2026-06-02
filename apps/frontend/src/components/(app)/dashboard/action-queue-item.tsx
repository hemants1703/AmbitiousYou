"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ItemKind } from "@/lib/dashboard/tracked-items";
import { CheckIcon, Loader2Icon, SparklesIcon } from "lucide-react";
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
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

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

  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border p-3 transition-colors", props.isNextMove ? "border-primary/30 bg-primary/5" : "border-border/60 bg-background/60", done && "opacity-60")}>
      <button
        type="button"
        onClick={handleComplete}
        disabled={isPending || done}
        aria-label={`Mark “${props.title}” complete`}
        className={cn(
          // Visual circle is 24px; the ::before expands the touch target to ~44px for mobile (AGENTS.md).
          "relative mt-0.5 flex size-6 shrink-0 touch-manipulation items-center justify-center rounded-full border transition-colors before:absolute before:-inset-2.5 before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          done ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground/40 text-transparent hover:border-primary hover:text-primary/50 disabled:opacity-50",
        )}>
        {isPending ? <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" /> : <CheckIcon className="size-3.5" />}
      </button>

      <div className="min-w-0 flex-1 space-y-1">
        {props.isNextMove ? (
          <p className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
            <SparklesIcon className="size-3" />
            Your next move
          </p>
        ) : null}

        <div className="flex items-start justify-between gap-2">
          <p className={cn("min-w-0 line-clamp-2 font-medium wrap-break-word", done && "text-muted-foreground line-through")}>{props.title}</p>
          <Badge variant="outline" className={cn("shrink-0 tabular-nums", overdue && "border-destructive/30 bg-destructive/10 text-destructive")}>
            {formatDue(props.daysUntil)}
          </Badge>
        </div>

        {props.description ? <p className="line-clamp-1 text-sm text-muted-foreground wrap-break-word">{props.description}</p> : null}

        <Link href={`/ambitions/${props.ambitionId}`} prefetch className="flex max-w-full items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none">
          <span className="min-w-0 truncate" translate="no">
            {props.ambitionName}
          </span>
        </Link>
      </div>
    </div>
  );
}
