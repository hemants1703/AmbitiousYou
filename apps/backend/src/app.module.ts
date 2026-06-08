import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';
import { TasksModule } from './tasks/tasks.module';
import { MilestonesModule } from './milestones/milestones.module';
import { AmbitionsModule } from './ambitions/ambitions.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.local', '.env.development', '.env.production', '.env'] }),
    // Global default rate limit (100 req / minute / IP). Auth endpoints tighten
    // this further with @Throttle. Behind a proxy in prod, enable Express
    // `trust proxy` so the per-IP key reflects the real client.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    UsersModule,
    AuthModule,
    NotesModule,
    TasksModule,
    MilestonesModule,
    AmbitionsModule,
    SettingsModule,
    NotificationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
