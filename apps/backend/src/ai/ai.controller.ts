import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SessionGuard } from '../auth/guards/session.guard';
import { ProGuard } from '../auth/guards/pro.guard';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { AiService, type AiBreakdownProposal, type AiChatResponse } from './ai.service';
import { AcceptAiBreakdownDto, AiChatDto } from './dto/ai.dto';

@Controller('ai')
@UseGuards(SessionGuard, ProGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('ambitions/:ambitionId/breakdown')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  breakdown(@CurrentUserId() userId: string, @Param('ambitionId', ParseUUIDPipe) ambitionId: string): Promise<AiBreakdownProposal> {
    return this.aiService.breakdownAmbition(userId, ambitionId);
  }

  @Post('ambitions/:ambitionId/breakdown/accept')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  acceptBreakdown(
    @CurrentUserId() userId: string,
    @Param('ambitionId', ParseUUIDPipe) ambitionId: string,
    @Body() dto: AcceptAiBreakdownDto,
  ): Promise<{ success: true }> {
    return this.aiService.acceptBreakdown(userId, ambitionId, dto).then(() => ({ success: true }));
  }

  @Post('chat')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  chat(@CurrentUserId() userId: string, @Body() dto: AiChatDto): Promise<AiChatResponse> {
    return this.aiService.chat(userId, dto.message);
  }

  @Post('index')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  index(@CurrentUserId() userId: string): Promise<{ indexed: number }> {
    return this.aiService.indexUserCorpus(userId);
  }
}
