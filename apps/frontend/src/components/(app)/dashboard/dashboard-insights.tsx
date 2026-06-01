import { getActiveAmbitionDetails } from "@/lib/api/ambitions/get-active-ambition-details";
import { bucketByDeadline, computeAttentionFlags, flattenOpenItems, groupUpcomingByDay } from "@/lib/dashboard/tracked-items";
import type { Ambition } from "@ambitiousyou/shared/types";
import { InfoIcon } from "lucide-react";
import { ActionQueue } from "./action-queue";
import { AttentionList } from "./attention-list";
import { DeadlinePressure } from "./deadline-pressure";
import { WeeklyPreview } from "./weekly-preview";

const QUEUE_LIMIT = 7;

interface DashboardInsightsProps {
  sessionToken: string;
  ambitions: Ambition[];
}

/**
 * Async server child streamed behind a single <Suspense> boundary. Fetches
 * per-ambition details for all active ambitions in parallel (errors isolated),
 * builds every derived view once, and renders the working cluster.
 */
export async function DashboardInsights(props: DashboardInsightsProps) {
  const activeAmbitions = props.ambitions.filter((ambition) => ambition.ambitionStatus === "active");
  const { details, hadErrors } = await getActiveAmbitionDetails(props.sessionToken, activeAmbitions);

  const openItems = flattenOpenItems(details);
  const queue = openItems.slice(0, QUEUE_LIMIT);
  const buckets = bucketByDeadline(openItems);
  const upcoming = groupUpcomingByDay(openItems);
  const flags = computeAttentionFlags(details);

  // Distinguish "genuinely nothing open" from "every detail call failed".
  const loadFailed = activeAmbitions.length > 0 && details.length === 0;

  return (
    <section className="flex flex-col gap-6 duration-500 animate-in fade-in">
      {hadErrors && !loadFailed ? (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <InfoIcon className="size-3.5 shrink-0" />
          Some ambition details couldn&apos;t be loaded, so a few items may be missing.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
        <div className="flex flex-col gap-6">
          <ActionQueue items={queue} totalOpen={openItems.length} loadFailed={loadFailed} />
          <AttentionList flags={flags} />
        </div>
        <div className="flex flex-col gap-6">
          <DeadlinePressure buckets={buckets} />
          <WeeklyPreview groups={upcoming} />
        </div>
      </div>
    </section>
  );
}
