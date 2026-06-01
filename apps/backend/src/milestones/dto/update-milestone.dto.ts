import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Standalone on purpose: extending PartialType(CreateMilestoneDto) pulled in `ambitionId`
// (which defaults to '') and failed @IsNotEmpty on every update, since the update body
// never resends it. A milestone update only touches the fields below.
export class UpdateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  milestone: string = '';

  @IsString()
  @IsOptional()
  milestoneDescription?: string;

  @IsBoolean()
  milestoneCompleted: boolean = false;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  milestoneTargetDate: Date = new Date();
}
