import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';
import type { Settings } from 'src/db';

@Controller('settings')
@UseGuards(SessionGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async findAllSettingsForUserId(@CurrentUserId() userId: string): Promise<Settings | null> {
    return await this.settingsService.findAllSettingsForUserId(userId);
  }

  @Patch()
  async updateUserSettingForUserId(@CurrentUserId() userId: string, @Body() updateSettingDto: UpdateSettingDto): Promise<Settings> {
    return await this.settingsService.updateSettingForUserId(userId, updateSettingDto);
  }
}
