import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  @IsOptional()
  userTimezone: string = '';

  @IsBoolean()
  @IsOptional()
  emailAccountActivity: boolean = false;

  @IsBoolean()
  @IsOptional()
  pushAmbitionReminders: boolean = false;
}
