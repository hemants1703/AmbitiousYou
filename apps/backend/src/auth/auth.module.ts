import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SessionEntity } from './entities/session.entity';
import { VerificationEntity } from './entities/verification.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([SessionEntity, VerificationEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
