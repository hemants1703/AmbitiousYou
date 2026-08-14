import { Module } from '@nestjs/common';
import { AmbitionsModule } from '../ambitions/ambitions.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [AmbitionsModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
