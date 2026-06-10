import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Standalone on purpose: extending PartialType(CreateTaskDto) pulled in `ambitionId`
// (which defaults to '') and failed @IsNotEmpty on every update, since the update body
// never resends it. A task update only touches the fields below.
export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'task must be 255 characters or fewer' })
  task: string = '';

  @IsString()
  @IsOptional()
  taskDescription?: string;

  @IsBoolean()
  taskCompleted: boolean = false;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  taskDeadline: Date = new Date();
}
