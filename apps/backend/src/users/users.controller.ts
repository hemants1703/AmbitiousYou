import { Controller, Get, Headers, Request, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(SessionGuard)
  @Get()
  findUserFromSessionToken(@Headers('Authorization') authorization: string): Promise<UserEntity | null> {
    const token = authorization.replace(/^Bearer\s+/i, '');
    return this.usersService.findUserBySessionToken(token);
  }
}
