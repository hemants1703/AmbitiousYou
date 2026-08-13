import { getAllAmbitionMoves } from "@/lib/api/ambitions/get-all-ambition-moves";
import { buildActivityCalendar } from "@/lib/dashboard/activity-calendar";
import { buildAllMovementSeries } from "@/lib/dashboard/movement";
import type { Ambition } from "@ambitiousyou/shared/types";
import { connection } from "next/server";
import { ActivityCalendarCard } from "./activity-calendar";
import { MovementChart } from "./movement-chart";

interface DashboardActivityProps {
  ambitions: Ambition[];
}

/**
 * Async server child behind its own <Suspense>. Fetches every ambition's moves ONCE — across ALL
 * statuses, since completed/missed ambitions still hold completed moves worth counting — then builds
 * both the year-long activity calendar and the 7/14/30-day movement series from the same data, so
 * the two visualizations never disagree about a day and the N×2 request cost is paid once. All
 * day-bucketing happens here; only strings/numbers cross to the client. The year overview (calendar)
 * sits above the recent-window detail (bar chart).
 */
export async function DashboardActivity(props: DashboardActivityProps) {
  await connection();

  const { details, hadErrors } = await getAllAmbitionMoves(props.ambitions);
  const now = new Date();
  const calendar = buildActivityCalendar(details, now);
  const series = buildAllMovementSeries(details, now);

  // The 0003 migration backfilled pre-existing completions from `updated_at`, so history is approximate.
  return (
    <div className="flex flex-col gap-6">
      <ActivityCalendarCard calendar={calendar} hadErrors={hadErrors} backfillEstimated />
      <MovementChart series={series} hadErrors={hadErrors} backfillEstimated />
    </div>
  );
}
