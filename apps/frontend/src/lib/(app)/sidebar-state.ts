export const SIDEBAR_STORAGE_KEY = "sidebar_state";

const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function parseSidebarOpen(value: string | undefined | null, fallback = true): boolean {
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

/** Persist desktop sidebar open/collapsed for the next visit (localStorage + cookie for SSR). */
export function persistSidebarOpen(open: boolean) {
  if (typeof window === "undefined") return;

  const value = String(open);
  window.localStorage.setItem(SIDEBAR_STORAGE_KEY, value);
  document.cookie = `${SIDEBAR_STORAGE_KEY}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
}
