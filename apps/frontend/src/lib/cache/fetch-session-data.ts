import "server-only";

import type { AmbitionMovesBatch } from "@/types";
import type { Ambition, Notification, Session, Settings, User } from "@/types";
import type { AmbitionFull } from "@/types";

import type { AmbitionDetails } from "@/lib/api/ambitions/get-ambition-details";
import type { NotificationsPayload } from "@/lib/api/notifications/get-notifications";

function authHeaders(sessionToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionToken}`,
  } as const;
}

export async function fetchUserFromApi(sessionToken: string): Promise<User | null> {
  const response = await fetch(`${process.env.API_URL}/users`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) return null;
  return (await response.json()) as User;
}

export async function fetchUserSettingsFromApi(sessionToken: string): Promise<Settings | null> {
  const response = await fetch(`${process.env.API_URL}/settings`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) return null;
  return (await response.json()) as Settings;
}

export async function fetchSessionsFromApi(sessionToken: string): Promise<Session[] | null> {
  const response = await fetch(`${process.env.API_URL}/auth/sessions`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) return null;
  return (await response.json()) as Session[];
}

export async function fetchAmbitionsFromApi(sessionToken: string): Promise<Ambition[] | null> {
  const response = await fetch(`${process.env.API_URL}/ambitions`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) return null;

  const responseText = await response.text();
  if (!responseText.trim()) return null;

  return JSON.parse(responseText) as Ambition[];
}

export async function fetchAmbitionFullFromApi(
  sessionToken: string,
  ambitionId: string,
): Promise<AmbitionFull | null> {
  const response = await fetch(`${process.env.API_URL}/ambitions/${ambitionId}/full`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch ambition: ${response.statusText}`);
  }

  return response.json() as Promise<AmbitionFull | null>;
}

export async function fetchAmbitionDetailsFromApi(
  sessionToken: string,
  ambitionId: string,
): Promise<AmbitionDetails | null> {
  const response = await fetch(`${process.env.API_URL}/ambitions/${ambitionId}/details`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch ambition details: ${response.statusText}`);
  }

  return response.json() as Promise<AmbitionDetails | null>;
}

export async function fetchAmbitionMovesBatchFromApi(
  sessionToken: string,
  openOnly: boolean,
): Promise<AmbitionMovesBatch> {
  const query = openOnly ? "?openOnly=true" : "";
  const response = await fetch(`${process.env.API_URL}/ambitions/moves${query}`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ambition moves: ${response.statusText}`);
  }

  return response.json() as Promise<AmbitionMovesBatch>;
}

export async function fetchNotificationsFromApi(
  sessionToken: string,
  limit: number,
): Promise<NotificationsPayload | null> {
  const response = await fetch(`${process.env.API_URL}/notifications?limit=${limit}`, {
    method: "GET",
    headers: authHeaders(sessionToken),
  });

  if (!response.ok) return null;
  return (await response.json()) as NotificationsPayload;
}

export type { Notification };
