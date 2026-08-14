"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttentionCoachPayload } from "@/types";
import { CompassIcon } from "lucide-react";
import { AiSidebarGroup, AiSidebarGroupLabel, AiSidebarGroupContent } from "@/components/ui/ai-sidebar";

interface AiCoachPanelProps {
  coach: AttentionCoachPayload;
}

export function AiCoachPanel(props: AiCoachPanelProps) {
  const hasPressure =
    (props.coach.daysSinceLastCompletedMove ?? 0) > 2 ||
    (props.coach.daysUntilEndDate !== null && props.coach.daysUntilEndDate <= 14);

  return (
    <AiSidebarGroup>
      <AiSidebarGroupLabel>AI Coach</AiSidebarGroupLabel>
      <AiSidebarGroupContent className="space-y-4">
        <Card className={hasPressure ? "border-primary/30 bg-primary/5" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CompassIcon className="size-4 text-accent-brand" />
              Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground">{props.coach.summary}</p>
            {props.coach.proposedAction ? (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground">Suggested action</p>
                <p className="text-sm text-foreground mt-1">{props.coach.proposedAction}</p>
              </div>
            ) : null}
            {props.coach.primaryAmbition ? (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Primary: {props.coach.primaryAmbition.ambitionName}</p>
                {props.coach.daysSinceLastCompletedMove !== null && (
                  <p>Last completed move: {props.coach.daysSinceLastCompletedMove} day{props.coach.daysSinceLastCompletedMove === 1 ? "" : "s"} ago</p>
                )}
                {props.coach.daysUntilEndDate !== null && (
                  <p>End date: {props.coach.daysUntilEndDate} day{props.coach.daysUntilEndDate === 1 ? "" : "s"} out</p>
                )}
                {props.coach.nextMilestoneTitle && (
                  <p>Next milestone: {props.coach.nextMilestoneTitle}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Favourite one active ambition to get coaching.
              </p>
            )}
          </CardContent>
        </Card>
      </AiSidebarGroupContent>
    </AiSidebarGroup>
  );
}