import type { AmbitionFull } from "@ambitiousyou/shared/types";
import { cache } from "react";

export const getAmbitionFull = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionFull | null> => {
  const response = await fetch(`${process.env.API_URL}/ambitions/${ambitionId}/full`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch ambition: ${response.statusText}`);
  }

  return response.json() as Promise<AmbitionFull | null>;
});
