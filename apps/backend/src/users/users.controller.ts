import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(SessionGuard)
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<UserEntity | null> {
    return this.usersService.findOneById(id);
  }
}
