import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { SessionGuard } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<{ sessionToken: string }> {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ sessionToken: string }> {
    return await this.authService.loginUser(loginUserDto);
  }

  @UseGuards(SessionGuard)
  @Get('/logout')
  async logoutUser(@Headers('authorization') authorization: string): Promise<void> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    await this.authService.logoutUser(token);
  }
}
