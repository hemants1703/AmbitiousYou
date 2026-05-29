import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { AmbitionsService } from './ambitions.service';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { AmbitionEntity } from './entities/ambition.entity';

@Controller('ambitions')
export class AmbitionsController {
  constructor(private readonly ambitionsService: AmbitionsService) {}

  @UseGuards(SessionGuard)
  @Post()
  async createAmbition(@Body() createAmbitionDto: CreateAmbitionWithItemsDto): Promise<AmbitionEntity> {
    return await this.ambitionsService.createAmbition(createAmbitionDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAllAmbitionsFromSessionToken(@Headers('Authorization') authorization: string): Promise<AmbitionEntity[] | null> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    return await this.ambitionsService.findAllAmbitionsFromSessionToken(token);
  }

  @UseGuards(SessionGuard)
  @Get(':ambitionId/details')
  async findAmbitionDetailsBySessionTokenAndId(@Headers('Authorization') authorization: string, @Param('ambitionId') ambitionId: string): Promise<AmbitionEntity | null> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    return await this.ambitionsService.findAmbitionDetailsBySessionTokenAndId(token, ambitionId);
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
