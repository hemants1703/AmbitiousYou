import { NewTask } from '@ambitiousyou/shared';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto implements NewTask {
  @IsString()
  @IsNotEmpty()
  userId: string = '';

  @IsString()
  @IsNotEmpty()
  ambitionId: string = '';

  @IsString()
  @IsNotEmpty()
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
