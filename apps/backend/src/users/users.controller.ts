import { Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import type { User } from '@ambitiousyou/shared/types';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get()
  findUserFromSessionToken(@Headers('Authorization') authorization: string): Promise<User | null> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    return this.usersService.findUserBySessionToken(token);
  }
}
