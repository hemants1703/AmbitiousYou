import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(SettingsEntity) private settingsRepository: Repository<SettingsEntity>) {}

  async createSettingsForUserId(userId: string): Promise<SettingsEntity> {
    const settings = this.settingsRepository.create({
      id: crypto.randomUUID(),
      userId,
      userTimezone: '',
      emailAccountActivity: true,
      pushAmbitionReminders: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.settingsRepository.save(settings);
  }

  async findAllSettingsForUserId(userId: string): Promise<SettingsEntity | null> {
    const settings = await this.settingsRepository.findOne({ where: { userId } });
    if (!settings) {
      throw new BadRequestException('Settings not found for the user');
    }

    return settings;
  }

  async updateSettingForUserId(userId: string, updateSettingDto: UpdateSettingDto): Promise<SettingsEntity> {
    const settings = await this.settingsRepository.findOne({ where: { userId } });
    if (!settings) {
      throw new BadRequestException('Setting not found');
    }
    Object.assign(settings, updateSettingDto);
    return await this.settingsRepository.save(settings);
  }
}
