import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SessionGuard } from './guards/session.guard';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionGuard],
})
export class AuthModule {}
