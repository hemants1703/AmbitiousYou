import { IsDateString, IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpsertContractDto {
  @IsOptional()
  @IsDateString()
  localDate?: string;

  @IsIn(['task', 'milestone'])
  moveKind!: 'task' | 'milestone';

  @IsUUID()
  moveId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  ifTrigger?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  thenAction?: string;
}
