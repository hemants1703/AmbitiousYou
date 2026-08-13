import type { AmbitionFull } from "@ambitiousyou/shared/types";

import { getCachedAmbitionFull } from "@/lib/cache/session-data";

export async function getAmbitionFull(_sessionToken: string, ambitionId: string): Promise<AmbitionFull | null> {
  return getCachedAmbitionFull(ambitionId);
}
