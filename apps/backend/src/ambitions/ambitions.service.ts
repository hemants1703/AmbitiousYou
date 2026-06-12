import { BadRequestException, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { db, ambitions, milestones, notes, tasks, type Ambition } from 'src/db';

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
    const rows = await db.select().from(ambitions).where(eq(ambitions.userId, userId)).orderBy(desc(ambitions.createdAt));
    return rows.length ? rows : null;
  }

  async findAmbitionDetailsByUserIdAndId(userId: string, ambitionId: string): Promise<Ambition | null> {
    const [ambition] = await db
      .select()
      .from(ambitions)
      .where(and(eq(ambitions.id, ambitionId), eq(ambitions.userId, userId)))
      .limit(1);
    return ambition ?? null;
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

    const [updated] = await db
      .update(ambitions)
      .set({
        ambitionName: updateAmbitionDto.ambitionName,
        ambitionDefinition: updateAmbitionDto.ambitionDefinition,
        ambitionMotivation: updateAmbitionDto.ambitionMotivation,
        ambitionPriority: updateAmbitionDto.ambitionPriority,
        isFavourited: updateAmbitionDto.isFavourited,
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
}
