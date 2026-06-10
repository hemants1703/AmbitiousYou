import { NewTask } from '@ambitiousyou/shared';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto implements NewTask {
  @IsString()
  @IsNotEmpty()
  ambitionId: string = '';

  @IsString()
  @IsNotEmpty()
  @MaxLength(255, { message: 'task must be 255 characters or fewer' })
  task: string = '';

  @IsString()
  @IsOptional()
  taskDescription: string = '';

  @IsBoolean()
  taskCompleted: boolean = false;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  taskDeadline: Date = new Date();
}
