import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { ProofService } from './proof.service';
import { CreateProofLogDto } from './dto/create-proof-log.dto';
import type { ProofLog } from '../db';

@Controller('proof-logs')
@UseGuards(SessionGuard, ProGuard)
export class ProofController {
  constructor(private readonly proofService: ProofService) {}

  @Get()
  list(@CurrentUserId() userId: string): Promise<ProofLog[]> {
    return this.proofService.listProofLogs(userId);
  }

  @Post()
  create(@CurrentUserId() userId: string, @Body() dto: CreateProofLogDto): Promise<ProofLog> {
    return this.proofService.createProofLog(userId, dto);
  }

  @Delete(':proofLogId')
  remove(@CurrentUserId() userId: string, @Param('proofLogId', ParseUUIDPipe) proofLogId: string): Promise<void> {
    return this.proofService.deleteProofLog(userId, proofLogId);
  }
}
