import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestoneEntity } from './entities/milestone.entity';

@Injectable()
export class MilestonesService {
  constructor(@InjectRepository(MilestoneEntity) private readonly milestoneRepository: Repository<MilestoneEntity>) {}

  async createMilestone(userId: string, createMilestoneDto: CreateMilestoneDto): Promise<MilestoneEntity> {
    return await this.milestoneRepository.save({
      id: crypto.randomUUID(),
      userId,
      ...createMilestoneDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAllMilestonesForAmbitionId(userId: string, ambitionId: string): Promise<MilestoneEntity[] | null> {
    return await this.milestoneRepository.find({
      where: { ambitionId, userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneMilestoneById(userId: string, milestoneId: string): Promise<MilestoneEntity | null> {
    return await this.milestoneRepository.findOneBy({ id: milestoneId, userId });
  }

  async updateMilestoneById(userId: string, milestoneId: string, updateMilestoneDto: UpdateMilestoneDto): Promise<MilestoneEntity> {
    const milestone = await this.findOneMilestoneById(userId, milestoneId);
    if (!milestone) {
      throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
    }

    return await this.milestoneRepository.save({
      ...milestone,
      milestone: updateMilestoneDto.milestone,
      milestoneDescription: updateMilestoneDto.milestoneDescription,
      milestoneCompleted: updateMilestoneDto.milestoneCompleted,
      milestoneTargetDate: updateMilestoneDto.milestoneTargetDate,
      updatedAt: new Date(),
    });
  }

  async toggleMilestoneCompletionStatus(userId: string, milestoneId: string): Promise<MilestoneEntity> {
    const milestone = await this.findOneMilestoneById(userId, milestoneId);
    if (!milestone) {
      throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
    }

    return await this.milestoneRepository.save({
      ...milestone,
      milestoneCompleted: !milestone.milestoneCompleted,
      updatedAt: new Date(),
    });
  }

  async removeMilestoneById(userId: string, milestoneId: string): Promise<MilestoneEntity> {
    const milestone = await this.findOneMilestoneById(userId, milestoneId);
    if (!milestone) {
      throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
    }

    return await this.milestoneRepository.remove(milestone);
  }
}
