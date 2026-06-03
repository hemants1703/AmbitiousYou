import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Module({
  controllers: [TasksController],
  providers: [TasksService, SessionGuard],
})
export class TasksModule {}
