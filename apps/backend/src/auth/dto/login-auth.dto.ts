import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @IsString()
  @IsNotEmpty()
  password: string = '';

  @IsString()
  @IsOptional()
  ipAddress: string = '';

  @IsString()
  @IsOptional()
  userAgent: string = '';
}
