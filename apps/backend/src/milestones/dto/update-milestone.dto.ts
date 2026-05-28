import { PartialType } from '@nestjs/mapped-types';
import { CreateMilestoneDto } from './create-milestone.dto';
import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
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
  @IsNotEmpty()
  milestoneCompleted: boolean = false;

  @IsDateString()
  @IsNotEmpty()
  milestoneTargetDate: Date = new Date();
}
