import { Prisma } from '@prisma/client';

/**
 * Recompute and persist an ambition's completion percentage (and derived status)
 * from its tracked items. Runs inside the caller's transaction `tx`, so the
 * triggering task/milestone mutation and this ambition update commit atomically —
 * the ambition stays accurate without any extra request from the client.
 *
 * Bounded cost: one ambition load + at most two counts + one update.
 */
export async function recalculateAmbitionProgress(tx: Prisma.TransactionClient, params: { userId: string; ambitionId: string }): Promise<void> {
  const ambition = await tx.ambition.findFirst({ where: { id: params.ambitionId, userId: params.userId } });
  if (!ambition) {
    return;
  }

  let total: number;
  let completed: number;

  if (ambition.ambitionTrackingMethod === 'task') {
    total = await tx.task.count({ where: { ambitionId: params.ambitionId, userId: params.userId } });
    completed = await tx.task.count({ where: { ambitionId: params.ambitionId, userId: params.userId, taskCompleted: true } });
  } else {
    total = await tx.milestone.count({ where: { ambitionId: params.ambitionId, userId: params.userId } });
    completed = await tx.milestone.count({ where: { ambitionId: params.ambitionId, userId: params.userId, milestoneCompleted: true } });
  }

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

  await tx.ambition.update({
    where: { id: ambition.id },
    data: { ambitionPercentageCompleted, ambitionStatus, ambitionCompletionDate },
  });
}
