import "server-only";

import type { WeeklyReviewPayload, WeeklyReviewStatusPayload } from "@/types";

function authHeaders(sessionToken: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionToken}`,
  } as const;
}

async function fetchProJson<T>(sessionToken: string, path: string): Promise<T | null> {
  const response = await fetch(`${process.env.API_URL}${path}`, {
    method: "GET",
    headers: authHeaders(sessionToken),
    cache: "no-store",
  });

  if (response.status === 403) return null;
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export function getWeeklyReviewStatus(sessionToken: string) {
  return fetchProJson<WeeklyReviewStatusPayload>(sessionToken, "/loop/reviews/status");
}

export function fetchWeeklyReviewCurrent(sessionToken: string) {
  return fetchProJson<WeeklyReviewPayload>(sessionToken, "/loop/reviews/current");
}
