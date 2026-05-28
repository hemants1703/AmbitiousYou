import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  controllers: [UsersController],
  providers: [UsersService, SessionGuard],
  exports: [UsersService, UserEntity],
})
export class UsersModule {}
