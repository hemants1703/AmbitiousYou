"use client";

import type { AttentionCoachPayload } from "@/types";
import { CompassIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface AiCoachPanelProps {
  coach: AttentionCoachPayload | null;
}

export function AiCoachPanel(props: AiCoachPanelProps) {
  if (!props.coach) {
    return (
      <div className="flex min-h-0 flex-1 flex-col px-4 py-2 md:px-5">
        <Empty className="min-h-48 flex-1 border-0 p-6">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CompassIcon />
            </EmptyMedia>
            <EmptyTitle>No coaching yet</EmptyTitle>
            <EmptyDescription>
              Favourite an active ambition to get a focused next-step summary.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const hasPressure =
    (props.coach.daysSinceLastCompletedMove ?? 0) > 2 ||
    (props.coach.daysUntilEndDate !== null && props.coach.daysUntilEndDate <= 14);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-2 md:px-5">
      <div
        className={cn(
          "flex flex-col gap-3 rounded-2xl p-4",
          hasPressure ? "bg-primary/5" : "bg-muted/40",
        )}>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CompassIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Coach
        </div>
        <p className="text-sm leading-relaxed text-foreground">{props.coach.summary}</p>
        {props.coach.proposedAction ? (
          <div className="flex flex-col gap-1 rounded-xl bg-background/70 px-3 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">Suggested action</p>
            <p className="text-sm text-foreground">{props.coach.proposedAction}</p>
          </div>
        ) : null}
      </div>

      {props.coach.primaryAmbition ? (
        <dl className="flex flex-col gap-2 px-1 text-sm text-muted-foreground">
          <div className="flex min-w-0 flex-col gap-0.5">
            <dt className="text-xs font-medium">Primary</dt>
            <dd className="truncate text-foreground">{props.coach.primaryAmbition.ambitionName}</dd>
          </div>
          {props.coach.daysSinceLastCompletedMove !== null ? (
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-medium">Last completed move</dt>
              <dd className="tabular-nums text-foreground">
                {props.coach.daysSinceLastCompletedMove}{" "}
                {props.coach.daysSinceLastCompletedMove === 1 ? "day" : "days"} ago
              </dd>
            </div>
          ) : null}
          {props.coach.daysUntilEndDate !== null ? (
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-medium">End date</dt>
              <dd className="tabular-nums text-foreground">
                {props.coach.daysUntilEndDate}{" "}
                {props.coach.daysUntilEndDate === 1 ? "day" : "days"} out
              </dd>
            </div>
          ) : null}
          {props.coach.nextMilestoneTitle ? (
            <div className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs font-medium">Next milestone</dt>
              <dd className="break-words text-foreground">{props.coach.nextMilestoneTitle}</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="px-1 text-sm text-muted-foreground">
          Favourite one active ambition to get coaching.
        </p>
      )}
    </div>
  );
}
