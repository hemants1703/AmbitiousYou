import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString()
  @IsNotEmpty()
  password: string = '';

  @IsString()
  ipAddress: string | null = null;

  @IsString()
  userAgent: string | null = null;
}
