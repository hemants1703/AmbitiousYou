import type { Session } from "@/types";

import { getCachedSessions } from "@/lib/cache/session-data";

export async function getSessions(_sessionToken?: string): Promise<Session[] | null> {
  return getCachedSessions();
}
