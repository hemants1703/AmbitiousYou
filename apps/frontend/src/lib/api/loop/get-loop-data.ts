import "server-only";

import type { AttentionCoachPayload, MissedDayPayload, WeeklyReviewPayload } from "@/types";
import { cache } from "react";

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

export const getWeeklyReview = cache((sessionToken: string) => fetchProJson<WeeklyReviewPayload>(sessionToken, "/loop/reviews/current"));
export const getAttentionCoach = cache((sessionToken: string) => fetchProJson<AttentionCoachPayload>(sessionToken, "/loop/attention"));
export const getMissedDay = cache((sessionToken: string) => fetchProJson<MissedDayPayload>(sessionToken, "/loop/missed-day"));
