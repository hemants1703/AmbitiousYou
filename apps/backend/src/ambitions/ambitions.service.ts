import { BadRequestException, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { markOverdueAmbitionsMissed, startOfDay, syncAmbitionMissedStatus } from './ambition-status.util';
import { db, ambitions, milestones, notes, tasks, type Ambition, type AmbitionEndDateChange } from '../db';
import type { AmbitionFull, AmbitionMovesBatch } from '@ambitiousyou/shared/types';

function toIsoDate(value: Date): string {
  return new Date(value).toISOString();
}

@Injectable()
export class AmbitionsService {
  async createAmbition(userId: string, createAmbitionDto: CreateAmbitionWithItemsDto): Promise<Ambition> {
    return await db.transaction(async (tx) => {
      const { tasks: tasksDto, milestones: milestonesDto, ...ambitionData } = createAmbitionDto;

      const [ambition] = await tx
        .insert(ambitions)
        .values({ ...ambitionData, userId })
        .returning();

      // Tasks and milestones are both optional ("moves" can be any mix); the AtLeastOneMove
      // DTO constraint guarantees at least one across both. Insert whichever are present.
      if (tasksDto?.length) {
        await tx.insert(tasks).values(tasksDto.map((task) => ({ ...task, userId, ambitionId: ambition.id })));
      }

      if (milestonesDto?.length) {
        await tx.insert(milestones).values(milestonesDto.map((milestone) => ({ ...milestone, userId, ambitionId: ambition.id })));
      }

      return ambition;
    });
  }

  async findAllAmbitionsByUserId(userId: string): Promise<Ambition[] | null> {
    // Keep list filters / ReviveMissed accurate without waiting for the hourly cron.
    await markOverdueAmbitionsMissed({ userId });
    const rows = await db.select().from(ambitions).where(eq(ambitions.userId, userId)).orderBy(desc(ambitions.createdAt));
    return rows.length ? rows : null;
  }

  async findAmbitionDetailsByUserIdAndId(userId: string, ambitionId: string): Promise<Ambition | null> {
    const [ambition] = await db
      .select()
      .from(ambitions)
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
      .limit(1);
    if (!ambition) {
      return null;
    }
    return await syncAmbitionMissedStatus(ambition);
  }

  async findOneAmbitionById(userId: string, ambitionId: string): Promise<Ambition | null> {
    const [ambition] = await db
      .select()
      .from(ambitions)
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
      .limit(1);
    return ambition ?? null;
  }

  async updateAmbitionById(userId: string, ambitionId: string, updateAmbitionDto: UpdateAmbitionDto): Promise<Ambition> {
    const ambition = await this.findOneAmbitionById(userId, ambitionId);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${ambitionId} not found`);
    }

    // Start date is immutable after creation; only the end date may move, and only forward.
    const nextEndDay = startOfDay(updateAmbitionDto.ambitionEndDate);
    const currentEndDay = startOfDay(ambition.ambitionEndDate);
    const startDay = startOfDay(ambition.ambitionStartDate);

    if (nextEndDay.getTime() < currentEndDay.getTime()) {
      throw new BadRequestException('ambitionEndDate can only be moved later, never earlier');
    }

    if (nextEndDay.getTime() < startDay.getTime()) {
      throw new BadRequestException('ambitionEndDate must be on or after ambitionStartDate');
    }

    const endDateExtended = nextEndDay.getTime() > currentEndDay.getTime();

    // Extending a missed window past today reopens the ambition as active.
    let ambitionStatus = ambition.ambitionStatus;
    if (ambitionStatus !== 'completed') {
      const today = startOfDay(new Date());
      ambitionStatus = nextEndDay.getTime() < today.getTime() ? 'missed' : 'active';
    }

    const history = ambition.ambitionEndDateHistory ?? [];
    const ambitionEndDateHistory: AmbitionEndDateChange[] = endDateExtended
      ? [
          ...history,
          {
            previousEndDate: toIsoDate(ambition.ambitionEndDate),
            newEndDate: toIsoDate(updateAmbitionDto.ambitionEndDate),
            changedAt: new Date().toISOString(),
          },
        ]
      : history;

    const [updated] = await db
      .update(ambitions)
      .set({
        ambitionName: updateAmbitionDto.ambitionName,
        ambitionDefinition: updateAmbitionDto.ambitionDefinition,
        ambitionMotivation: updateAmbitionDto.ambitionMotivation,
        ambitionPriority: updateAmbitionDto.ambitionPriority,
        isFavourited: updateAmbitionDto.isFavourited,
        ambitionEndDate: updateAmbitionDto.ambitionEndDate,
        ambitionEndDateHistory,
        ambitionStatus,
      })
      .where(eq(ambitions.id, ambition.id))
      .returning();
    return updated;
  }

  async removeAmbitionById(userId: string, id: string): Promise<Ambition> {
    const ambition = await this.findOneAmbitionById(userId, id);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${id} not found`);
    }

    const [deleted] = await db.delete(ambitions).where(eq(ambitions.id, ambition.id)).returning();
    return deleted;
  }

  /**
   * All tasks + milestones for the user in two queries. When `openOnly` is true, returns only
   * incomplete moves on active ambitions (dashboard Today/Weekly). Otherwise returns every move
   * (dashboard activity charts).
   */
  async findMovesBatch(userId: string, openOnly: boolean): Promise<AmbitionMovesBatch> {
    if (openOnly) {
      await markOverdueAmbitionsMissed({ userId });
      const [taskRows, milestoneRows] = await Promise.all([
        db
          .select({ task: tasks })
          .from(tasks)
          .innerJoin(ambitions, eq(tasks.ambitionId, ambitions.id))
          .where(and(eq(tasks.userId, userId), eq(tasks.taskCompleted, false), eq(ambitions.ambitionStatus, 'active'))),
        db
          .select({ milestone: milestones })
          .from(milestones)
          .innerJoin(ambitions, eq(milestones.ambitionId, ambitions.id))
          .where(and(eq(milestones.userId, userId), eq(milestones.milestoneCompleted, false), eq(ambitions.ambitionStatus, 'active'))),
      ]);

      return {
        tasks: taskRows.map((row) => row.task),
        milestones: milestoneRows.map((row) => row.milestone),
      };
    }

    const [taskRows, milestoneRows] = await Promise.all([db.select().from(tasks).where(eq(tasks.userId, userId)), db.select().from(milestones).where(eq(milestones.userId, userId))]);

    return { tasks: taskRows, milestones: milestoneRows };
  }

  async findAmbitionFullByUserIdAndId(userId: string, ambitionId: string): Promise<AmbitionFull | null> {
    const ambition = await this.findAmbitionDetailsByUserIdAndId(userId, ambitionId);
    if (!ambition) {
      return null;
    }

    const [taskRows, milestoneRows, noteRows] = await Promise.all([
      db
        .select()
        .from(tasks)
        .where(and(eq(tasks.ambitionId, ambitionId), eq(tasks.userId, userId))),
      db
        .select()
        .from(milestones)
        .where(and(eq(milestones.ambitionId, ambitionId), eq(milestones.userId, userId))),
      db
        .select()
        .from(notes)
        .where(and(eq(notes.ambitionId, ambitionId), eq(notes.userId, userId))),
    ]);

    return {
      ambition,
      tasks: taskRows,
      milestones: milestoneRows,
      notes: noteRows,
    };
  }

  async toggleFavourite(userId: string, ambitionId: string): Promise<Ambition> {
    const ambition = await this.findOneAmbitionById(userId, ambitionId);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${ambitionId} not found`);
    }

    const [updated] = await db
      .update(ambitions)
      .set({ isFavourited: !(ambition.isFavourited ?? false) })
      .where(eq(ambitions.id, ambition.id))
      .returning();
    return updated;
  }
}
