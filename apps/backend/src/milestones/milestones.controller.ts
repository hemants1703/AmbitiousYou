import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { MilestoneEntity } from './entities/milestone.entity';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';

@Controller('milestones')
@UseGuards(SessionGuard)
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  createMilestone(@CurrentUserId() userId: string, @Body() createMilestoneDto: CreateMilestoneDto) {
    return this.milestonesService.createMilestone(userId, createMilestoneDto);
  }

  @Get()
  async findAllMilestonesForAmbitionId(@CurrentUserId() userId: string, @Query('ambitionId') ambitionId: string): Promise<MilestoneEntity[] | null> {
    return await this.milestonesService.findAllMilestonesForAmbitionId(userId, ambitionId);
  }

  @Get(':milestoneId')
  async findOneMilestoneById(@CurrentUserId() userId: string, @Param('milestoneId') milestoneId: string): Promise<MilestoneEntity | null> {
    return await this.milestonesService.findOneMilestoneById(userId, milestoneId);
  }

  @Patch(':milestoneId')
  async updateMilestoneById(@CurrentUserId() userId: string, @Param('milestoneId') milestoneId: string, @Body() updateMilestoneDto: UpdateMilestoneDto): Promise<MilestoneEntity> {
    return await this.milestonesService.updateMilestoneById(userId, milestoneId, updateMilestoneDto);
  }

  @Patch(':milestoneId/toggle-completion')
  async toggleMilestoneCompletionStatus(@CurrentUserId() userId: string, @Param('milestoneId') milestoneId: string): Promise<MilestoneEntity> {
    return await this.milestonesService.toggleMilestoneCompletionStatus(userId, milestoneId);
  }

  @Delete(':milestoneId')
  async removeMilestoneById(@CurrentUserId() userId: string, @Param('milestoneId') milestoneId: string): Promise<MilestoneEntity> {
    return await this.milestonesService.removeMilestoneById(userId, milestoneId);
  }
}
