"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { acceptAiBreakdown, requestAiBreakdown, type AiBreakdownProposal } from "@/lib/actions/(app)/ai/ai-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { Loader2Icon, SparklesIcon, TargetIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface AiBreakdownPanelProps {
  ambitionId?: string;
}

export function AiBreakdownPanel(props: AiBreakdownPanelProps) {
  const router = useRouter();
  const [proposal, setProposal] = useState<AiBreakdownProposal | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    if (!props.ambitionId) return;

    startTransition(async () => {
      const result = await toastMutation(
        () => requestAiBreakdown(props.ambitionId!),
        {
          loading: "Drafting moves…",
          success: "Plan ready for review.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (result.data) {
        setProposal(result.data);
      }
    });
  }

  function handleAccept() {
    if (!proposal || !props.ambitionId) return;

    startTransition(async () => {
      const result = await toastMutation(
        () => acceptAiBreakdown(props.ambitionId!, proposal),
        {
          loading: "Adding moves…",
          success: "Moves added to this ambition.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (!result.error) {
        setProposal(null);
        router.refresh();
      }
    });
  }

  if (!props.ambitionId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-4 py-2 md:px-5">
        <Empty className="min-h-48 flex-1 border-0 p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TargetIcon />
            </EmptyMedia>
            <EmptyTitle>Open an ambition</EmptyTitle>
            <EmptyDescription>
              Plan drafts tasks and milestones for the ambition you&apos;re viewing.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-2 md:px-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">Draft remaining moves</p>
          <p className="text-sm text-muted-foreground">
            Generate a plan for the window left on this ambition, then accept what fits.
          </p>
        </div>
        <Button type="button" onClick={handleGenerate} disabled={isPending} className="w-fit">
          {isPending ? (
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
          ) : (
            <SparklesIcon data-icon="inline-start" />
          )}
          Draft moves
        </Button>
      </div>

      {proposal ? (
        <div className="flex flex-col gap-4 rounded-2xl bg-muted/40 p-4">
          {proposal.milestones.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">Milestones</p>
              <ul className="flex flex-col gap-1.5 text-sm text-foreground">
                {proposal.milestones.map((milestone) => (
                  <li key={`${milestone.milestone}-${milestone.milestoneTargetDate}`} className="min-w-0 break-words">
                    {milestone.milestone}
                    <span className="text-muted-foreground"> · {milestone.milestoneTargetDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {proposal.tasks.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground">Tasks</p>
              <ul className="flex flex-col gap-1.5 text-sm text-foreground">
                {proposal.tasks.map((task) => (
                  <li key={`${task.task}-${task.taskDeadline}`} className="min-w-0 break-words">
                    {task.task}
                    <span className="text-muted-foreground"> · {task.taskDeadline}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button type="button" onClick={handleAccept} disabled={isPending} className="w-fit">
            {isPending ? <Loader2Icon data-icon="inline-start" className="animate-spin" /> : null}
            Accept moves
          </Button>
        </div>
      ) : null}
    </div>
  );
}
