import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProofLogDto {
  @IsString()
  @MaxLength(200)
  proofTitle!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  proofNote?: string;

  @IsOptional()
  @IsUUID()
  ambitionId?: string;
}
