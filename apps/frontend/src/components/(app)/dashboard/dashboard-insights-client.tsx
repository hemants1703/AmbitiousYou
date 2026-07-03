"use client";

import { DashboardInsightsPanels } from "@/components/(app)/dashboard/dashboard-insights-panels";
import { DashboardMovesProvider } from "@/lib/(app)/mutations/dashboard-moves-context";
import { flattenOpenItems, groupUpcomingByDay, pickLeadMotivation, type QueueItem } from "@/lib/dashboard/tracked-items";
import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import type { ReactNode } from "react";

interface DashboardInsightsClientProps {
  details: AmbitionDetails[];
  hadErrors: boolean;
  loadFailed: boolean;
  children?: ReactNode;
}

export function DashboardInsightsClient(props: DashboardInsightsClientProps) {
  const openItems = flattenOpenItems(props.details);
  const upcoming = groupUpcomingByDay(openItems, 2, 1);
  const weekAhead = groupUpcomingByDay(openItems, 7, 1);
  const leadMotivation = pickLeadMotivation(openItems, props.details);

  return (
    <DashboardMovesProvider initialOpenItems={openItems}>
      <DashboardInsightsPanels
        openItems={openItems}
        upcoming={upcoming}
        weekGroups={weekAhead}
        leadMotivation={leadMotivation}
        hadErrors={props.hadErrors}
        loadFailed={props.loadFailed}
      />
    </DashboardMovesProvider>
  );
}

export type { QueueItem };
