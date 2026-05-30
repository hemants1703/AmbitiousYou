import { NewAmbition } from '@ambitiousyou/shared';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateAmbitionDto implements NewAmbition {
  @IsString()
  @IsNotEmpty({ message: 'userId must be a non-empty string' })
  userId: string = '';

  @IsString()
  @IsNotEmpty({ message: 'ambitionName must be a non-empty string' })
  ambitionName: string = '';

  @IsString()
  ambitionDefinition: string = '';

  @IsEnum(['task', 'milestone'], { message: 'ambitionTrackingMethod must be either task or milestone' })
  @IsNotEmpty({ message: 'ambitionTrackingMethod must be a valid tracking method' })
  ambitionTrackingMethod!: 'task' | 'milestone';

  @IsDate()
  @IsNotEmpty({ message: 'ambitionStartDate must be a valid date' })
  @Type(() => Date)
  ambitionStartDate: Date = new Date();

  @IsDate()
  @IsNotEmpty({ message: 'ambitionEndDate must be a valid date' })
  @Type(() => Date)
  ambitionEndDate: Date = new Date();

  @IsEnum(['low', 'medium', 'high'], { message: 'ambitionPriority must be either low, medium, or high' })
  @IsNotEmpty({ message: 'ambitionPriority must be a valid priority' })
  ambitionPriority: 'low' | 'medium' | 'high' = 'medium';
}
