import type { AmbitionDetails } from "./get-ambition-details";
import { getTasks } from "@/lib/api/tasks/get-tasks";
import { getMilestones } from "@/lib/api/milestones/get-milestones";
import type { Ambition } from "@ambitiousyou/shared/types";

export interface ActiveAmbitionDetailsResult {
  details: AmbitionDetails[];
  /** True when at least one ambition's items failed to load (thrown/network error). */
  hadErrors: boolean;
}

/**
 * Fetches each supplied ambition's tracked items ("moves" — a mix of tasks and
 * milestones) in parallel and merges them onto the ambition.
 *
 * The `GET /ambitions/:id/details` endpoint does NOT return tasks/milestones, so we
 * read each ambition's collections from their dedicated list endpoints — the same
 * `getTasks`/`getMilestones` helpers the ambition-details page uses. Since an ambition
 * can now hold both kinds, we fetch BOTH. `Promise.allSettled` isolates failures per
 * ambition so one failing fetch drops only that ambition instead of crashing the
 * dashboard. (`getTasks`/`getMilestones` already return `[]` on a non-ok response, so
 * `hadErrors` reflects only thrown/network failures.)
 */
export async function getActiveAmbitionDetails(sessionToken: string, ambitions: Ambition[]): Promise<ActiveAmbitionDetailsResult> {
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
