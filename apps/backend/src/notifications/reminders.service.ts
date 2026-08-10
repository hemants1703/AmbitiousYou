import { Injectable, Logger } from '@nestjs/common';
import { and, eq, ne, sql } from 'drizzle-orm';
import { markOverdueAmbitionsMissed } from '../ambitions/ambition-status.util';
import { ambitions, db, milestones, notifications, settings, tasks, type Notification } from '../db';
import { PushService } from './push.service';

export type ReminderSlot = 'morning' | 'evening';

export interface ReminderSweepResult {
  usersScanned: number;
  usersInSlot: number;
  notificationsCreated: number;
  pushesAttempted: number;
  ambitionsMarkedMissed: number;
  slot: 'cron' | 'manual';
}

type DueMove = {
  kind: 'task' | 'milestone' | 'ambition';
  id: string;
  label: string;
  ambitionId: string;
  ambitionName: string;
  dueDate: Date | string;
};

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  /** Local hours (0–23) when scheduled reminder windows open. */
  static readonly MORNING_HOUR = 9;
  static readonly EVENING_HOUR = 18;

  constructor(private readonly pushService: PushService) {}

  /**
   * Cron entrypoint (GitHub Actions hourly).
   * Morning window: local hour >= 9 and < 18 (dedupe sends once).
   * Evening window: local hour >= 18 (again once; only still-incomplete / overdue items).
   */
  async runDueTodaySweep(now = new Date()): Promise<ReminderSweepResult> {
    // Global status hygiene first so overdue ambitions become `missed` even when
    // the owner has push reminders off (and before due-today queries run).
    const ambitionsMarkedMissed = await markOverdueAmbitionsMissed({ now });

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
      ambitionsMarkedMissed,
      slot: 'cron',
    };
    this.logger.log(`Due/overdue sweep: ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * Immediate sync when a user enables reminders (or refreshes).
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

    const createdForUser = await this.createDueOrOverdueForUser(userId, tz, resolvedSlot, now);
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

  /**
   * Cron: any hour in the morning window (9–17) → morning slot;
   * any hour from 18 onward → evening. Dedupe keys prevent repeats.
   */
  resolveCronSlot(timezone: string, now = new Date()): ReminderSlot | null {
    const hour = this.localHour(timezone, now);
    if (hour < 0) return null;
    if (hour >= RemindersService.EVENING_HOUR) return 'evening';
    if (hour >= RemindersService.MORNING_HOUR) return 'morning';
    return null;
  }

  resolveManualSlot(timezone: string, now = new Date()): ReminderSlot {
    const hour = this.localHour(timezone, now);
    if (hour >= RemindersService.EVENING_HOUR) return 'evening';
    return 'morning';
  }

  private async createDueOrOverdueForUser(userId: string, timezone: string, slot: ReminderSlot, now: Date): Promise<Notification[]> {
    const dayKey = this.localDayKey(timezone, now);
    const todayKey = dayKey;

    const dueTasks = await db
      .select({
        id: tasks.id,
        label: tasks.task,
        ambitionId: tasks.ambitionId,
        ambitionName: ambitions.ambitionName,
        dueDate: tasks.taskDeadline,
      })
      .from(tasks)
      .innerJoin(ambitions, eq(ambitions.id, tasks.ambitionId))
      .where(
        and(
          eq(tasks.userId, userId),
          eq(tasks.taskCompleted, false),
          // Due today OR overdue (past calendar days in the user's timezone).
          sql`((${tasks.taskDeadline} AT TIME ZONE 'UTC')::date <= (timezone(${timezone}, now()))::date)`,
        ),
      );

    const dueMilestones = await db
      .select({
        id: milestones.id,
        label: milestones.milestone,
        ambitionId: milestones.ambitionId,
        ambitionName: ambitions.ambitionName,
        dueDate: milestones.milestoneTargetDate,
      })
      .from(milestones)
      .innerJoin(ambitions, eq(ambitions.id, milestones.ambitionId))
      .where(and(eq(milestones.userId, userId), eq(milestones.milestoneCompleted, false), sql`((${milestones.milestoneTargetDate})::date <= (timezone(${timezone}, now()))::date)`));

    const dueAmbitions = await db
      .select({
        id: ambitions.id,
        label: ambitions.ambitionName,
        ambitionId: ambitions.id,
        ambitionName: ambitions.ambitionName,
        dueDate: ambitions.ambitionEndDate,
      })
      .from(ambitions)
      .where(
        and(
          eq(ambitions.userId, userId),
          eq(ambitions.ambitionStatus, 'active'),
          ne(ambitions.ambitionPercentageCompleted, 100),
          sql`((${ambitions.ambitionEndDate})::date <= (timezone(${timezone}, now()))::date)`,
        ),
      );

    const moves: DueMove[] = [
      ...dueTasks.map((row) => ({ kind: 'task' as const, ...row })),
      ...dueMilestones.map((row) => ({ kind: 'milestone' as const, ...row })),
      ...dueAmbitions.map((row) => ({ kind: 'ambition' as const, ...row })),
    ];

    const created: Notification[] = [];

    for (const move of moves) {
      const overdue = this.isOverdue(move.dueDate, todayKey);
      const copy = this.copyForMove(move.kind, slot, overdue);
      const type = move.kind === 'task' ? 'task_due_today' : move.kind === 'milestone' ? 'milestone_due_today' : 'ambition_due';
      const dedupeKind = move.kind === 'ambition' ? 'ambition_due' : `${move.kind}_due_today`;

      const row = await this.insertIfNew({
        userId,
        type,
        title: copy.title,
        body: move.kind === 'ambition' ? move.ambitionName : `${move.label} · ${move.ambitionName}`,
        href: `/ambitions/${move.ambitionId}`,
        ambitionId: move.ambitionId,
        resourceId: move.id,
        dedupeKey: `${dedupeKind}:${move.id}:${dayKey}:${slot}`,
      });
      if (row) created.push(row);
    }

    return created;
  }

  private copyForMove(kind: DueMove['kind'], slot: ReminderSlot, overdue: boolean): { title: string } {
    if (slot === 'evening') {
      if (kind === 'ambition') {
        return { title: overdue ? 'Ambition still overdue' : 'Ambition still due today' };
      }
      if (kind === 'milestone') {
        return { title: overdue ? 'Milestone still overdue' : 'Milestone still due today' };
      }
      return { title: overdue ? 'Still overdue' : 'Still due today' };
    }

    if (kind === 'ambition') {
      return { title: overdue ? 'Ambition overdue' : 'Ambition due today' };
    }
    if (kind === 'milestone') {
      return { title: overdue ? 'Milestone overdue' : 'Milestone due today' };
    }
    return { title: overdue ? 'Task overdue' : 'Task due today' };
  }

  /** Deadlines are stored as UTC calendar days; compare that to the user's local today. */
  private isOverdue(dueDate: Date | string, todayKey: string): boolean {
    const due = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (Number.isNaN(due.getTime())) return false;
    return due.toISOString().slice(0, 10) < todayKey;
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
