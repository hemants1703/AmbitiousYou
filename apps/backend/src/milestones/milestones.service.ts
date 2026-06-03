import { BadRequestException, Injectable } from '@nestjs/common';
import { Milestone } from '@prisma/client';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { recalculateAmbitionProgress } from 'src/ambitions/ambition-progress.util';

@Injectable()
export class MilestonesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMilestone(userId: string, createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    return await this.prisma.$transaction(async (tx) => {
      const saved = await tx.milestone.create({
        data: { userId, ...createMilestoneDto },
      });
      await recalculateAmbitionProgress(tx, { userId, ambitionId: createMilestoneDto.ambitionId });
      return saved;
    });
  }

  async findAllMilestonesForAmbitionId(userId: string, ambitionId: string): Promise<Milestone[] | null> {
    return await this.prisma.milestone.findMany({
      where: { ambitionId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneMilestoneById(userId: string, milestoneId: string): Promise<Milestone | null> {
    return await this.prisma.milestone.findFirst({ where: { id: milestoneId, userId } });
  }

  async updateMilestoneById(userId: string, milestoneId: string, updateMilestoneDto: UpdateMilestoneDto): Promise<Milestone> {
    return await this.prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findFirst({ where: { id: milestoneId, userId } });
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      const saved = await tx.milestone.update({
        where: { id: milestone.id },
        data: {
          milestone: updateMilestoneDto.milestone,
          milestoneDescription: updateMilestoneDto.milestoneDescription,
          milestoneCompleted: updateMilestoneDto.milestoneCompleted,
          milestoneTargetDate: updateMilestoneDto.milestoneTargetDate,
        },
      });
      await recalculateAmbitionProgress(tx, { userId, ambitionId: milestone.ambitionId });
      return saved;
    });
  }

  async toggleMilestoneCompletionStatus(userId: string, milestoneId: string): Promise<Milestone> {
    return await this.prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findFirst({ where: { id: milestoneId, userId } });
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      // Milestones are one-way: reaching one is a permanent achievement and cannot be reopened.
      if (milestone.milestoneCompleted) {
        throw new BadRequestException('Milestones cannot be reopened once completed');
      }

      const saved = await tx.milestone.update({
        where: { id: milestone.id },
        data: { milestoneCompleted: true },
      });
      await recalculateAmbitionProgress(tx, { userId, ambitionId: milestone.ambitionId });
      return saved;
    });
  }

  async removeMilestoneById(userId: string, milestoneId: string): Promise<Milestone> {
    return await this.prisma.$transaction(async (tx) => {
      const milestone = await tx.milestone.findFirst({ where: { id: milestoneId, userId } });
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      const ambitionId = milestone.ambitionId;
      const removed = await tx.milestone.delete({ where: { id: milestone.id } });
      await recalculateAmbitionProgress(tx, { userId, ambitionId });
      return removed;
    });
  }
}
