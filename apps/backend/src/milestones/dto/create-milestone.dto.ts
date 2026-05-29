import { NewMilestone } from '@ambitiousyou/shared';
import { Type } from 'class-transformer';
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
  @Type(() => Date)
  milestoneTargetDate: Date = new Date();

  @IsDate()
  @Type(() => Date)
  createdAt: Date = new Date();

  @IsDate()
  @Type(() => Date)
  updatedAt: Date = new Date();
}
