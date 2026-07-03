"use client";

import { MotivationBanner } from "@/components/(app)/dashboard/motivation-banner";
import { TodayFocus } from "@/components/(app)/dashboard/today-focus";
import { WeeklyPreview } from "@/components/(app)/dashboard/weekly-preview";
import type { DayGroup, QueueItem } from "@/lib/dashboard/tracked-items";
import { InfoIcon } from "lucide-react";

interface DashboardInsightsPanelsProps {
  openItems: QueueItem[];
  upcoming: DayGroup[];
  weekGroups: DayGroup[];
  leadMotivation: { ambitionId: string; ambitionName: string; motivation: string } | null;
  hadErrors: boolean;
  loadFailed: boolean;
}

export function DashboardInsightsPanels(props: DashboardInsightsPanelsProps) {
  return (
    <section className="flex flex-col gap-6 duration-500 animate-in fade-in">
      {props.leadMotivation ? (
        <MotivationBanner ambitionId={props.leadMotivation.ambitionId} ambitionName={props.leadMotivation.ambitionName} motivation={props.leadMotivation.motivation} />
      ) : null}

      {props.hadErrors && !props.loadFailed ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <InfoIcon className="size-3.5 shrink-0" />
          Some ambition details couldn&apos;t be loaded, so a few items may be missing.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodayFocus loadFailed={props.loadFailed} />
        <WeeklyPreview groups={props.upcoming} weekGroups={props.weekGroups} />
      </div>
    </section>
  );
}
