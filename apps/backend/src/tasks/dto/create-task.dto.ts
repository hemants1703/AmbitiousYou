import { NewTask } from '@ambitiousyou/shared';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsDateString()
  @IsNotEmpty()
  taskDeadline: Date = new Date();
}
