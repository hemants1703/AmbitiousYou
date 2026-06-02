import { EntityManager } from 'typeorm';
import { TaskEntity } from 'src/tasks/entities/task.entity';
import { MilestoneEntity } from 'src/milestones/entities/milestone.entity';
import { AmbitionEntity } from './entities/ambition.entity';

/**
 * Recompute and persist an ambition's completion percentage (and derived status)
 * from its tracked items. Runs inside the caller's transaction `manager`, so the
 * triggering task/milestone mutation and this ambition update commit atomically —
 * the ambition stays accurate without any extra request from the client.
 *
 * Bounded cost: one ambition load + at most two counts + one save.
 */
export async function recalculateAmbitionProgress(manager: EntityManager, params: { userId: string; ambitionId: string }): Promise<void> {
  const ambitionRepository = manager.getRepository(AmbitionEntity);
  const ambition = await ambitionRepository.findOne({ where: { id: params.ambitionId, userId: params.userId } });
  if (!ambition) {
    return;
  }

  let total: number;
  let completed: number;

  if (ambition.ambitionTrackingMethod === 'task') {
    const taskRepository = manager.getRepository(TaskEntity);
    total = await taskRepository.count({ where: { ambitionId: params.ambitionId, userId: params.userId } });
    completed = await taskRepository.count({ where: { ambitionId: params.ambitionId, userId: params.userId, taskCompleted: true } });
  } else {
    const milestoneRepository = manager.getRepository(MilestoneEntity);
    total = await milestoneRepository.count({ where: { ambitionId: params.ambitionId, userId: params.userId } });
    completed = await milestoneRepository.count({ where: { ambitionId: params.ambitionId, userId: params.userId, milestoneCompleted: true } });
  }

  ambition.ambitionPercentageCompleted = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (ambition.ambitionPercentageCompleted === 100) {
    ambition.ambitionStatus = 'completed';
    // Stamp the completion date only on the transition into completed.
    if (!ambition.ambitionCompletionDate) {
      ambition.ambitionCompletionDate = new Date();
    }
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(ambition.ambitionEndDate);
    endDate.setHours(0, 0, 0, 0);

    ambition.ambitionStatus = endDate.getTime() < today.getTime() ? 'missed' : 'active';
    ambition.ambitionCompletionDate = null;
  }

  ambition.updatedAt = new Date();
  await ambitionRepository.save(ambition);
}
