import { IsArray, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAmbitionMilestoneDto, CreateAmbitionTaskDto } from '../../ambitions/dto/create-ambition-with-items.dto';

export class AcceptAiBreakdownDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionTaskDto)
  tasks!: CreateAmbitionTaskDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionMilestoneDto)
  milestones!: CreateAmbitionMilestoneDto[];
}

export class AiChatDto {
  @IsString()
  @MaxLength(4000)
  message!: string;
}
