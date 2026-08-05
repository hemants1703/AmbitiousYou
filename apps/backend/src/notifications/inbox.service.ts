import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { db, notifications, type Notification } from '../db';

@Injectable()
export class InboxService {
  async listForUser(userId: string, limit = 30): Promise<Notification[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(safeLimit);
  }

  async unreadCount(userId: string): Promise<number> {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
    return row?.count ?? 0;
  }

  async markRead(userId: string, notificationId: string): Promise<Notification> {
    const [updated] = await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
      .returning();

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }
    return updated;
  }

  async markAllRead(userId: string): Promise<{ updated: number }> {
    const updated = await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)))
      .returning({ id: notifications.id });
    return { updated: updated.length };
  }
}
