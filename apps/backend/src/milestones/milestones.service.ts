import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { recalculateAmbitionProgress } from 'src/ambitions/ambition-progress.util';
import { db, ambitions, milestones, type Milestone } from 'src/db';

@Injectable()
export class MilestonesService {
  async createMilestone(userId: string, createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    return await db.transaction(async (tx) => {
      const [ambition] = await tx
        .select({ id: ambitions.id })
        .from(ambitions)
        .where(and(eq(ambitions.id, createMilestoneDto.ambitionId), eq(ambitions.userId, userId)))
        .limit(1);
      if (!ambition) {
        throw new NotFoundException('Ambition not found');
      }

      const [saved] = await tx
        .insert(milestones)
        .values({ userId, ...createMilestoneDto })
        .returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId: createMilestoneDto.ambitionId });
      return saved;
    });
  }

  async findAllMilestonesForAmbitionId(userId: string, ambitionId: string): Promise<Milestone[]> {
    return await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.ambitionId, ambitionId), eq(milestones.userId, userId)))
      .orderBy(desc(milestones.createdAt));
  }

  async findOneMilestoneById(userId: string, milestoneId: string): Promise<Milestone | null> {
    const [milestone] = await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
      .limit(1);
    return milestone ?? null;
  }

  async updateMilestoneById(userId: string, milestoneId: string, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone> {
    return await db.transaction(async (tx) => {
      const [milestone] = await tx
        .select()
        .from(milestones)
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .limit(1);
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      // Stamp the completion time when an edit first marks the milestone reached; never clear it (one-way).
      const milestoneCompletedAt = updateMilestoneDto.milestoneCompleted && !milestone.milestoneCompletedAt ? new Date() : undefined;

      const [saved] = await tx
        .update(milestones)
        .set({
          milestone: updateMilestoneDto.milestone,
          milestoneDescription: updateMilestoneDto.milestoneDescription,
          milestoneCompleted: updateMilestoneDto.milestoneCompleted,
          milestoneCompletedAt,
          milestoneTargetDate: updateMilestoneDto.milestoneTargetDate,
        })
        .where(eq(milestones.id, milestone.id))
        .returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId: milestone.ambitionId });
      return saved;
    });
  }

  async toggleMilestoneCompletionStatus(userId: string, milestoneId: string): Promise<Milestone> {
    return await db.transaction(async (tx) => {
      const [milestone] = await tx
        .select()
        .from(milestones)
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .limit(1);
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      // Milestones are one-way: reaching one is a permanent achievement and cannot be reopened.
      if (milestone.milestoneCompleted) {
        throw new BadRequestException('Milestones cannot be reopened once completed');
      }

      const [saved] = await tx
        .update(milestones)
        .set({ milestoneCompleted: true, milestoneCompletedAt: new Date() })
        .where(eq(milestones.id, milestone.id))
        .returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId: milestone.ambitionId });
      return saved;
    });
  }

  async removeMilestoneById(userId: string, milestoneId: string): Promise<Milestone> {
    return await db.transaction(async (tx) => {
      const [milestone] = await tx
        .select()
        .from(milestones)
        .where(and(eq(milestones.id, milestoneId), eq(milestones.userId, userId)))
        .limit(1);
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      const ambitionId = milestone.ambitionId;
      const [removed] = await tx.delete(milestones).where(eq(milestones.id, milestone.id)).returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId });
      return removed;
    });
  }
}
