import { Ambition } from "@/types";

import { getCachedAmbitions } from "@/lib/cache/session-data";

export async function getAmbitions(_sessionToken?: string): Promise<Ambition[] | null> {
  return getCachedAmbitions();
}
