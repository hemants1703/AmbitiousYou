import { NewUser } from '@ambitiousyou/shared/types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterAuthDto implements NewUser {
  @IsString()
  @IsNotEmpty()
  name: string = '';

  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString()
  @IsNotEmpty()
  password: string = '';
}
