import type { AmbitionDetails } from "./get-ambition-details";
import { getTasks } from "@/lib/api/tasks/get-tasks";
import { getMilestones } from "@/lib/api/milestones/get-milestones";
import type { Ambition } from "@ambitiousyou/shared/types";

export interface AllAmbitionMovesResult {
  details: AmbitionDetails[];
  /** True when at least one ambition's moves failed to load (thrown/network error). */
  hadErrors: boolean;
}

/**
 * Fetches the tracked moves (tasks + milestones) for EVERY supplied ambition — regardless of status
 * (active, completed, missed) — in parallel and merges them onto each ambition. Unlike
 * {@link getActiveAmbitionDetails} (which the dashboard insights feed with active-only ambitions), the
 * movement chart needs completed moves from completed/missed ambitions too, so the caller passes the
 * full list. This is heavier (N×2 requests) — keep it behind its own Suspense boundary.
 * `Promise.allSettled` isolates per-ambition failures; `getTasks`/`getMilestones` already return `[]`
 * on a non-ok response, so `hadErrors` reflects only thrown/network failures.
 */
export async function getAllAmbitionMoves(sessionToken: string, ambitions: Ambition[]): Promise<AllAmbitionMovesResult> {
  const settled = await Promise.allSettled(
    ambitions.map(async (ambition): Promise<AmbitionDetails> => {
      const [tasks, milestones] = await Promise.all([getTasks(sessionToken, ambition.id), getMilestones(sessionToken, ambition.id)]);
      return { ...ambition, tasks, milestones };
    }),
  );

  const details: AmbitionDetails[] = [];
  let hadErrors = false;

  for (const result of settled) {
    if (result.status === "fulfilled") {
      details.push(result.value);
    } else {
      hadErrors = true;
    }
  }

  return { details, hadErrors };
}
