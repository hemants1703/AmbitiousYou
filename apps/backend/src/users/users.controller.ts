import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import type { User } from '../db';
import { SessionGuard } from '../auth/guards/session.guard';
import { UsersService } from './users.service';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get()
  findUser(@CurrentUserId() userId: string): Promise<User | null> {
    return this.usersService.findUser(userId);
  }

  @UseGuards(SessionGuard)
  @Patch()
  updateUser(@CurrentUserId() userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.updateUser(userId, updateUserDto);
  }
}
