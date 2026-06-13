import { getAllAmbitionMoves } from "@/lib/api/ambitions/get-all-ambition-moves";
import { buildContributionCalendar } from "@/lib/dashboard/contribution";
import { buildAllMovementSeries } from "@/lib/dashboard/movement";
import type { Ambition } from "@ambitiousyou/shared/types";
import { ContributionGraph } from "./contribution-graph";
import { MovementChart } from "./movement-chart";

interface DashboardActivityProps {
  sessionToken: string;
  ambitions: Ambition[];
}

/**
 * Async server child behind its own <Suspense>. Fetches every ambition's moves ONCE — across ALL
 * statuses, since completed/missed ambitions still hold completed moves worth counting — then builds
 * both the year-long contribution calendar and the 7/14/30-day movement series from the same data, so
 * the two visualizations never disagree about a day and the N×2 request cost is paid once. All
 * day-bucketing happens here; only strings/numbers cross to the client. The year overview (calendar)
 * sits above the recent-window detail (bar chart).
 */
export async function DashboardActivity(props: DashboardActivityProps) {
  const { details, hadErrors } = await getAllAmbitionMoves(props.sessionToken, props.ambitions);
  const calendar = buildContributionCalendar(details);
  const series = buildAllMovementSeries(details);

  // The 0003 migration backfilled pre-existing completions from `updated_at`, so history is approximate.
  return (
    <div className="flex flex-col gap-6">
      <ContributionGraph calendar={calendar} hadErrors={hadErrors} backfillEstimated />
      <MovementChart series={series} hadErrors={hadErrors} backfillEstimated />
    </div>
  );
}
