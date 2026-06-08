import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { recalculateAmbitionProgress } from 'src/ambitions/ambition-progress.util';
import { db, ambitions, tasks, type Task } from 'src/db';

@Injectable()
export class TasksService {
  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [ambition] = await tx
        .select({ id: ambitions.id })
        .from(ambitions)
        .where(and(eq(ambitions.id, createTaskDto.ambitionId), eq(ambitions.userId, userId)))
        .limit(1);
      if (!ambition) {
        throw new NotFoundException('Ambition not found');
      }

      const [saved] = await tx
        .insert(tasks)
        .values({ userId, ...createTaskDto })
        .returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId: createTaskDto.ambitionId });
      return saved;
    });
  }

  async findAllTasksForAmbitionId(userId: string, ambitionId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.ambitionId, ambitionId), eq(tasks.userId, userId)));
  }

  async findOneTaskById(userId: string, taskId: string): Promise<Task | null> {
    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .limit(1);
    return task ?? null;
  }

  async updateTaskById(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [task] = await tx
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .limit(1);
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const [saved] = await tx
        .update(tasks)
        .set({
          task: updateTaskDto.task,
          taskDescription: updateTaskDto.taskDescription,
          taskCompleted: updateTaskDto.taskCompleted,
          taskDeadline: updateTaskDto.taskDeadline,
        })
        .where(eq(tasks.id, task.id))
        .returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId: task.ambitionId });
      return saved;
    });
  }

  async toggleTaskCompletionStatus(userId: string, taskId: string): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [task] = await tx
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .limit(1);
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const [saved] = await tx.update(tasks).set({ taskCompleted: !task.taskCompleted }).where(eq(tasks.id, task.id)).returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId: task.ambitionId });
      return saved;
    });
  }

  async removeTaskById(userId: string, taskId: string): Promise<Task> {
    return await db.transaction(async (tx) => {
      const [task] = await tx
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
        .limit(1);
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const ambitionId = task.ambitionId;
      const [removed] = await tx.delete(tasks).where(eq(tasks.id, task.id)).returning();
      await recalculateAmbitionProgress(tx, { userId, ambitionId });
      return removed;
    });
  }
}
