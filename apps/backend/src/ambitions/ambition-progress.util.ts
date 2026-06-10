import { and, eq, sql } from 'drizzle-orm';
import type { Tx } from 'src/db';
import { ambitions, milestones, tasks } from 'src/db';

/**
 * Recompute and persist an ambition's completion percentage (and derived status)
 * from its tracked items ("moves" — a mixture of tasks and milestones). Runs inside
 * the caller's transaction `tx`, so the triggering task/milestone mutation and this
 * ambition update commit atomically — the ambition stays accurate without any extra
 * request from the client.
 *
 * Bounded cost: one ambition load + exactly two counts (tasks + milestones) + one update.
 */
export async function recalculateAmbitionProgress(tx: Tx, params: { userId: string; ambitionId: string }): Promise<void> {
  const [ambition] = await tx
    .select()
    .from(ambitions)
    .where(and(eq(ambitions.id, params.ambitionId), eq(ambitions.userId, params.userId)))
    .limit(1);
  if (!ambition) {
    return;
  }

  // Progress aggregates BOTH kinds of move: completed tasks + reached milestones over the total of each.
  const [taskAgg] = await tx
    .select({
      total: sql<number>`count(*)::int`,
      completed: sql<number>`count(*) filter (where ${tasks.taskCompleted})::int`,
    })
    .from(tasks)
    .where(and(eq(tasks.ambitionId, params.ambitionId), eq(tasks.userId, params.userId)));

  const [milestoneAgg] = await tx
    .select({
      total: sql<number>`count(*)::int`,
      completed: sql<number>`count(*) filter (where ${milestones.milestoneCompleted})::int`,
    })
    .from(milestones)
    .where(and(eq(milestones.ambitionId, params.ambitionId), eq(milestones.userId, params.userId)));

  const total = taskAgg.total + milestoneAgg.total;
  const completed = taskAgg.completed + milestoneAgg.completed;

  const ambitionPercentageCompleted = total === 0 ? 0 : Math.round((completed / total) * 100);

  let ambitionStatus: 'active' | 'completed' | 'missed';
  let ambitionCompletionDate: Date | null;

  if (ambitionPercentageCompleted === 100) {
    ambitionStatus = 'completed';
    // Stamp the completion date only on the transition into completed.
    ambitionCompletionDate = ambition.ambitionCompletionDate ?? new Date();
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(ambition.ambitionEndDate);
    endDate.setHours(0, 0, 0, 0);

    ambitionStatus = endDate.getTime() < today.getTime() ? 'missed' : 'active';
    ambitionCompletionDate = null;
  }

  await tx.update(ambitions).set({ ambitionPercentageCompleted, ambitionStatus, ambitionCompletionDate }).where(eq(ambitions.id, ambition.id));
}
