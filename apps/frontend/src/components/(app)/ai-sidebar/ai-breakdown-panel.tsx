"use client";

import { Button } from "@/components/ui/button";
import { acceptAiBreakdown, requestAiBreakdown, type AiBreakdownProposal } from "@/lib/actions/(app)/ai/ai-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AiSidebarGroup, AiSidebarGroupLabel, AiSidebarGroupContent } from "@/components/ui/ai-sidebar";

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
      const result = await toastMutation(() => requestAiBreakdown(props.ambitionId!), {
        loading: "Drafting moves…",
        success: "Plan ready for review.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (result.data) {
        setProposal(result.data);
      }
    });
  }

  function handleAccept() {
    if (!proposal || !props.ambitionId) return;

    startTransition(async () => {
      const result = await toastMutation(() => acceptAiBreakdown(props.ambitionId!, proposal), {
        loading: "Adding moves…",
        success: "Moves added to this ambition.",
        error: (msg) => msg,
      }, { getError: (r) => r.error });

      if (!result.error) {
        setProposal(null);
        router.refresh();
      }
    });
  }

  if (!props.ambitionId) {
    return (
      <AiSidebarGroup>
        <AiSidebarGroupLabel>AI Breakdown</AiSidebarGroupLabel>
        <AiSidebarGroupContent className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-center text-sm text-muted-foreground">
            <SparklesIcon className="size-8 mx-auto mb-2 text-accent-brand" />
            <p>Select an ambition to generate an AI breakdown.</p>
            <p className="mt-1">Navigate to an ambition detail page to use this feature.</p>
          </div>
        </AiSidebarGroupContent>
      </AiSidebarGroup>
    );
  }

  return (
    <AiSidebarGroup>
      <AiSidebarGroupLabel>AI Breakdown</AiSidebarGroupLabel>
      <AiSidebarGroupContent className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-foreground">Need a plan for the remaining window?</p>
              <p className="text-sm text-muted-foreground">Generate tasks and milestones, then accept what fits.</p>
            </div>
            <Button onClick={handleGenerate} disabled={isPending}>
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <SparklesIcon className="size-4" />}
              Draft moves
            </Button>
          </div>

          {proposal ? (
            <div className="mt-4 space-y-3">
              {proposal.milestones.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Milestones</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {proposal.milestones.map((milestone) => (
                      <li key={`${milestone.milestone}-${milestone.milestoneTargetDate}`}>
                        {milestone.milestone} · {milestone.milestoneTargetDate}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {proposal.tasks.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tasks</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {proposal.tasks.map((task) => (
                      <li key={`${task.task}-${task.taskDeadline}`}>
                        {task.task} · {task.taskDeadline}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <Button onClick={handleAccept} disabled={isPending}>
                Accept moves
              </Button>
            </div>
          ) : null}
        </div>
      </AiSidebarGroupContent>
    </AiSidebarGroup>
  );
}