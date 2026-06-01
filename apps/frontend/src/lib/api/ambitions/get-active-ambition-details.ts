import { getAmbitionDetails, type AmbitionDetails } from "./get-ambition-details";
import type { Ambition } from "@ambitiousyou/shared/types";

export interface ActiveAmbitionDetailsResult {
  details: AmbitionDetails[];
  /** True when at least one ambition's details failed to load. */
  hadErrors: boolean;
}

/**
 * Fetches details for the supplied ambitions in parallel.
 *
 * `getAmbitionDetails` throws on a non-ok response, so we use Promise.allSettled
 * to isolate failures per ambition: one ambition failing to load drops only that
 * ambition from the aggregation instead of crashing the whole dashboard. The
 * underlying fetches are React-cached per (token, id), so this dedupes naturally.
 */
export async function getActiveAmbitionDetails(sessionToken: string, ambitions: Ambition[]): Promise<ActiveAmbitionDetailsResult> {
  const settled = await Promise.allSettled(ambitions.map((ambition) => getAmbitionDetails(sessionToken, ambition.id)));

  const details: AmbitionDetails[] = [];
  let hadErrors = false;

  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      details.push(result.value);
    } else {
      hadErrors = true;
    }
  }

  return { details, hadErrors };
}
