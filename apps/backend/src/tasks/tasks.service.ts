import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskEntity) private readonly tasksRepository: Repository<TaskEntity>) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.tasksRepository.save({
      id: crypto.randomUUID(),
      userId,
      ...createTaskDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAllTasksForAmbitionId(userId: string, ambitionId: string): Promise<TaskEntity[] | null> {
    return await this.tasksRepository.find({ where: { ambitionId, userId } });
  }

  async findOneTaskById(userId: string, taskId: string): Promise<TaskEntity | null> {
    return await this.tasksRepository.findOne({ where: { id: taskId, userId } });
  }

  async updateTaskById(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.findOneTaskById(userId, taskId);
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    Object.assign(task, {
      ...task,
      task: updateTaskDto.task,
      taskDescription: updateTaskDto.taskDescription,
      taskCompleted: updateTaskDto.taskCompleted,
      taskDeadline: updateTaskDto.taskDeadline,
      updatedAt: new Date(),
    });
    return await this.tasksRepository.save(task);
  }

  async removeTaskById(userId: string, taskId: string): Promise<TaskEntity> {
    const task = await this.findOneTaskById(userId, taskId);
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    return await this.tasksRepository.remove(task);
  }
}
