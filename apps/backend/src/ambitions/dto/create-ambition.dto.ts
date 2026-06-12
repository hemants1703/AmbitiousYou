import { NewAmbition } from '@ambitiousyou/shared';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateAmbitionDto implements NewAmbition {
  @IsString()
  @IsNotEmpty({ message: 'ambitionName must be a non-empty string' })
  @MaxLength(80, { message: 'ambitionName must be 80 characters or fewer' })
  ambitionName: string = '';

  @IsString()
  ambitionDefinition: string = '';

  @IsString()
  ambitionMotivation: string = '';

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
