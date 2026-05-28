import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, UserEntity, TaskEntity])],
  controllers: [TasksController],
  providers: [TasksService, SessionGuard],
})
export class TasksModule {}
