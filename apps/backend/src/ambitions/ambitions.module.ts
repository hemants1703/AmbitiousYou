import { Module } from '@nestjs/common';
import { AmbitionsService } from './ambitions.service';
import { AmbitionsController } from './ambitions.controller';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Module({
  controllers: [AmbitionsController],
  providers: [AmbitionsService, SessionGuard],
})
export class AmbitionsModule {}
