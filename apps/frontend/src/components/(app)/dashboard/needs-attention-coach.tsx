"use client";

import { StatCard } from "@/components/(app)/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { upsertLoopContract } from "@/lib/actions/(app)/loop/contract-actions";
import { toastMutation } from "@/lib/(app)/toast-mutation";
import { cn } from "@/lib/utils";
import type { AttentionCoachPayload } from "@/types";
import { CompassIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface NeedsAttentionCoachProps {
  coach: AttentionCoachPayload;
}

export function NeedsAttentionCoach(props: NeedsAttentionCoachProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasPressure =
    (props.coach.daysSinceLastCompletedMove ?? 0) > 2 ||
    (props.coach.daysUntilEndDate !== null && props.coach.daysUntilEndDate <= 14);

  const card = (
    <StatCard
      icon={<CompassIcon className="size-5" />}
      label="Coach"
      value={props.coach.proposedAction ? "1" : "0"}
      helper={props.coach.summary}
      tone={hasPressure ? "warning" : "default"}
      emphasis={hasPressure ? "solid" : "subtle"}
      className={cn("h-full w-full min-h-0", hasPressure && "hover:shadow-lg")}
    />
  );

  if (!props.coach.primaryAmbition) {
    return card;
  }

  function handleUseForToday() {
    const move = props.coach.suggestedMove;
    if (!move || isPending) return;

    startTransition(async () => {
      const result = await toastMutation(
        () =>
          upsertLoopContract({
            moveKind: move.kind,
            moveId: move.id,
          }),
        {
          loading: "Setting today's move…",
          success: "Today's move is set — scroll up to complete when ready.",
          error: (msg) => msg,
        },
        { getError: (r) => r.error },
      );

      if (!result.error) {
        router.refresh();
        document.getElementById("today-contract")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="h-full w-full text-left">
          {card}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Next move</PopoverTitle>
          <PopoverDescription>{props.coach.summary}</PopoverDescription>
        </PopoverHeader>
        {props.coach.proposedAction ? (
          <div className="mt-3 space-y-3">
            <p className="rounded-2xl border border-border/60 bg-muted/20 p-3 text-sm text-foreground">{props.coach.proposedAction}</p>
            {props.coach.suggestedMove ? (
              <Button size="sm" className="w-full" onClick={handleUseForToday} disabled={isPending}>
                {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
                Use for today
              </Button>
            ) : null}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
