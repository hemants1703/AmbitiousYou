import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { recalculateAmbitionProgress } from 'src/ambitions/ambition-progress.util';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity) private readonly tasksRepository: Repository<TaskEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const saved = await manager.getRepository(TaskEntity).save({
        id: crypto.randomUUID(),
        userId,
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await recalculateAmbitionProgress(manager, { userId, ambitionId: createTaskDto.ambitionId });
      return saved;
    });
  }

  async findAllTasksForAmbitionId(userId: string, ambitionId: string): Promise<TaskEntity[] | null> {
    return await this.tasksRepository.find({ where: { ambitionId, userId } });
  }

  async findOneTaskById(userId: string, taskId: string): Promise<TaskEntity | null> {
    return await this.tasksRepository.findOne({ where: { id: taskId, userId } });
  }

  async updateTaskById(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const taskRepository = manager.getRepository(TaskEntity);
      const task = await taskRepository.findOne({ where: { id: taskId, userId } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      Object.assign(task, {
        task: updateTaskDto.task,
        taskDescription: updateTaskDto.taskDescription,
        taskCompleted: updateTaskDto.taskCompleted,
        taskDeadline: updateTaskDto.taskDeadline,
        updatedAt: new Date(),
      });
      const saved = await taskRepository.save(task);
      await recalculateAmbitionProgress(manager, { userId, ambitionId: task.ambitionId });
      return saved;
    });
  }

  async toggleTaskCompletionStatus(userId: string, taskId: string): Promise<TaskEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const taskRepository = manager.getRepository(TaskEntity);
      const task = await taskRepository.findOne({ where: { id: taskId, userId } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const saved = await taskRepository.save({
        ...task,
        taskCompleted: !task.taskCompleted,
        updatedAt: new Date(),
      });
      await recalculateAmbitionProgress(manager, { userId, ambitionId: task.ambitionId });
      return saved;
    });
  }

  async removeTaskById(userId: string, taskId: string): Promise<TaskEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const taskRepository = manager.getRepository(TaskEntity);
      const task = await taskRepository.findOne({ where: { id: taskId, userId } });
      if (!task) {
        throw new BadRequestException('Task not found');
      }

      const ambitionId = task.ambitionId;
      const removed = await taskRepository.remove(task);
      await recalculateAmbitionProgress(manager, { userId, ambitionId });
      return removed;
    });
  }
}
