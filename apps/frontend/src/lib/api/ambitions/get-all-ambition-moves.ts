import type { Ambition, Milestone, Task } from "@ambitiousyou/shared/types";
import type { AmbitionDetails } from "./get-ambition-details";
import { getAmbitionMovesBatch } from "./get-ambition-moves-batch";

export interface AllAmbitionMovesResult {
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
 * All moves for every ambition via one batch API call (replaces N×2 fetches).
 */
export async function getAllAmbitionMoves(sessionToken: string, ambitions: Ambition[]): Promise<AllAmbitionMovesResult> {
  if (ambitions.length === 0) {
    return { details: [], hadErrors: false };
  }

  try {
    const { tasks, milestones } = await getAmbitionMovesBatch(sessionToken, false);
    return { details: mergeMovesOntoAmbitions(ambitions, tasks, milestones), hadErrors: false };
  } catch {
    return { details: [], hadErrors: true };
  }
}
