import { BadRequestException, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { db, ambitions, milestones, notes, tasks, type Ambition } from 'src/db';

@Injectable()
export class AmbitionsService {
  async createAmbition(userId: string, createAmbitionDto: CreateAmbitionWithItemsDto): Promise<Ambition> {
    return await db.transaction(async (tx) => {
      const { tasks: tasksDto, milestones: milestonesDto, notes: notesDto, ...ambitionData } = createAmbitionDto;

      const [ambition] = await tx
        .insert(ambitions)
        .values({ ...ambitionData, userId })
        .returning();

      // Tracking method `task` guarantees `tasks` is present; the length check guards an empty array.
      if (tasksDto?.length) {
        await tx.insert(tasks).values(tasksDto.map((task) => ({ ...task, userId, ambitionId: ambition.id })));
      }

      // Tracking method `milestone` guarantees `milestones` is present; the length check guards an empty array.
      if (milestonesDto?.length) {
        await tx.insert(milestones).values(milestonesDto.map((milestone) => ({ ...milestone, userId, ambitionId: ambition.id })));
      }

      // Notes are optional, so we will check if they are present before creating them.
      if (notesDto?.length) {
        await tx.insert(notes).values(notesDto.map((note) => ({ ...note, userId, ambitionId: ambition.id })));
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
