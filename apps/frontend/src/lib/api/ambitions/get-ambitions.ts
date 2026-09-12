import { Ambition } from "@/types";

import { getCachedAmbitions } from "@/lib/cache/session-data";

export async function getAmbitions(sessionToken: string): Promise<Ambition[] | null> {
  return getCachedAmbitions(sessionToken);
}
