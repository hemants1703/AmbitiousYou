import { getAllAmbitionMoves } from "@/lib/api/ambitions/get-all-ambition-moves";
import { buildAllMovementSeries } from "@/lib/dashboard/movement";
import type { Ambition } from "@ambitiousyou/shared/types";
import { MovementChart } from "./movement-chart";

interface DashboardMovementProps {
  sessionToken: string;
  ambitions: Ambition[];
}

/**
 * Async server child behind its own <Suspense>. Fetches every ambition's moves — across ALL statuses,
 * since completed/missed ambitions still hold completed moves worth counting — then aggregates the
 * 7/14/30-day movement series server-side and hands serialized buckets to the client chart. Heavier than
 * the insights feed (N×2 requests), so it streams independently at the bottom of the dashboard. All
 * day-bucketing happens here; only strings/numbers cross to the client.
 */
export async function DashboardMovement(props: DashboardMovementProps) {
  const { details, hadErrors } = await getAllAmbitionMoves(props.sessionToken, props.ambitions);
  const series = buildAllMovementSeries(details);

  // The 0003 migration backfilled pre-existing completions from `updated_at`, so history is approximate.
  return <MovementChart series={series} hadErrors={hadErrors} backfillEstimated />;
}
