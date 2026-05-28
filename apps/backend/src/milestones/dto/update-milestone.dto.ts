import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { CreateMilestoneDto } from './create-milestone.dto';

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

  @IsDate()
  @IsNotEmpty()
  milestoneTargetDate: Date = new Date();
}
