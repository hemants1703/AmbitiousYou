import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAmbitionDto } from './dto/create-ambition.dto';
import { UpdateAmbitionDto } from './dto/update-ambition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AmbitionEntity } from './entities/ambition.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AmbitionsService {
  constructor(@InjectRepository(AmbitionEntity) private readonly ambitionsRepository: Repository<AmbitionEntity>) {}

  createAmbition(createAmbitionDto: CreateAmbitionDto): AmbitionEntity {
    return this.ambitionsRepository.create({
      id: crypto.randomUUID(),
      ...createAmbitionDto,
      ambitionStatus: 'active',
      ambitionPercentageCompleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAllAmbitionsForUserId(userId: string): Promise<AmbitionEntity[]> {
    return await this.ambitionsRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneAmbitionById(ambitionId: string): Promise<AmbitionEntity | null> {
    return await this.ambitionsRepository.findOne({ where: { id: ambitionId } });
  }

  async updateAmbitionById(ambitionId: string, updateAmbitionDto: UpdateAmbitionDto): Promise<AmbitionEntity> {
    const ambition = await this.findOneAmbitionById(ambitionId);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${ambitionId} not found`);
    }

    return await this.ambitionsRepository.save({
      ...ambition,
      ambitionName: updateAmbitionDto.ambitionName,
      ambitionDefinition: updateAmbitionDto.ambitionDefinition,
      ambitionPriority: updateAmbitionDto.ambitionPriority,
      ambitionColor: updateAmbitionDto.ambitionColor,
      isFavourited: updateAmbitionDto.isFavourited,
      updatedAt: new Date(),
    });
  }

  async removeAmbitionById(id: string): Promise<AmbitionEntity> {
    const ambition = await this.findOneAmbitionById(id);
    if (!ambition) {
      throw new BadRequestException(`Ambition with id ${id} not found`);
    }

    return await this.ambitionsRepository.remove(ambition);
  }
}
