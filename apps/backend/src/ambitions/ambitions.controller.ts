import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AmbitionsService } from './ambitions.service';
import { CreateAmbitionDto } from './dto/create-ambition.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { AmbitionEntity } from './entities/ambition.entity';

@Controller('ambitions')
export class AmbitionsController {
  constructor(private readonly ambitionsService: AmbitionsService) {}

  @UseGuards(SessionGuard)
  @Post()
  createAmbition(@Body() createAmbitionDto: CreateAmbitionDto) {
    return this.ambitionsService.createAmbition(createAmbitionDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  findAllAmbitionsByUserId(@Query('userId') userId: string) {
    return this.ambitionsService.findAllAmbitionsForUserId(userId);
  }

  @UseGuards(SessionGuard)
  @Get(':ambitionId')
  async findOneAmbitionById(@Param('ambitionId') ambitionId: string): Promise<AmbitionEntity | null> {
    return await this.ambitionsService.findOneAmbitionById(ambitionId);
  }

  @UseGuards(SessionGuard)
  @Patch(':ambitionId')
  async updateAmbitionById(@Param('ambitionId') ambitionId: string, @Body() updateAmbitionDto: UpdateAmbitionDto): Promise<AmbitionEntity> {
    return await this.ambitionsService.updateAmbitionById(ambitionId, updateAmbitionDto);
  }

  @UseGuards(SessionGuard)
  @Delete(':ambitionId')
  async removeAmbitionById(@Param('ambitionId') ambitionId: string): Promise<AmbitionEntity> {
    return await this.ambitionsService.removeAmbitionById(ambitionId);
  }
}
