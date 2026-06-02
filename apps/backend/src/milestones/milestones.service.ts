import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestoneEntity } from './entities/milestone.entity';
import { recalculateAmbitionProgress } from 'src/ambitions/ambition-progress.util';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(MilestoneEntity) private readonly milestoneRepository: Repository<MilestoneEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createMilestone(userId: string, createMilestoneDto: CreateMilestoneDto): Promise<MilestoneEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const saved = await manager.getRepository(MilestoneEntity).save({
        id: crypto.randomUUID(),
        userId,
        ...createMilestoneDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await recalculateAmbitionProgress(manager, { userId, ambitionId: createMilestoneDto.ambitionId });
      return saved;
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
    return await this.entityManager.transaction(async (manager) => {
      const milestoneRepository = manager.getRepository(MilestoneEntity);
      const milestone = await milestoneRepository.findOne({ where: { id: milestoneId, userId } });
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      const saved = await milestoneRepository.save({
        ...milestone,
        milestone: updateMilestoneDto.milestone,
        milestoneDescription: updateMilestoneDto.milestoneDescription,
        milestoneCompleted: updateMilestoneDto.milestoneCompleted,
        milestoneTargetDate: updateMilestoneDto.milestoneTargetDate,
        updatedAt: new Date(),
      });
      await recalculateAmbitionProgress(manager, { userId, ambitionId: milestone.ambitionId });
      return saved;
    });
  }

  async toggleMilestoneCompletionStatus(userId: string, milestoneId: string): Promise<MilestoneEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const milestoneRepository = manager.getRepository(MilestoneEntity);
      const milestone = await milestoneRepository.findOne({ where: { id: milestoneId, userId } });
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      // Milestones are one-way: reaching one is a permanent achievement and cannot be reopened.
      if (milestone.milestoneCompleted) {
        throw new BadRequestException('Milestones cannot be reopened once completed');
      }

      const saved = await milestoneRepository.save({
        ...milestone,
        milestoneCompleted: true,
        updatedAt: new Date(),
      });
      await recalculateAmbitionProgress(manager, { userId, ambitionId: milestone.ambitionId });
      return saved;
    });
  }

  async removeMilestoneById(userId: string, milestoneId: string): Promise<MilestoneEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const milestoneRepository = manager.getRepository(MilestoneEntity);
      const milestone = await milestoneRepository.findOne({ where: { id: milestoneId, userId } });
      if (!milestone) {
        throw new BadRequestException(`Milestone with id ${milestoneId} not found`);
      }

      const ambitionId = milestone.ambitionId;
      const removed = await milestoneRepository.remove(milestone);
      await recalculateAmbitionProgress(manager, { userId, ambitionId });
      return removed;
    });
  }
}
