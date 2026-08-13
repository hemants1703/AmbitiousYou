import { Settings } from "@ambitiousyou/shared";

import { getCachedUserSettings } from "@/lib/cache/session-data";

export async function getUserSettings(_sessionToken?: string): Promise<Settings | null> {
  return getCachedUserSettings();
}
