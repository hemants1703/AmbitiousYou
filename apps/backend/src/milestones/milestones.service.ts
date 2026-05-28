import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestoneEntity } from './entities/milestone.entity';

@Injectable()
export class MilestonesService {
  constructor(@InjectRepository(MilestoneEntity) private readonly milestoneRepository: Repository<MilestoneEntity>) {}

  createMilestone(createMilestoneDto: CreateMilestoneDto): MilestoneEntity {
    return this.milestoneRepository.create({
      id: crypto.randomUUID(),
      ...createMilestoneDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAllMilestonesForAmbitionId(ambitionId: string): Promise<MilestoneEntity[] | null> {
    return await this.milestoneRepository.find({
      where: { ambitionId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneMilestoneById(milestoneId: string): Promise<MilestoneEntity | null> {
    return await this.milestoneRepository.findOneBy({ id: milestoneId });
  }

  async updateMilestoneById(milestoneId: string, updateMilestoneDto: UpdateMilestoneDto): Promise<MilestoneEntity> {
    const milestone = await this.findOneMilestoneById(milestoneId);
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

  async removeMilestoneById(milestoneId: string): Promise<MilestoneEntity> {
    const milestone = await this.findOneMilestoneById(milestoneId);
    if (!milestone) {
      throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
    }

    return await this.milestoneRepository.remove(milestone);
  }
}
