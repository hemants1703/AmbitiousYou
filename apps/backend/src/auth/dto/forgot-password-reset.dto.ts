import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ForgotPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  token: string = '';

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain at least one letter and one number and can include special characters @$!%*?&',
  })
  password: string = '';
}
