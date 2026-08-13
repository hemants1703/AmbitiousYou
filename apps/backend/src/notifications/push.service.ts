import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import * as webpush from 'web-push';
import { db, pushSubscriptions } from '../db';
import type { SubscribePushDto } from './dto/subscribe-push.dto';

export interface PushPayload {
  title: string;
  body: string;
  href: string;
  tag?: string;
}

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);
  private configured = false;

  onModuleInit(): void {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT ?? 'mailto:support@ambitiousyou.pro';

    if (!publicKey || !privateKey) {
      this.logger.warn('VAPID keys missing — Web Push delivery is disabled until VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY are set.');
      return;
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);
    this.configured = true;
  }

  getPublicKey(): string | null {
    return process.env.VAPID_PUBLIC_KEY ?? null;
  }

  isConfigured(): boolean {
    return this.configured;
  }

  async upsertSubscription(userId: string, dto: SubscribePushDto): Promise<void> {
    const expirationTime = typeof dto.expirationTime === 'number' ? new Date(dto.expirationTime) : null;

    const [existing] = await db.select({ id: pushSubscriptions.id }).from(pushSubscriptions).where(eq(pushSubscriptions.endpoint, dto.endpoint)).limit(1);

    if (existing) {
      await db
        .update(pushSubscriptions)
        .set({
          userId,
          p256dh: dto.keys.p256dh,
          auth: dto.keys.auth,
          userAgent: dto.userAgent ?? null,
          expirationTime,
          revokedAt: null,
        })
        .where(eq(pushSubscriptions.id, existing.id));
      return;
    }

    await db.insert(pushSubscriptions).values({
      userId,
      endpoint: dto.endpoint,
      p256dh: dto.keys.p256dh,
      auth: dto.keys.auth,
      userAgent: dto.userAgent ?? null,
      expirationTime,
    });
  }

  async revokeSubscription(userId: string, endpoint: string): Promise<void> {
    await db
      .update(pushSubscriptions)
      .set({ revokedAt: new Date() })
      .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));
  }

  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    if (!this.configured) {
      this.logger.warn(`Skipping push for user ${userId}: VAPID is not configured`);
      return;
    }

    const rows = await db
      .select()
      .from(pushSubscriptions)
      .where(and(eq(pushSubscriptions.userId, userId), isNull(pushSubscriptions.revokedAt)));

    if (rows.length === 0) {
      this.logger.warn(`Skipping push for user ${userId}: no active push subscriptions`);
      return;
    }

    const body = JSON.stringify(payload);

    await Promise.all(
      rows.map(async (row) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: row.endpoint,
              keys: { p256dh: row.p256dh, auth: row.auth },
            },
            body,
          );
        } catch (error) {
          const statusCode = (error as { statusCode?: number }).statusCode;
          if (statusCode === 404 || statusCode === 410) {
            await db.update(pushSubscriptions).set({ revokedAt: new Date() }).where(eq(pushSubscriptions.id, row.id));
            return;
          }
          this.logger.warn(`Push send failed for subscription ${row.id}: ${(error as Error).message}`);
        }
      }),
    );
  }
}
