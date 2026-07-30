import { Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import type { User } from '@ambitiousyou/shared/types';
import { SessionGuard } from '../auth/guards/session.guard';
import { UsersService } from './users.service';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get()
  findUser(@CurrentUserId() userId: string): Promise<User | null> {
    return this.usersService.findUser(userId);
  }
}
