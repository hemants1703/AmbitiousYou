import { Settings } from "@/types";

import { getCachedUserSettings } from "@/lib/cache/session-data";

export async function getUserSettings(sessionToken: string): Promise<Settings | null> {
  return getCachedUserSettings(sessionToken);
}
