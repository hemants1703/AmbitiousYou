import { Injectable, Logger } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { ambitions, db, milestones, notifications, settings, tasks, type Notification } from '../db';
import { PushService } from './push.service';

export type ReminderSlot = 'morning' | 'evening';

export interface ReminderSweepResult {
  usersScanned: number;
  usersInSlot: number;
  notificationsCreated: number;
  pushesAttempted: number;
  slot: 'cron' | 'manual';
}

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  /** Local hours (0–23) when scheduled reminders fire. */
  static readonly MORNING_HOUR = 9;
  static readonly EVENING_HOUR = 18;

  constructor(private readonly pushService: PushService) {}

  /**
   * Cron entrypoint (GitHub Actions hourly).
   * For each opted-in user, send only when their local time is 9:00 (morning)
   * or 18:00 (evening). Evening only reaches items still incomplete (same due-today query).
   */
  async runDueTodaySweep(now = new Date()): Promise<ReminderSweepResult> {
    const eligibleUsers = await db
      .select({
        userId: settings.userId,
        userTimezone: settings.userTimezone,
      })
      .from(settings)
      .where(eq(settings.pushAmbitionReminders, true));

    let usersInSlot = 0;
    let notificationsCreated = 0;
    let pushesAttempted = 0;

    for (const user of eligibleUsers) {
      const tz = this.sanitizeTimezone(user.userTimezone);
      const slot = this.resolveCronSlot(tz, now);
      if (!slot) {
        continue;
      }

      usersInSlot += 1;
      const result = await this.syncDueTodayForUser(user.userId, tz, true, slot, now);
      notificationsCreated += result.notificationsCreated;
      pushesAttempted += result.pushesAttempted;
    }

    const result: ReminderSweepResult = {
      usersScanned: eligibleUsers.length,
      usersInSlot,
      notificationsCreated,
      pushesAttempted,
      slot: 'cron',
    };
    this.logger.log(`Due-today sweep: ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * Immediate sync when a user enables reminders.
   * Uses morning before 18:00 local, evening at/after 18:00.
   */
  async syncDueTodayForUser(
    userId: string,
    userTimezone: string | null | undefined,
    sendPush: boolean,
    slot?: ReminderSlot,
    now = new Date(),
  ): Promise<{ notificationsCreated: number; pushesAttempted: number }> {
    const tz = this.sanitizeTimezone(userTimezone);
    const resolvedSlot = slot ?? this.resolveManualSlot(tz, now);
    if (!resolvedSlot) {
      return { notificationsCreated: 0, pushesAttempted: 0 };
    }

    const createdForUser = await this.createDueTodayForUser(userId, tz, resolvedSlot, now);
    let pushesAttempted = 0;

    if (sendPush) {
      for (const notification of createdForUser) {
        pushesAttempted += 1;
        await this.pushService.sendToUser(userId, {
          title: notification.title,
          body: notification.body,
          href: notification.href,
          tag: notification.dedupeKey,
        });
      }
    }

    return { notificationsCreated: createdForUser.length, pushesAttempted };
  }

  /** Exposed for tests. */
  resolveCronSlot(timezone: string, now = new Date()): ReminderSlot | null {
    const hour = this.localHour(timezone, now);
    if (hour === RemindersService.MORNING_HOUR) return 'morning';
    if (hour === RemindersService.EVENING_HOUR) return 'evening';
    return null;
  }

  /** Exposed for tests. */
  resolveManualSlot(timezone: string, now = new Date()): ReminderSlot {
    const hour = this.localHour(timezone, now);
    if (hour >= RemindersService.EVENING_HOUR) return 'evening';
    return 'morning';
  }

  private async createDueTodayForUser(
    userId: string,
    timezone: string,
    slot: ReminderSlot,
    now: Date,
  ): Promise<Notification[]> {
    const dayKey = this.localDayKey(timezone, now);
    const copy = this.copyForSlot(slot);

    const dueTasks = await db
      .select({
        id: tasks.id,
        task: tasks.task,
        ambitionId: tasks.ambitionId,
        ambitionName: ambitions.ambitionName,
      })
      .from(tasks)
      .innerJoin(ambitions, eq(ambitions.id, tasks.ambitionId))
      .where(
        and(
          eq(tasks.userId, userId),
          eq(tasks.taskCompleted, false),
          sql`((${tasks.taskDeadline} AT TIME ZONE 'UTC')::date = (timezone(${timezone}, now()))::date)`,
        ),
      );

    const dueMilestones = await db
      .select({
        id: milestones.id,
        milestone: milestones.milestone,
        ambitionId: milestones.ambitionId,
        ambitionName: ambitions.ambitionName,
      })
      .from(milestones)
      .innerJoin(ambitions, eq(ambitions.id, milestones.ambitionId))
      .where(
        and(
          eq(milestones.userId, userId),
          eq(milestones.milestoneCompleted, false),
          sql`((${milestones.milestoneTargetDate})::date = (timezone(${timezone}, now()))::date)`,
        ),
      );

    const created: Notification[] = [];

    for (const task of dueTasks) {
      const row = await this.insertIfNew({
        userId,
        type: 'task_due_today',
        title: copy.taskTitle,
        body: `${task.task} · ${task.ambitionName}`,
        href: `/ambitions/${task.ambitionId}`,
        ambitionId: task.ambitionId,
        resourceId: task.id,
        dedupeKey: `task_due_today:${task.id}:${dayKey}:${slot}`,
      });
      if (row) created.push(row);
    }

    for (const milestone of dueMilestones) {
      const row = await this.insertIfNew({
        userId,
        type: 'milestone_due_today',
        title: copy.milestoneTitle,
        body: `${milestone.milestone} · ${milestone.ambitionName}`,
        href: `/ambitions/${milestone.ambitionId}`,
        ambitionId: milestone.ambitionId,
        resourceId: milestone.id,
        dedupeKey: `milestone_due_today:${milestone.id}:${dayKey}:${slot}`,
      });
      if (row) created.push(row);
    }

    return created;
  }

  private copyForSlot(slot: ReminderSlot): { taskTitle: string; milestoneTitle: string } {
    if (slot === 'evening') {
      return {
        taskTitle: 'Still due today',
        milestoneTitle: 'Milestone still due today',
      };
    }
    return {
      taskTitle: 'Task due today',
      milestoneTitle: 'Milestone due today',
    };
  }

  private localHour(timezone: string, now: Date): number {
    try {
      const hourPart = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hourCycle: 'h23',
      })
        .formatToParts(now)
        .find((part) => part.type === 'hour');
      return Number(hourPart?.value ?? -1);
    } catch {
      return -1;
    }
  }

  private localDayKey(timezone: string, now: Date): string {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(now);
    } catch {
      return now.toISOString().slice(0, 10);
    }
  }

  private sanitizeTimezone(raw: string | null | undefined): string {
    const value = raw?.trim() || 'UTC';
    if (!/^[A-Za-z0-9_+\-\/]+$/.test(value)) {
      return 'UTC';
    }
    return value;
  }

  private async insertIfNew(values: {
    userId: string;
    type: string;
    title: string;
    body: string;
    href: string;
    ambitionId: string;
    resourceId: string;
    dedupeKey: string;
  }): Promise<Notification | null> {
    try {
      const [row] = await db.insert(notifications).values(values).returning();
      return row;
    } catch (error) {
      if ((error as { code?: string }).code === '23505') {
        return null;
      }
      throw error;
    }
  }
}
