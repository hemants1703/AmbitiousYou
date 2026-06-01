import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { TaskEntity } from './entities/task.entity';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';

@Controller('tasks')
@UseGuards(SessionGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@CurrentUserId() userId: string, @Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.tasksService.createTask(userId, createTaskDto);
  }

  @Get()
  async findAllTasksForAmbitionId(@CurrentUserId() userId: string, @Query('ambitionId') ambitionId: string): Promise<TaskEntity[] | null> {
    return await this.tasksService.findAllTasksForAmbitionId(userId, ambitionId);
  }

  @Get(':taskId')
  async findOneTask(@CurrentUserId() userId: string, @Param('taskId') taskId: string): Promise<TaskEntity | null> {
    return await this.tasksService.findOneTaskById(userId, taskId);
  }

  @Patch(':taskId')
  async updateTask(@CurrentUserId() userId: string, @Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return await this.tasksService.updateTaskById(userId, taskId, updateTaskDto);
  }

  @Patch(':taskId/mark-completed')
  async markTaskAsCompleted(@CurrentUserId() userId: string, @Param('taskId') taskId: string): Promise<TaskEntity> {
    return await this.tasksService.markTaskAsCompleted(userId, taskId);
  }

  @Delete(':taskId')
  async removeTask(@CurrentUserId() userId: string, @Param('taskId') taskId: string): Promise<TaskEntity> {
    return await this.tasksService.removeTaskById(userId, taskId);
  }
}
