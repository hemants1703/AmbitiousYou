import { Module } from '@nestjs/common';
import { LoopController } from './loop.controller';
import { LoopService } from './loop.service';
import { SessionGuard } from '../auth/guards/session.guard';
import { ProGuard } from '../auth/guards/pro.guard';

@Module({
  controllers: [LoopController],
  providers: [LoopService, SessionGuard, ProGuard],
  exports: [LoopService],
})
export class LoopModule {}
