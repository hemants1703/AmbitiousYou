import type { Milestone } from "@ambitiousyou/shared/types";
import { cache } from "react";

export const getMilestones = cache(async (sessionToken: string, ambitionId: string): Promise<Milestone[]> => {
  const response = await fetch(`${process.env.API_URL}/milestones?ambitionId=${ambitionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const text = await response.text();
  if (!text.trim()) return [];
  return JSON.parse(text) as Milestone[];
});
