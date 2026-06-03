import * as React from "react";

/**
 * Reads a non-httpOnly "logged-in hint" cookie (set at login/signup, cleared at
 * logout) so client components can show an authenticated affordance — e.g. swap
 * "Log in"/"Sign up" for "Go to Dashboard" — WITHOUT making the page dynamic.
 *
 * The real `sessionToken` is httpOnly and unreadable here; this hint carries no
 * token, only presence. `getServerSnapshot` returns false so the static/SSR HTML
 * and the first client render both show the logged-out state (hydration-safe,
 * crawler-correct), then the store re-reads the cookie after mount. Built on
 * `useSyncExternalStore` (mirrors `use-mobile.ts`) to stay React-Compiler-safe —
 * no effect + setState.
 */

const HINT_COOKIE = "ay_auth";

function subscribe(onStoreChange: () => void): () => void {
  // Re-read when the tab regains focus / visibility, so logging in or out in
  // another tab is reflected here without a manual reload.
  window.addEventListener("focus", onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);
  return () => {
    window.removeEventListener("focus", onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

function getSnapshot(): boolean {
  // Match the cookie name at a boundary (split on "; ") so we never match a
  // substring of another cookie's name or value.
  return document.cookie.split("; ").some((entry) => entry.startsWith(`${HINT_COOKIE}=`));
}

function getServerSnapshot(): boolean {
  return false;
}

export function useAuthHint(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
