import { DashboardInsightsPanels } from "@/components/(app)/dashboard/dashboard-insights-panels";
import type { DayGroup, LeadMotivation, QueueItem } from "@/lib/dashboard/tracked-items";

interface DashboardInsightsProps {
  hadErrors: boolean;
  loadFailed: boolean;
  openItems: QueueItem[];
  upcoming: DayGroup[];
  weekGroups: DayGroup[];
  leadMotivation: LeadMotivation | null;
}

export function DashboardInsights(props: DashboardInsightsProps) {
  return (
    <DashboardInsightsPanels
      openItems={props.openItems}
      upcoming={props.upcoming}
      weekGroups={props.weekGroups}
      leadMotivation={props.leadMotivation}
      hadErrors={props.hadErrors}
      loadFailed={props.loadFailed}
    />
  );
}
