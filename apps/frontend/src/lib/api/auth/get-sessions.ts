import type { Session } from "@ambitiousyou/shared";

import { getCachedSessions } from "@/lib/cache/session-data";

export async function getSessions(_sessionToken?: string): Promise<Session[] | null> {
  return getCachedSessions();
}
