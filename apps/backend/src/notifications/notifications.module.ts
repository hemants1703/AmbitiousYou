import { Module } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { LoopModule } from '../loop/loop.module';
import { CronSecretGuard } from './cron-secret.guard';
import { EmailService } from './email.service';
import { InboxService } from './inbox.service';
import { NotificationsController } from './notifications.controller';
import { PushService } from './push.service';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [LoopModule],
  controllers: [NotificationsController, RemindersController],
  providers: [EmailService, InboxService, PushService, RemindersService, SessionGuard, CronSecretGuard],
  exports: [EmailService, InboxService, PushService, RemindersService],
})
export class NotificationsModule {}
