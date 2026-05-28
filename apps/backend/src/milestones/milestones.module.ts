import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbitionEntity } from 'src/ambitions/entities/ambition.entity';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { MilestoneEntity } from './entities/milestone.entity';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  imports: [TypeOrmModule.forFeature([MilestoneEntity, SessionEntity, UserEntity, AmbitionEntity])],
  controllers: [MilestonesController],
  providers: [MilestonesService, SessionGuard],
})
export class MilestonesModule {}
