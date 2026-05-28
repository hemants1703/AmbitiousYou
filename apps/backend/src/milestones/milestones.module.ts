import { Module } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilestoneEntity } from './entities/milestone.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MilestoneEntity, SessionEntity, UserEntity])],
  controllers: [MilestonesController],
  providers: [MilestonesService, SessionGuard],
})
export class MilestonesModule {}
