import { BadRequestException, Injectable } from '@nestjs/common';
import { Ambition } from '@prisma/client';
import { CreateAmbitionWithItemsDto } from './dto/create-ambition-with-items.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AmbitionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAmbition(userId: string, createAmbitionDto: CreateAmbitionWithItemsDto): Promise<Ambition> {
    return await this.prisma.$transaction(async (tx) => {
      const { tasks, milestones, notes, ...ambitionData } = createAmbitionDto;

      const ambition = await tx.ambition.create({
        data: { ...ambitionData, userId },
      });

      // If the ambition tracking method is task, then we know for sure that tasks will be present since it's a required field in the DTO. But we will still check for length to avoid creating empty tasks in case an empty array is passed.
      if (tasks?.length) {
        await tx.task.createMany({
          data: tasks.map((task) => ({ ...task, userId, ambitionId: ambition.id })),
        });
      }

      // If the ambition tracking method is milestone, then we know for sure that milestones will be present since it's a required field in the DTO. But we will still check for length to avoid creating empty milestones in case an empty array is passed.
      if (milestones?.length) {
        await tx.milestone.createMany({
          data: milestones.map((milestone) => ({ ...milestone, userId, ambitionId: ambition.id })),
        });
      }

      // Notes are optional, so we will check if they are present before creating them. We will also check for length to avoid creating empty notes in case an empty array is passed.
      if (notes?.length) {
        await tx.note.createMany({
          data: notes.map((note) => ({ ...note, userId, ambitionId: ambition.id })),
        });
      }

      return ambition;
    });
  }

  async findAllAmbitionsByUserId(userId: string): Promise<Ambition[] | null> {
    const ambitions = await this.prisma.ambition.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return ambitions.length ? ambitions : null;
  }

  async findAmbitionDetailsByUserIdAndId(userId: string, ambitionId: string): Promise<Ambition | null> {
    return await this.prisma.ambition.findFirst({ where: { id: ambitionId, userId } });
  }

  async findOneAmbitionById(userId: string, ambitionId: string): Promise<Ambition | null> {
    return await this.prisma.ambition.findFirst({ where: { id: ambitionId, userId } });
  }

  async updateAmbitionById(userId: string, ambitionId: string, updateAmbitionDto: UpdateAmbitionDto): Promise<Ambition> {
    const ambition = await this.findOneAmbitionById(userId, ambitionId);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${ambitionId} not found`);
    }

    return await this.prisma.ambition.update({
      where: { id: ambition.id },
      data: {
        ambitionName: updateAmbitionDto.ambitionName,
        ambitionDefinition: updateAmbitionDto.ambitionDefinition,
        ambitionPriority: updateAmbitionDto.ambitionPriority,
        isFavourited: updateAmbitionDto.isFavourited,
      },
    });
  }

  async removeAmbitionById(userId: string, id: string): Promise<Ambition> {
    const ambition = await this.findOneAmbitionById(userId, id);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${id} not found`);
    }

    return await this.prisma.ambition.delete({ where: { id: ambition.id } });
  }
}
