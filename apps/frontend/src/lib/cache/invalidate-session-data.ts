import "server-only";

import { updateTag } from "next/cache";

export function invalidateUserCache(userId: string) {
  updateTag(`user:${userId}`);
}

export function invalidateSettingsCache(userId: string) {
  updateTag(`settings:${userId}`);
}

export function invalidateSessionsCache(userId: string) {
  updateTag(`sessions:${userId}`);
}

export function invalidateAmbitionsListCache(userId: string) {
  updateTag(`ambitions:${userId}`);
}

export function invalidateAmbitionDetailCache(ambitionId: string) {
  updateTag(`ambition:${ambitionId}`);
}

export function invalidateAmbitionMovesCache(userId: string) {
  updateTag(`ambition-moves:${userId}`);
}

export function invalidateInboxCache(userId: string) {
  updateTag(`inbox:${userId}`);
}

/** Clears all user-scoped private caches (logout, account switch). */
export function invalidateAllSessionCaches(userId: string) {
  invalidateUserCache(userId);
  invalidateSettingsCache(userId);
  invalidateSessionsCache(userId);
  invalidateAmbitionsListCache(userId);
  invalidateAmbitionMovesCache(userId);
  invalidateInboxCache(userId);
}

/** After an ambition mutation that may touch list, detail, dashboard moves, or inbox. */
export function invalidateAmbitionCaches(userId: string, ambitionId: string) {
  invalidateAmbitionDetailCache(ambitionId);
  invalidateAmbitionsListCache(userId);
  invalidateAmbitionMovesCache(userId);
  invalidateInboxCache(userId);
}
