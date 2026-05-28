import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { TaskEntity } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(SessionGuard)
  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.tasksService.createTask(createTaskDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAllTasksForAmbitionId(@Query('ambitionId') ambitionId: string): Promise<TaskEntity[] | null> {
    return await this.tasksService.findAllTasksForAmbitionId(ambitionId);
  }

  @UseGuards(SessionGuard)
  @Get(':taskId')
  async findOneTask(@Param('taskId') taskId: string): Promise<TaskEntity | null> {
    return await this.tasksService.findOneTaskById(taskId);
  }

  @UseGuards(SessionGuard)
  @Patch(':taskId')
  async updateTask(@Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return await this.tasksService.updateTaskById(taskId, updateTaskDto);
  }

  @UseGuards(SessionGuard)
  @Delete(':taskId')
  async removeTask(@Param('taskId') taskId: string): Promise<TaskEntity> {
    return await this.tasksService.removeTaskById(taskId);
  }
}
