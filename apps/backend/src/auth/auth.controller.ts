import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { Session } from '@ambitiousyou/shared/types';
import { AuthService } from './auth.service';
import { CurrentSession } from './decorators/current-session.decorator';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { SessionEntity } from './entities/session.entity';
import { SessionGuard } from './guards/session.guard';
import { CurrentUserId } from './decorators/current-user-id.decorator';

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
  async logoutUser(@CurrentSession() session: Session): Promise<void> {
    await this.authService.logoutUser(session.token);
  }

  @UseGuards(SessionGuard)
  @Get('/sessions')
  async getUserSessions(@CurrentUserId() userId: string): Promise<SessionEntity[]> {
    return await this.authService.getUserSessions(userId);
  }
}
