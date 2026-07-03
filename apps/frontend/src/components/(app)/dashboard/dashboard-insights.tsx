import { getActiveAmbitionDetails } from "@/lib/api/ambitions/get-active-ambition-details";
import type { Ambition } from "@ambitiousyou/shared/types";
import { DashboardInsightsClient } from "./dashboard-insights-client";

interface DashboardInsightsProps {
  sessionToken: string;
  ambitions: Ambition[];
}

/**
 * Async server child streamed behind a single <Suspense> boundary. Fetches open moves
 * in one batch call, then hands off to the client provider for optimistic updates.
 */
export async function DashboardInsights(props: DashboardInsightsProps) {
  const activeAmbitions = props.ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const { details, hadErrors } = await getActiveAmbitionDetails(props.sessionToken, activeAmbitions);
  const loadFailed = activeAmbitions.length > 0 && details.length === 0;

  return <DashboardInsightsClient details={details} hadErrors={hadErrors} loadFailed={loadFailed} />;
}
