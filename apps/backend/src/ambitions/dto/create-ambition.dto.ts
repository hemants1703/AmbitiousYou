import { NewAmbition } from '@ambitiousyou/shared';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAmbitionDto implements NewAmbition {
  @IsString()
  @IsNotEmpty()
  userId: string = '';

  @IsString()
  @IsNotEmpty()
  ambitionName: string = '';

  @IsString()
  ambitionDefinition: string = '';

  @IsEnum(['task', 'milestone'])
  ambitionTrackingMethod: 'task' | 'milestone' = 'task';

  @IsDate()
  @IsNotEmpty()
  ambitionStartDate: Date = new Date();

  @IsDate()
  @IsNotEmpty()
  ambitionEndDate: Date = new Date();

  @IsEnum(['low', 'medium', 'high'])
  @IsNotEmpty()
  ambitionPriority: 'low' | 'medium' | 'high' = 'medium';

  @IsString()
  @IsNotEmpty()
  ambitionColor: string = '#000000';

  @IsBoolean()
  isFavourited: boolean = false;
}
