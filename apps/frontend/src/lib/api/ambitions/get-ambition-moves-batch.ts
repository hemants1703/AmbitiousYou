import type { AmbitionMovesBatch } from "@ambitiousyou/shared/types";
import { cache } from "react";

/**
 * Batch-fetch tasks + milestones in one request. `openOnly` limits to incomplete moves on
 * active ambitions (dashboard Today/Weekly); default returns all moves (activity charts).
 */
export const getAmbitionMovesBatch = cache(async (sessionToken: string, openOnly: boolean): Promise<AmbitionMovesBatch> => {
  const query = openOnly ? "?openOnly=true" : "";
  const response = await fetch(`${process.env.API_URL}/ambitions/moves${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ambition moves: ${response.statusText}`);
  }

  return response.json() as Promise<AmbitionMovesBatch>;
});
