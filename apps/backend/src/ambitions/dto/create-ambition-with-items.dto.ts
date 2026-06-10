import { IsArray, IsOptional, Validate, ValidateNested, ValidatorConstraint, ValidatorConstraintInterface, type ValidationArguments } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { CreateNoteDto } from 'src/notes/dto/create-note.dto';
import { CreateMilestoneDto } from 'src/milestones/dto/create-milestone.dto';
import { CreateAmbitionDto } from './create-ambition.dto';

export class CreateAmbitionTaskDto extends OmitType(CreateTaskDto, ['ambitionId'] as const) {}

export class CreateAmbitionMilestoneDto extends OmitType(CreateMilestoneDto, ['ambitionId'] as const) {}

export class CreateAmbitionNoteDto extends OmitType(CreateNoteDto, ['ambitionId'] as const) {}

/**
 * An ambition is tracked by "moves" — a free mixture of tasks and/or milestones.
 * Both arrays are optional individually, but together they must contain at least one
 * item, otherwise the ambition has nothing to track. Attached to `tasks` (always
 * defined thanks to the `= []` default) so it runs even on a milestones-only payload.
 */
@ValidatorConstraint({ name: 'AtLeastOneMove', async: false })
class AtLeastOneMoveConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as CreateAmbitionWithItemsDto;
    return (dto.tasks?.length ?? 0) + (dto.milestones?.length ?? 0) >= 1;
  }

  defaultMessage(): string {
    return 'Add at least one move (a task or a milestone) to track this ambition';
  }
}

export class CreateAmbitionWithItemsDto extends CreateAmbitionDto {
  @Validate(AtLeastOneMoveConstraint)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionTaskDto)
  tasks: CreateAmbitionTaskDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAmbitionMilestoneDto)
  milestones: CreateAmbitionMilestoneDto[] = [];
}
