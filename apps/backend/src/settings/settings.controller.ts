import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUserId } from 'src/auth/decorators/current-user-id.decorator';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(SessionGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAllSettingsForUserId(@CurrentUserId() userId: string) {
    return this.settingsService.findAllSettingsForUserId(userId);
  }

  @Patch()
  update(@CurrentUserId() userId: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateSettingForUserId(userId, updateSettingDto);
  }
}
