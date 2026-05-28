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
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  findAllTasksForAmbitionId(@Query('ambitionId') ambitionId: string) {
    return this.tasksService.findAllTasksForAmbitionId(ambitionId);
  }

  @UseGuards(SessionGuard)
  @Get(':taskId')
  findOneTask(@Param('taskId') taskId: string): Promise<TaskEntity | null> {
    return this.tasksService.findOneTaskById(taskId);
  }

  @UseGuards(SessionGuard)
  @Patch(':taskId')
  updateTask(@Param('taskId') taskId: string, @Body() updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return this.tasksService.updateTaskById(taskId, updateTaskDto);
  }

  @UseGuards(SessionGuard)
  @Delete(':taskId')
  removeTask(@Param('taskId') taskId: string): Promise<TaskEntity> {
    return this.tasksService.removeTaskById(taskId);
  }
}
