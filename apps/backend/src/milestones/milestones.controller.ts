import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { MilestoneEntity } from './entities/milestone.entity';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @UseGuards(SessionGuard)
  @Post()
  createMilestone(@Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.createMilestone(createMilestoneDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAllMilestonesForAmbitionId(@Query('ambitionId') ambitionId: string): Promise<MilestoneEntity[] | null> {
    return await this.milestonesService.findAllMilestonesForAmbitionId(ambitionId);
  }

  @UseGuards(SessionGuard)
  @Get(':milestoneId')
  async findOneMilestoneById(@Param('milestoneId') milestoneId: string): Promise<MilestoneEntity | null> {
    return await this.milestonesService.findOneMilestoneById(milestoneId);
  }

  @UseGuards(SessionGuard)
  @Patch(':milestoneId')
  async updateMilestoneById(@Param('milestoneId') milestoneId: string, @Body() updateMilestoneDto: UpdateMilestoneDto): Promise<MilestoneEntity> {
    return await this.milestonesService.updateMilestoneById(milestoneId, updateMilestoneDto);
  }

  @UseGuards(SessionGuard)
  @Delete(':milestoneId')
  async removeMilestoneById(@Param('milestoneId') milestoneId: string): Promise<MilestoneEntity> {
    return await this.milestonesService.removeMilestoneById(milestoneId);
  }
}
