import { IsDateString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpsertWeeklyReviewDto {
  @IsOptional()
  @IsDateString()
  weekStartDate?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  moved!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  stalled!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  skipReason?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  nextWeekContract!: string;
}
