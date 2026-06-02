import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SettingsService } from 'src/settings/settings.service';
import { SettingsEntity } from 'src/settings/entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity, SettingsEntity])],
  controllers: [UsersController],
  providers: [SessionGuard, UsersService, SettingsService],
  exports: [UsersService],
})
export class UsersModule {}
