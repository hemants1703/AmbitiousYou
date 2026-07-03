import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { AmbitionsService } from './ambitions.service';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import type { Ambition } from 'src/db';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import type { AmbitionFull, AmbitionMovesBatch } from '@ambitiousyou/shared/types';

@Controller('ambitions')
@UseGuards(SessionGuard)
export class AmbitionsController {
  constructor(private readonly ambitionsService: AmbitionsService) {}

  @Post()
  async createAmbition(@CurrentUserId() userId: string, @Body() createAmbitionDto: CreateAmbitionWithItemsDto): Promise<Ambition> {
    return await this.ambitionsService.createAmbition(userId, createAmbitionDto);
  }

  @Get()
  async findAllAmbitionsByUserId(@CurrentUserId() userId: string): Promise<Ambition[] | null> {
    return await this.ambitionsService.findAllAmbitionsByUserId(userId);
  }

  @Get('moves')
  async findMovesBatch(@CurrentUserId() userId: string, @Query('openOnly') openOnly?: string): Promise<AmbitionMovesBatch> {
    return await this.ambitionsService.findMovesBatch(userId, openOnly === 'true');
  }

  @Get(':ambitionId/full')
  async findAmbitionFull(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<AmbitionFull | null> {
    return await this.ambitionsService.findAmbitionFullByUserIdAndId(userId, ambitionId);
  }

  @Get(':ambitionId/details')
  async findAmbitionDetailsByUserIdAndId(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<Ambition | null> {
    return await this.ambitionsService.findAmbitionDetailsByUserIdAndId(userId, ambitionId);
  }

  @Get(':ambitionId')
  async findOneAmbitionById(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<Ambition | null> {
    return await this.ambitionsService.findOneAmbitionById(userId, ambitionId);
  }

  @Patch(':ambitionId/favourite')
  async toggleFavourite(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<Ambition> {
    return await this.ambitionsService.toggleFavourite(userId, ambitionId);
  }

  @Patch(':ambitionId')
  async updateAmbitionById(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string, @Body() updateAmbitionDto: UpdateAmbitionDto): Promise<Ambition> {
    return await this.ambitionsService.updateAmbitionById(userId, ambitionId, updateAmbitionDto);
  }

  @Delete(':ambitionId')
  async removeAmbitionById(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<Ambition> {
    return await this.ambitionsService.removeAmbitionById(userId, ambitionId);
  }
}
