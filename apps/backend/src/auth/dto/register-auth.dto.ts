import type { NewUser } from '@ambitiousyou/shared/types';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto implements NewUser {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string = '';

  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter and one number and can include special characters @$!%*?&',
  })
  password: string = '';
}
