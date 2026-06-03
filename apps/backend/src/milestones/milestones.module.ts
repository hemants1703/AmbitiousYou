import { Module } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  controllers: [MilestonesController],
  providers: [MilestonesService, SessionGuard],
})
export class MilestonesModule {}
