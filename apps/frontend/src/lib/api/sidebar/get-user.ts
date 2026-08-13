import { User } from "@/types";
import { cache } from "react";

import { fetchUserFromApi } from "@/lib/cache/fetch-session-data";

/** Uncached per-request dedup — for auth probes that must not reuse browser cache. */
export const getUser = cache(async (sessionToken: string): Promise<User | null> => {
  return fetchUserFromApi(sessionToken);
});
