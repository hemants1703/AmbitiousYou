"use client";

import { StatCard } from "@/components/(app)/dashboard/stat-card";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import type { AttentionCoachPayload } from "@/types";
import { cn } from "@/lib/utils";
import { CompassIcon } from "lucide-react";

interface NeedsAttentionCoachProps {
  coach: AttentionCoachPayload;
}

export function NeedsAttentionCoach(props: NeedsAttentionCoachProps) {
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
          <p className="mt-3 rounded-2xl border border-border/60 bg-muted/20 p-3 text-sm text-foreground">{props.coach.proposedAction}</p>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
