import { ArrayMinSize, IsArray, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { CreateMilestoneDto } from 'src/milestones/dto/create-milestone.dto';
import { CreateAmbitionDto } from './create-ambition.dto';

export class CreateAmbitionTaskDto extends OmitType(CreateTaskDto, ['userId', 'ambitionId'] as const) {}

export class CreateAmbitionMilestoneDto extends OmitType(CreateMilestoneDto, ['userId', 'ambitionId'] as const) {}

export class CreateAmbitionNoteDto extends OmitType(CreateNoteDto, ['ambitionId'] as const) {}

export class CreateAmbitionWithItemsDto extends CreateAmbitionDto {
  @ValidateIf((o: CreateAmbitionDto) => o.ambitionTrackingMethod === 'task')
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionTaskDto)
  tasks?: CreateAmbitionTaskDto[];

  @ValidateIf((o: CreateAmbitionDto) => o.ambitionTrackingMethod === 'milestone')
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionMilestoneDto)
  milestones?: CreateAmbitionMilestoneDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionNoteDto)
  @IsOptional()
  notes?: CreateAmbitionNoteDto[];
}
