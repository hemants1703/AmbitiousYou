import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { SessionGuard } from '../auth/guards/session.guard';
import { db, settings, type Notification } from '../db';
import { eq } from 'drizzle-orm';
import { SubscribePushDto } from './dto/subscribe-push.dto';
import { UnsubscribePushDto } from './dto/unsubscribe-push.dto';
import { InboxService } from './inbox.service';
import { PushService } from './push.service';
import { RemindersService } from './reminders.service';

@Controller('notifications')
@UseGuards(SessionGuard)
export class NotificationsController {
  constructor(
    private readonly inboxService: InboxService,
    private readonly pushService: PushService,
    private readonly remindersService: RemindersService,
  ) {}

  @Get('vapid-public-key')
  getVapidPublicKey(): { publicKey: string | null } {
    return { publicKey: this.pushService.getPublicKey() };
  }

  @Get()
  async list(
    @CurrentUserId() userId: string,
    @Query('limit') limit?: string,
  ): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const parsedLimit = limit ? Number.parseInt(limit, 10) : 30;
    const [items, unreadCount] = await Promise.all([
      this.inboxService.listForUser(userId, Number.isFinite(parsedLimit) ? parsedLimit : 30),
      this.inboxService.unreadCount(userId),
    ]);
    return { notifications: items, unreadCount };
  }

  @Get('unread-count')
  async unreadCount(@CurrentUserId() userId: string): Promise<{ unreadCount: number }> {
    return { unreadCount: await this.inboxService.unreadCount(userId) };
  }

  @Patch('read-all')
  async markAllRead(@CurrentUserId() userId: string): Promise<{ updated: number }> {
    return await this.inboxService.markAllRead(userId);
  }

  @Patch(':notificationId/read')
  async markRead(@CurrentUserId() userId: string, @Param('notificationId') notificationId: string): Promise<Notification> {
    return await this.inboxService.markRead(userId, notificationId);
  }

  @Post('push/subscribe')
  async subscribe(
    @CurrentUserId() userId: string,
    @Body() body: SubscribePushDto,
    @Headers('user-agent') userAgent?: string,
  ): Promise<{ ok: true }> {
    await this.pushService.upsertSubscription(userId, {
      ...body,
      userAgent: body.userAgent ?? userAgent,
    });
    return { ok: true };
  }

  @Post('push/unsubscribe')
  async unsubscribe(@CurrentUserId() userId: string, @Body() body: UnsubscribePushDto): Promise<{ ok: true }> {
    await this.pushService.revokeSubscription(userId, body.endpoint);
    return { ok: true };
  }

  @Post('reminders/sync')
  async syncDueToday(@CurrentUserId() userId: string): Promise<{ notificationsCreated: number; pushesAttempted: number }> {
    const [row] = await db
      .select({ userTimezone: settings.userTimezone, pushAmbitionReminders: settings.pushAmbitionReminders })
      .from(settings)
      .where(eq(settings.userId, userId))
      .limit(1);

    if (!row?.pushAmbitionReminders) {
      return { notificationsCreated: 0, pushesAttempted: 0 };
    }

    return await this.remindersService.syncDueTodayForUser(userId, row.userTimezone, true);
  }
}
