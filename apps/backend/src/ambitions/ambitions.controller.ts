import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { AmbitionsService } from './ambitions.service';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { AmbitionEntity } from './entities/ambition.entity';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';

@Controller('ambitions')
@UseGuards(SessionGuard)
export class AmbitionsController {
  constructor(private readonly ambitionsService: AmbitionsService) {}

  @Post()
  async createAmbition(@CurrentUserId() userId: string, @Body() createAmbitionDto: CreateAmbitionWithItemsDto): Promise<AmbitionEntity> {
    return await this.ambitionsService.createAmbition(userId, createAmbitionDto);
  }

  @Get()
  async findAllAmbitionsByUserId(@CurrentUserId() userId: string): Promise<AmbitionEntity[] | null> {
    return await this.ambitionsService.findAllAmbitionsByUserId(userId);
  }

  @Get(':ambitionId/details')
  async findAmbitionDetailsByUserIdAndId(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<AmbitionEntity | null> {
    return await this.ambitionsService.findAmbitionDetailsByUserIdAndId(userId, ambitionId);
  }

  @Get(':ambitionId')
  async findOneAmbitionById(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<AmbitionEntity | null> {
    return await this.ambitionsService.findOneAmbitionById(userId, ambitionId);
  }

  @Patch(':ambitionId')
  async updateAmbitionById(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string, @Body() updateAmbitionDto: UpdateAmbitionDto): Promise<AmbitionEntity> {
    return await this.ambitionsService.updateAmbitionById(userId, ambitionId, updateAmbitionDto);
  }

  @Delete(':ambitionId')
  async removeAmbitionById(@CurrentUserId() userId: string, @Param('ambitionId') ambitionId: string): Promise<AmbitionEntity> {
    return await this.ambitionsService.removeAmbitionById(userId, ambitionId);
  }
}
