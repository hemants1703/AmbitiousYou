import type { AmbitionMovesBatch } from "@/types";

import { getCachedAmbitionMovesBatch } from "@/lib/cache/session-data";

/**
 * Batch-fetch tasks + milestones in one request. `openOnly` limits to incomplete moves on
 * active ambitions (dashboard Today/Weekly); default returns all moves (activity charts).
 */
export async function getAmbitionMovesBatch(sessionToken: string, openOnly: boolean): Promise<AmbitionMovesBatch> {
  return getCachedAmbitionMovesBatch(sessionToken, openOnly);
}
