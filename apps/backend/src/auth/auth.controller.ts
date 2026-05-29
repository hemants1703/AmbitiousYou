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
  @Get()
  async getUserIdBySessionToken(@Headers('Authorization') authorization: string): Promise<string | null> {
    const sessionToken = authorization.split(' ')[1];
    return await this.authService.findUserIdFromSessionToken(sessionToken);
  }
}
