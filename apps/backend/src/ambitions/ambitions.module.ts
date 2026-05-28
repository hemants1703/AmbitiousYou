import { Module } from '@nestjs/common';
import { AmbitionsService } from './ambitions.service';
import { AmbitionsController } from './ambitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmbitionEntity } from './entities/ambition.entity';
import { SessionEntity } from 'src/auth/entities/session.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { SessionGuard } from 'src/auth/guards/session.guard';

@Module({
  imports: [TypeOrmModule.forFeature([AmbitionEntity, SessionEntity, UserEntity])],
  controllers: [AmbitionsController],
  providers: [AmbitionsService, SessionGuard],
  exports: [AmbitionEntity],
})
export class AmbitionsModule {}
