import { getActiveAmbitionDetails } from "@/lib/api/ambitions/get-active-ambition-details";
import { flattenOpenItems, groupUpcomingByDay, pickLeadMotivation } from "@/lib/dashboard/tracked-items";
import type { Ambition } from "@ambitiousyou/shared/types";
import { InfoIcon } from "lucide-react";
import { MotivationBanner } from "./motivation-banner";
import { TodayFocus } from "./today-focus";
import { WeeklyPreview } from "./weekly-preview";

interface DashboardInsightsProps {
  sessionToken: string;
  ambitions: Ambition[];
}

/**
 * Async server child streamed behind a single <Suspense> boundary. Fetches per-ambition
 * details for all active ambitions in parallel (errors isolated), derives the open-move
 * views once, and renders the working cluster: the user's "why" then Today alongside the
 * immediate next two days.
 */
export async function DashboardInsights(props: DashboardInsightsProps) {
  const activeAmbitions = props.ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const { details, hadErrors } = await getActiveAmbitionDetails(props.sessionToken, activeAmbitions);

  const openItems = flattenOpenItems(details);
  const upcoming = groupUpcomingByDay(openItems, 2, 1); // tomorrow + day after; today belongs to the Today panel
  const leadMotivation = pickLeadMotivation(openItems, details);

  // Distinguish "genuinely nothing open" from "every detail call failed".
  const loadFailed = activeAmbitions.length > 0 && details.length === 0;

  return (
    <section className="flex flex-col gap-6 duration-500 animate-in fade-in">
      {leadMotivation ? <MotivationBanner ambitionId={leadMotivation.ambitionId} ambitionName={leadMotivation.ambitionName} motivation={leadMotivation.motivation} /> : null}

      {hadErrors && !loadFailed ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <InfoIcon className="size-3.5 shrink-0" />
          Some ambition details couldn&apos;t be loaded, so a few items may be missing.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodayFocus openItems={openItems} loadFailed={loadFailed} />
        <WeeklyPreview groups={upcoming} />
      </div>
    </section>
  );
}
