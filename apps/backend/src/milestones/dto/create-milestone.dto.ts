import { NewMilestone } from '@ambitiousyou/shared';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMilestoneDto implements NewMilestone {
  @IsString()
  @IsNotEmpty()
  ambitionId: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'milestone must be 255 characters or fewer' })
  milestone: string = '';

  @IsString()
  milestoneDescription: string = '';

  @IsBoolean()
  milestoneCompleted: boolean = false;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  milestoneTargetDate: Date = new Date();
}
