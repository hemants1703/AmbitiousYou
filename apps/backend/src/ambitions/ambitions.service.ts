import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { MilestoneEntity } from 'src/milestones/entities/milestone.entity';
import { NoteEntity } from 'src/notes/entities/note.entity';
import { TaskEntity } from 'src/tasks/entities/task.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { AmbitionEntity } from './entities/ambition.entity';

@Injectable()
export class AmbitionsService {
  constructor(
    @InjectRepository(AmbitionEntity) private readonly ambitionsRepository: Repository<AmbitionEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createAmbition(userId: string, createAmbitionDto: CreateAmbitionWithItemsDto): Promise<AmbitionEntity> {
    return await this.entityManager.transaction(async (manager) => {
      const ambition = manager.create(AmbitionEntity, {
        ...createAmbitionDto,
        userId,
        ambitionStatus: 'active',
        ambitionPercentageCompleted: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedAmbition = await manager.save(ambition);

      // If the ambition tracking method is task, then we know for sure that tasks will be present since it's a required field in the DTO. But we will still check for length to avoid creating empty tasks in case an empty array is passed.
      if (createAmbitionDto.tasks?.length) {
        const tasks = createAmbitionDto.tasks.map((task) =>
          manager.create(TaskEntity, {
            ...task,
            userId,
            ambitionId: savedAmbition.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

        await manager.save(tasks);
      }

      // If the ambition tracking method is milestone, then we know for sure that milestones will be present since it's a required field in the DTO. But we will still check for length to avoid creating empty milestones in case an empty array is passed.
      if (createAmbitionDto.milestones?.length) {
        const milestones = createAmbitionDto.milestones.map((milestone) =>
          manager.create(MilestoneEntity, {
            ...milestone,
            userId,
            ambitionId: savedAmbition.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

        await manager.save(milestones);
      }

      // Notes are optional, so we will check if they are present before creating them. We will also check for length to avoid creating empty notes in case an empty array is passed.
      if (createAmbitionDto.notes?.length) {
        const notes = createAmbitionDto.notes.map((note) =>
          manager.create(NoteEntity, {
            ...note,
            userId,
            ambitionId: savedAmbition.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );

        await manager.save(notes);
      }

      return savedAmbition;
    });
  }

  async findAllAmbitionsByUserId(userId: string): Promise<AmbitionEntity[] | null> {
    const ambitions = await this.entityManager
      .getRepository(AmbitionEntity)
      .createQueryBuilder('ambition')
      .where('ambition.user_id = :userId', { userId })
      .orderBy('ambition.created_at', 'DESC')
      .getMany();

    return ambitions.length ? ambitions : null;
  }

  async findAmbitionDetailsByUserIdAndId(userId: string, ambitionId: string): Promise<AmbitionEntity | null> {
    const ambition = await this.entityManager
      .getRepository(AmbitionEntity)
      .createQueryBuilder('ambition')
      .where('ambition.user_id = :userId', { userId })
      .andWhere('ambition.id = :ambitionId', { ambitionId })
      .getOne();

    if (!ambition) {
      return null;
    }

    if (ambition.ambitionTrackingMethod === 'task') {
      delete (ambition as AmbitionEntity & { milestones?: MilestoneEntity[] }).milestones;
    } else {
      delete (ambition as AmbitionEntity & { tasks?: TaskEntity[] }).tasks;
    }

    return ambition;
  }

  async findOneAmbitionById(userId: string, ambitionId: string): Promise<AmbitionEntity | null> {
    return await this.ambitionsRepository.findOne({ where: { id: ambitionId, userId } });
  }

  async updateAmbitionById(userId: string, ambitionId: string, updateAmbitionDto: UpdateAmbitionDto): Promise<AmbitionEntity> {
    const ambition = await this.findOneAmbitionById(userId, ambitionId);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${ambitionId} not found`);
    }

    return await this.ambitionsRepository.save({
      ...ambition,
      ambitionName: updateAmbitionDto.ambitionName,
      ambitionDefinition: updateAmbitionDto.ambitionDefinition,
      ambitionPriority: updateAmbitionDto.ambitionPriority,
      isFavourited: updateAmbitionDto.isFavourited,
      updatedAt: new Date(),
    });
  }

  async removeAmbitionById(userId: string, id: string): Promise<AmbitionEntity> {
    const ambition = await this.findOneAmbitionById(userId, id);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${id} not found`);
    }

    return await this.ambitionsRepository.remove(ambition);
  }
}
