import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/setting.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { SessionEntity } from 'src/auth/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity, UserEntity, SessionEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
