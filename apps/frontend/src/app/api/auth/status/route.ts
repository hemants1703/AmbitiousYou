import { cookies } from "next/headers";
import { getAmbitions } from "@/lib/api/ambitions/get-ambitions";
import { getUser } from "@/lib/api/sidebar/get-user";

/**
 * Validates the httpOnly session against the backend so the public, statically
 * rendered pages can confirm a logged-in affordance instead of trusting the
 * readable `ay_auth` hint cookie (presence != validity). When the backend
 * rejects the token (expired/revoked, e.g. the session row is gone) this also
 * self-heals by clearing the stale `sessionToken` + `ay_auth` cookies so the
 * hint stops lying on subsequent loads.
 *
 * Must stay dynamic and uncached — it reads cookies and reflects live state.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET() {
  const store = await cookies();
  const sessionToken = store.get("sessionToken")?.value;

  if (!sessionToken) {
    return Response.json({ authenticated: false }, { headers: NO_STORE });
  }

  const user = await getUser(sessionToken);

  if (!user) {
    store.delete("sessionToken");
    store.delete("ay_auth");
    return Response.json({ authenticated: false }, { headers: NO_STORE });
  }

  const ambitions = await getAmbitions(sessionToken);
  const hasAmbitions = Array.isArray(ambitions) && ambitions.length > 0;

  return Response.json({ authenticated: true, hasAmbitions }, { headers: NO_STORE });
}
