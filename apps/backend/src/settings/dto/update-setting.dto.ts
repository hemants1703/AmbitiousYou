import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsOptional()
  userTimezone: string = '';

  @IsBoolean()
  @IsOptional()
  pushAmbitionReminders: boolean = false;
}
