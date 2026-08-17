import type { WeeklyReviewPayload } from "@/types";
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

export const getWeeklyReviewStatus = cache((sessionToken: string) =>
  fetchProJson<WeeklyReviewPayload>(sessionToken, "/loop/reviews/status")
);