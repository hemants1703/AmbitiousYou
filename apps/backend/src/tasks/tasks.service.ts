import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { recalculateAmbitionProgress } from 'src/ambitions/ambition-progress.util';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.prisma.$transaction(async (tx) => {
      const saved = await tx.task.create({
        data: { userId, ...createTaskDto },
      });
      await recalculateAmbitionProgress(tx, { userId, ambitionId: createTaskDto.ambitionId });
      return saved;
    });
  }

  async findAllTasksForAmbitionId(userId: string, ambitionId: string): Promise<Task[] | null> {
    return await this.prisma.task.findMany({ where: { ambitionId, userId } });
  }

  async findOneTaskById(userId: string, taskId: string): Promise<Task | null> {
    return await this.prisma.task.findFirst({ where: { id: taskId, userId } });
  }

  async updateTaskById(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({ where: { id: taskId, userId } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const saved = await tx.task.update({
        where: { id: task.id },
        data: {
          task: updateTaskDto.task,
          taskDescription: updateTaskDto.taskDescription,
          taskCompleted: updateTaskDto.taskCompleted,
          taskDeadline: updateTaskDto.taskDeadline,
        },
      });
      await recalculateAmbitionProgress(tx, { userId, ambitionId: task.ambitionId });
      return saved;
    });
  }

  async toggleTaskCompletionStatus(userId: string, taskId: string): Promise<Task> {
    return await this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({ where: { id: taskId, userId } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const saved = await tx.task.update({
        where: { id: task.id },
        data: { taskCompleted: !task.taskCompleted },
      });
      await recalculateAmbitionProgress(tx, { userId, ambitionId: task.ambitionId });
      return saved;
    });
  }

  async removeTaskById(userId: string, taskId: string): Promise<Task> {
    return await this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findFirst({ where: { id: taskId, userId } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const ambitionId = task.ambitionId;
      const removed = await tx.task.delete({ where: { id: task.id } });
      await recalculateAmbitionProgress(tx, { userId, ambitionId });
      return removed;
    });
  }
}
