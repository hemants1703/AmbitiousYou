import "server-only";

import type { AmbitionMovesBatch } from "@/types";
import type { Ambition, Session, Settings, User } from "@/types";
import type { AmbitionFull } from "@/types";
import { redirect } from "next/navigation";

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

/**
 * Validated current user. Requires sessionToken from caller.
 * Keeps the result tagged for mutation invalidation.
 */
export async function getCachedUser(sessionToken: string): Promise<User> {
  const user = await fetchUserFromApi(sessionToken);
  if (!user) redirect("/login");

  // Fetch settings to get week start/end days
  const settings = await fetchUserSettingsFromApi(sessionToken);
  const userWithSettings = {
    ...user,
    weekStartDay: settings?.weekStartDay ?? 0,
    weekEndDay: settings?.weekEndDay ?? 6,
  };

  return userWithSettings;
}

export async function getCachedUserSettings(sessionToken: string): Promise<Settings | null> {
  return fetchUserSettingsFromApi(sessionToken);
}

export async function getCachedSessions(sessionToken: string): Promise<Session[] | null> {
  return fetchSessionsFromApi(sessionToken);
}

export async function getCachedAmbitions(sessionToken: string): Promise<Ambition[] | null> {
  return fetchAmbitionsFromApi(sessionToken);
}

export async function getCachedAmbitionFull(sessionToken: string, ambitionId: string): Promise<AmbitionFull | null> {
  return fetchAmbitionFullFromApi(sessionToken, ambitionId);
}

export async function getCachedAmbitionDetails(ambitionId: string, sessionToken: string): Promise<AmbitionDetails | null> {
  return fetchAmbitionDetailsFromApi(sessionToken, ambitionId);
}

export async function getCachedAmbitionMovesBatch(sessionToken: string, openOnly: boolean): Promise<AmbitionMovesBatch> {
  return fetchAmbitionMovesBatchFromApi(sessionToken, openOnly);
}

export async function getCachedNotifications(sessionToken: string, limit = 30): Promise<NotificationsPayload | null> {
  return fetchNotificationsFromApi(sessionToken, limit);
}
