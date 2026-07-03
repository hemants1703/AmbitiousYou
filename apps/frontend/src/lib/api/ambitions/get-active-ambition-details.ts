import type { Ambition, Milestone, Task } from "@ambitiousyou/shared/types";
import type { AmbitionDetails } from "./get-ambition-details";
import { getAmbitionMovesBatch } from "./get-ambition-moves-batch";

export interface ActiveAmbitionDetailsResult {
  details: AmbitionDetails[];
  hadErrors: boolean;
}

function mergeMovesOntoAmbitions(ambitions: Ambition[], tasks: Task[], milestones: Milestone[]): AmbitionDetails[] {
  const tasksByAmbition = new Map<string, Task[]>();
  const milestonesByAmbition = new Map<string, Milestone[]>();

  for (const task of tasks) {
    const list = tasksByAmbition.get(task.ambitionId) ?? [];
    list.push(task);
    tasksByAmbition.set(task.ambitionId, list);
  }

  for (const milestone of milestones) {
    const list = milestonesByAmbition.get(milestone.ambitionId) ?? [];
    list.push(milestone);
    milestonesByAmbition.set(milestone.ambitionId, list);
  }

  return ambitions.map((ambition) => ({
    ...ambition,
    tasks: tasksByAmbition.get(ambition.id) ?? [],
    milestones: milestonesByAmbition.get(ambition.id) ?? [],
  }));
}

/**
 * Open moves for active ambitions via a single batch API call (replaces N×2 fetches).
 */
export async function getActiveAmbitionDetails(sessionToken: string, ambitions: Ambition[]): Promise<ActiveAmbitionDetailsResult> {
  if (ambitions.length === 0) {
    return { details: [], hadErrors: false };
  }

  try {
    const { tasks, milestones } = await getAmbitionMovesBatch(sessionToken, true);
    return { details: mergeMovesOntoAmbitions(ambitions, tasks, milestones), hadErrors: false };
  } catch {
    return { details: [], hadErrors: true };
  }
}
