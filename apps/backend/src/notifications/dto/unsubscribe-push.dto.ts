import { IsNotEmpty, IsString } from 'class-validator';

export class UnsubscribePushDto {
  @IsString()
  @IsNotEmpty()
  endpoint!: string;
}
