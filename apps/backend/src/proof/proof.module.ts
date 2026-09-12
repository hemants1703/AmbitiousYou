import { Module } from '@nestjs/common';
import { ProofController } from './proof.controller';
import { ProofService } from './proof.service';

@Module({
  controllers: [ProofController],
  providers: [ProofService],
  exports: [ProofService],
})
export class ProofModule {}
