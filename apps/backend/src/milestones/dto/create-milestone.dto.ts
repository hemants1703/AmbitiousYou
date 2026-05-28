import { NewMilestone } from '@ambitiousyou/shared';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateMilestoneDto implements NewMilestone {
  @IsString()
  @IsNotEmpty()
  userId: string = '';

  @IsString()
  @IsNotEmpty()
  ambitionId: string = '';

  @IsString()
  @IsNotEmpty()
  milestone: string = '';

  @IsString()
  milestoneDescription: string = '';

  @IsBoolean()
  @IsBoolean()
  milestoneCompleted: boolean = false;

  @IsDate()
  @IsNotEmpty()
  milestoneTargetDate: Date = new Date();

  @IsDate()
  createdAt: Date = new Date();

  @IsDate()
  updatedAt: Date = new Date();
}
