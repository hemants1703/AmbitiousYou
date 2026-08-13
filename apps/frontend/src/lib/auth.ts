import { fetchUserFromApi } from "@/lib/cache/fetch-session-data";
import type { User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

/** Per-request dedup only — not a cross-navigation cache. */
const fetchValidatedUser = cache(fetchUserFromApi);

/**
 * Reads the raw session token from cookies, redirecting to /login when it is
 * absent.
 *
 * IMPORTANT: presence of a cookie is NOT authentication — the value is never
 * validated here, so a forged cookie passes this check. Only use this to obtain
 * the token for a backend request that itself enforces auth (e.g. server
 * actions hitting a SessionGuard-protected endpoint, where a bogus token is
 * rejected with a 401). To gate a protected page render, use `requireUser()`,
 * which mandatorily validates against the backend.
 */
export async function getSessionToken(): Promise<string> {
  const cookie = (await cookies()).get("sessionToken");

  if (!cookie) redirect("/login");
  if (!cookie.value) redirect("/login");

  return cookie.value;
}

/**
 * The mandatory server-side auth gate for protected routes. Reads the opaque
 * session token and ALWAYS validates it against the backend before granting
 * access — a present-but-forged or expired cookie is rejected and redirected to
 * /login. Returns the authenticated user together with the validated token so
 * callers can fetch further data without a second cookie read.
 *
 * Validation is intentionally uncached so revoked or expired sessions are
 * rejected on every full page render. Display-only reads (nav, inbox) use
 * `getCachedUser()` separately.
 */
export async function requireUser(): Promise<{ user: User; sessionToken: string }> {
  const sessionToken = (await cookies()).get("sessionToken")?.value;
  if (!sessionToken) redirect("/login");

  const user = await fetchValidatedUser(sessionToken);
  if (!user) redirect("/login");

  return { user, sessionToken };
}

/**
 * Guards the public auth pages (login/signup). If the visitor already has a
 * valid session, sends them straight to the dashboard. A missing, expired, or
 * otherwise invalid token falls through so the auth page renders normally —
 * we verify against the backend rather than trusting the cookie's presence to
 * avoid bouncing a stale cookie back and forth between /login and /dashboard.
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const token = (await cookies()).get("sessionToken")?.value;
  if (!token) return;

  const user = await fetchUserFromApi(token);
  if (user) redirect("/dashboard");
}
