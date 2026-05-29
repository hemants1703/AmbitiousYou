import { Ambition, Milestone, Note, Task } from "@ambitiousyou/shared/types";
import { cache } from "react";

export type AmbitionDetails = Ambition & {
  tasks?: Task[];
  milestones?: Milestone[];
  notes?: Note[];
};

export const getAmbitionDetails = cache(async (sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> => {
  const response = await fetch(`${process.env.API_URL}/ambitions/${ambitionId}/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ambition details: ${response.statusText}`);
  }

  return response.json() as Promise<AmbitionDetails | null>;
});
