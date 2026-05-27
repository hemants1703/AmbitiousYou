import { NewUser } from '@ambitiousyou/shared/types';
import { IsString } from 'class-validator';

export class CreateUserDto implements NewUser {
  @IsString()
  name: string = '';

  @IsString()
  email: string = '';
}
