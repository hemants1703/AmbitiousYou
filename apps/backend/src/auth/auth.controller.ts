import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Session } from '@ambitiousyou/shared/types';
import { AuthService } from './auth.service';
import { CurrentSession } from './decorators/current-session.decorator';
import { CurrentUserId } from './decorators/current-user-id.decorator';
import { LoginUserDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-auth.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordResetDto } from './dto/forgot-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SessionGuard } from './guards/session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<{ sessionToken: string }> {
    return await this.authService.registerUser(registerUserDto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<{ sessionToken: string }> {
    return await this.authService.loginUser(loginUserDto);
  }

  // POST (not GET) so the action is CSRF-resistant — a cross-site top-level
  // navigation can't force a logout.
  @UseGuards(SessionGuard)
  @Post('/logout')
  async logoutUser(@CurrentSession() session: Session): Promise<void> {
    await this.authService.logoutUser(session.token);
  }

  @UseGuards(SessionGuard)
  @Get('/sessions')
  async getUserSessions(@CurrentUserId() userId: string): Promise<Session[]> {
    return await this.authService.getUserSessions(userId);
  }

  // --- Email verification ---------------------------------------------------

  @Post('/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<{ success: true }> {
    return await this.authService.verifyEmailToken(verifyEmailDto.token);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @UseGuards(SessionGuard)
  @Post('/verify-email/resend')
  async resendVerification(@CurrentUserId() userId: string): Promise<{ success: true }> {
    return await this.authService.resendVerification(userId);
  }

  // --- Password reset -------------------------------------------------------

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('/forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ success: true }> {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('/forgot-password/reset')
  async forgotPasswordReset(@Body() forgotPasswordResetDto: ForgotPasswordResetDto): Promise<{ success: true }> {
    return await this.authService.forgotPasswordReset(forgotPasswordResetDto.token, forgotPasswordResetDto.password);
  }

  @UseGuards(SessionGuard)
  @Post('/reset-password')
  async resetPassword(@CurrentUserId() userId: string, @Body() resetPasswordDto: ResetPasswordDto): Promise<{ success: true; signedOut: boolean }> {
    return await this.authService.resetPassword(userId, resetPasswordDto.newPassword, resetPasswordDto.signOutAllDevices);
  }
}
