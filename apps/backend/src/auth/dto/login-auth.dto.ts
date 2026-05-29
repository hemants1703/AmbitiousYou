import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  password: string = '';

  @IsString({ message: 'IP address must be a string' })
  @IsOptional()
  ipAddress: string = '';

  @IsString({ message: 'User agent must be a string' })
  @IsOptional()
  userAgent: string = '';
}
