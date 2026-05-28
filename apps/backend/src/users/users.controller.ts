import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<UserEntity | null> {
    return this.usersService.findOneById(id);
  }
}
