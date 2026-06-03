import { BadRequestException, Injectable } from '@nestjs/common';
import { Settings } from '@prisma/client';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSettingsForUserId(userId: string): Promise<Settings> {
    return await this.prisma.settings.create({
      data: {
        userId,
        userTimezone: '',
        emailAccountActivity: true,
        pushAmbitionReminders: false,
      },
    });
  }

  async findAllSettingsForUserId(userId: string): Promise<Settings | null> {
    const settings = await this.prisma.settings.findUnique({ where: { userId } });
    if (!settings) {
      throw new BadRequestException('Settings not found for the user');
    }

    return settings;
  }

  async updateSettingForUserId(userId: string, updateSettingDto: UpdateSettingDto): Promise<Settings> {
    const settings = await this.prisma.settings.findUnique({ where: { userId } });
    if (!settings) {
      throw new BadRequestException('Setting not found');
    }

    return await this.prisma.settings.update({
      where: { userId },
      data: { ...updateSettingDto },
    });
  }
}
