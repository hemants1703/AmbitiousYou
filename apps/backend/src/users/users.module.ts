import { Module } from '@nestjs/common';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SettingsService } from 'src/settings/settings.service';

@Module({
  controllers: [UsersController],
  providers: [SessionGuard, UsersService, SettingsService],
  exports: [UsersService],
})
export class UsersModule {}
