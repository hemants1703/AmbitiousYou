import { Ambition, Milestone, Note, Task } from "@/types";

import { getCachedAmbitionDetails } from "@/lib/cache/session-data";

export type AmbitionDetails = Ambition & {
  tasks?: Task[];
  milestones?: Milestone[];
  notes?: Note[];
};

export async function getAmbitionDetails(_sessionToken: string, ambitionId: string): Promise<AmbitionDetails | null> {
  return getCachedAmbitionDetails(ambitionId);
}
