import * as React from "react";
import { useAuthHint } from "@/hooks/use-auth-hint";

/**
 * Validity-aware variant of `useAuthHint`. Keeps the optimistic, hydration-safe
 * hint (logged-out in SSR/static HTML, then the readable `ay_auth` cookie after
 * mount — no CLS, crawler-correct) but additionally confirms the session against
 * the backend via `GET /api/auth/status`. The dashboard affordance is only
 * downgraded to logged-out when validation explicitly fails, so a valid session
 * shows "Go to Dashboard" with no flash, while a stale hint (e.g. the session was
 * wiped server-side) silently reverts to Log in / Sign up — and the status route
 * clears the dead cookies on its way out, so the next load is correct with no
 * further network call.
 *
 * A validated answer is memoised in sessionStorage for a short TTL so we
 * don't hit the backend on every public navigation within a tab, and re-checked
 * when the tab regains focus so a logout/revocation elsewhere is reflected.
 */

const CACHE_KEY = "ay_auth_session";
const TTL_MS = 60_000;

type Cached = { valid: boolean; hasAmbitions: boolean | null; at: number };

export type AuthSession = {
  isLoggedIn: boolean;
  /** null while unknown or logged out */
  hasAmbitions: boolean | null;
};

function readCache(): Cached | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    if (Date.now() - parsed.at > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(valid: boolean, hasAmbitions: boolean | null): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ valid, hasAmbitions, at: Date.now() }));
  } catch {
    // sessionStorage unavailable (e.g. privacy mode) — caching is best-effort.
  }
}

function clearCache(): void {
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // no-op
  }
}

export function useAuthSession(): AuthSession {
  const hint = useAuthHint();
  const [validated, setValidated] = React.useState<boolean | null>(null);
  const [hasAmbitions, setHasAmbitions] = React.useState<boolean | null>(null);
  const [revalidateAt, setRevalidateAt] = React.useState(0);

  const cached = hint ? readCache() : null;

  // Re-validate when the tab becomes visible/focused so a session revoked or a
  // logout in another tab is reflected without a manual reload.
  React.useEffect(() => {
    function trigger() {
      if (document.visibilityState !== "visible") return;
      clearCache();
      setRevalidateAt((n) => n + 1);
    }
    window.addEventListener("focus", trigger);
    document.addEventListener("visibilitychange", trigger);
    return () => {
      window.removeEventListener("focus", trigger);
      document.removeEventListener("visibilitychange", trigger);
    };
  }, []);

  React.useEffect(() => {
    // Anonymous visitors: nothing to validate, and we never hit the backend.
    if (!hint) {
      clearCache();
      return;
    }

    // Fresh valid cache: the optimistic state already renders as logged-in, so
    // skip both the network call and any synchronous setState.
    if (cached?.valid === true) return;

    const controller = new AbortController();
    let ignore = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store", signal: controller.signal });
        if (!res.ok || ignore) return;
        const data = (await res.json()) as { authenticated: boolean; hasAmbitions?: boolean };
        if (ignore) return;
        setValidated(data.authenticated);
        setHasAmbitions(data.authenticated ? (data.hasAmbitions ?? false) : null);
        writeCache(data.authenticated, data.authenticated ? (data.hasAmbitions ?? false) : null);
      } catch {
        // Network/abort error: keep the optimistic state rather than falsely
        // logging the user out on a transient failure.
      }
    })();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [hint, revalidateAt, cached?.valid]);

  const isLoggedIn = hint && (cached?.valid === true || validated !== false);
  const resolvedHasAmbitions = isLoggedIn ? (cached?.valid === true ? cached.hasAmbitions : hasAmbitions) : null;

  return {
    isLoggedIn,
    hasAmbitions: resolvedHasAmbitions,
  };
}

/** @deprecated Prefer `useAuthSession` when ambition count affects routing. */
export function useAuthStatus(): boolean {
  return useAuthSession().isLoggedIn;
}
