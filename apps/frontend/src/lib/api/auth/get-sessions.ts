import type { Session } from "@/types";

import { getCachedSessions } from "@/lib/cache/session-data";

export async function getSessions(sessionToken: string): Promise<Session[] | null> {
  return getCachedSessions(sessionToken);
}
