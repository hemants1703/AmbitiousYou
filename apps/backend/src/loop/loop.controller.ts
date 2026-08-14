import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { LoopService } from './loop.service';
import { UpsertContractDto } from './dto/upsert-contract.dto';
import { UpsertWeeklyReviewDto } from './dto/upsert-weekly-review.dto';
import type { AttentionCoachPayload, ContractPayload, MissedDayPayload, PrimaryAmbitionPayload, WeeklyReviewPayload, WeeklyReviewStatusPayload } from '../types/api';

@Controller('loop')
@UseGuards(SessionGuard, ProGuard)
export class LoopController {
  constructor(private readonly loopService: LoopService) {}

  @Get('contract')
  getContract(@CurrentUserId() userId: string, @Query('date') date?: string): Promise<ContractPayload> {
    return this.loopService.getContract(userId, date);
  }

  @Post('contract')
  upsertContract(@CurrentUserId() userId: string, @Body() dto: UpsertContractDto): Promise<ContractPayload> {
    return this.loopService.upsertContract(userId, dto);
  }

  @Patch('contract/:contractId/complete')
  completeContract(@CurrentUserId() userId: string, @Param('contractId', ParseUUIDPipe) contractId: string): Promise<ContractPayload> {
    return this.loopService.completeContract(userId, contractId);
  }

  @Patch('contract/:contractId/snooze')
  snoozeContract(@CurrentUserId() userId: string, @Param('contractId', ParseUUIDPipe) contractId: string): Promise<ContractPayload> {
    return this.loopService.snoozeContract(userId, contractId);
  }

  @Get('primary')
  getPrimary(@CurrentUserId() userId: string): Promise<PrimaryAmbitionPayload> {
    return this.loopService.getPrimary(userId);
  }

  @Get('reviews/current')
  getCurrentReview(@CurrentUserId() userId: string): Promise<WeeklyReviewPayload> {
    return this.loopService.getCurrentWeeklyReview(userId);
  }

  @Get('reviews/status')
  getReviewStatus(@CurrentUserId() userId: string): Promise<WeeklyReviewStatusPayload> {
    return this.loopService.getWeeklyReviewStatus(userId);
  }

  @Post('reviews')
  upsertReview(@CurrentUserId() userId: string, @Body() dto: UpsertWeeklyReviewDto): Promise<WeeklyReviewPayload> {
    return this.loopService.upsertWeeklyReview(userId, dto);
  }

  @Get('attention')
  getAttention(@CurrentUserId() userId: string): Promise<AttentionCoachPayload> {
    return this.loopService.getAttentionCoach(userId);
  }

  @Get('missed-day')
  getMissedDay(@CurrentUserId() userId: string): Promise<MissedDayPayload> {
    return this.loopService.getMissedDay(userId);
  }

  @Post('restart')
  restartTomorrow(@CurrentUserId() userId: string): Promise<ContractPayload> {
    return this.loopService.restartTomorrow(userId);
  }
}
