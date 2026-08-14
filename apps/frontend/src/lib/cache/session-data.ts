import "server-only";

import type { AmbitionMovesBatch } from "@/types";
import type { Ambition, Session, Settings, User } from "@/types";
import type { AmbitionFull } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";

import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import type { NotificationsPayload } from "@/lib/api/notifications/get-notifications";

import {
  fetchAmbitionDetailsFromApi,
  fetchAmbitionFullFromApi,
  fetchAmbitionMovesBatchFromApi,
  fetchAmbitionsFromApi,
  fetchNotificationsFromApi,
  fetchSessionsFromApi,
  fetchUserFromApi,
  fetchUserSettingsFromApi,
} from "./fetch-session-data";

async function readSessionTokenOrRedirect(): Promise<string> {
  const sessionToken = (await cookies()).get("sessionToken")?.value;
  if (!sessionToken) redirect("/login");
  return sessionToken;
}

/**
 * Validated current user. `'use cache: private'` keeps the result in the browser
 * prefetch cache for soft navigations; tagged for mutation invalidation.
 */
export async function getCachedUser(): Promise<User> {
  "use cache: private";
  cacheLife("minutes");

  const sessionToken = await readSessionTokenOrRedirect();
  const user = await fetchUserFromApi(sessionToken);
  if (!user) redirect("/login");

  // Fetch settings to get week start/end days
  const settings = await fetchUserSettingsFromApi(sessionToken);
  const userWithSettings = {
    ...user,
    weekStartDay: settings?.weekStartDay ?? 0,
    weekEndDay: settings?.weekEndDay ?? 6,
  };

  cacheTag(`user:${user.id}`);
  return userWithSettings;
}

export async function getCachedUserSettings(): Promise<Settings | null> {
  "use cache: private";
  cacheLife("minutes");

  const user = await getCachedUser();
  cacheTag(`settings:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchUserSettingsFromApi(sessionToken);
}

export async function getCachedSessions(): Promise<Session[] | null> {
  "use cache: private";
  cacheLife("minutes");

  const user = await getCachedUser();
  cacheTag(`sessions:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchSessionsFromApi(sessionToken);
}

export async function getCachedAmbitions(): Promise<Ambition[] | null> {
  "use cache: private";
  cacheLife("minutes");

  const user = await getCachedUser();
  cacheTag(`ambitions:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchAmbitionsFromApi(sessionToken);
}

export async function getCachedAmbitionFull(ambitionId: string): Promise<AmbitionFull | null> {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`ambition:${ambitionId}`);

  const user = await getCachedUser();
  cacheTag(`ambitions:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchAmbitionFullFromApi(sessionToken, ambitionId);
}

export async function getCachedAmbitionDetails(ambitionId: string): Promise<AmbitionDetails | null> {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`ambition:${ambitionId}`);

  const user = await getCachedUser();
  cacheTag(`ambitions:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchAmbitionDetailsFromApi(sessionToken, ambitionId);
}

export async function getCachedAmbitionMovesBatch(openOnly: boolean): Promise<AmbitionMovesBatch> {
  "use cache: private";
  cacheLife("minutes");

  const user = await getCachedUser();
  cacheTag(`ambition-moves:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchAmbitionMovesBatchFromApi(sessionToken, openOnly);
}

export async function getCachedNotifications(limit = 30): Promise<NotificationsPayload | null> {
  "use cache: private";
  cacheLife("minutes");

  const user = await getCachedUser();
  cacheTag(`inbox:${user.id}`);

  const sessionToken = await readSessionTokenOrRedirect();
  return fetchNotificationsFromApi(sessionToken, limit);
}
