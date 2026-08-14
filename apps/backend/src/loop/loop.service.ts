import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { recalculateAmbitionProgress } from '../ambitions/ambition-progress.util';
import {
  ambitions,
  dailyContracts,
  db,
  milestones,
  settings,
  tasks,
  weeklyReviews,
  type Ambition,
  type DailyContract,
} from '../db';
import type { AttentionCoachPayload, ContractPayload, MissedDayPayload, PrimaryAmbitionPayload, SuggestedMove, WeeklyReviewPayload } from '../types/api';
import { UpsertContractDto } from './dto/upsert-contract.dto';
import { UpsertWeeklyReviewDto } from './dto/upsert-weekly-review.dto';

@Injectable()
export class LoopService {
  async getContract(userId: string, dateKey?: string): Promise<ContractPayload> {
    const timezone = await this.getUserTimezone(userId);
    const localDate = dateKey ?? this.localDayKey(timezone);

    const [row] = await db
      .select()
      .from(dailyContracts)
      .where(and(eq(dailyContracts.userId, userId), eq(dailyContracts.localDate, localDate)))
      .limit(1);

    const primary = await this.getPrimaryAmbition(userId);
    const suggestedMove = primary ? await this.suggestMove(userId, primary.id) : null;

    if (!row) {
      return {
        contract: null,
        localDate,
        primaryAmbition: primary,
        suggestedMove,
        move: suggestedMove,
      };
    }

    const move = await this.resolveMoveDetails(userId, row.moveKind, row.moveId);
    return {
      contract: row,
      localDate,
      primaryAmbition: primary,
      suggestedMove,
      move,
    };
  }

  async getPrimary(userId: string): Promise<PrimaryAmbitionPayload> {
    const primary = await this.getPrimaryAmbition(userId);
    const suggestedMove = primary ? await this.suggestMove(userId, primary.id) : null;
    return { primaryAmbition: primary, suggestedMove };
  }

  async getCurrentWeeklyReview(userId: string): Promise<WeeklyReviewPayload> {
    const timezone = await this.getUserTimezone(userId);
    const weekStartDate = this.weekStartDateKey(timezone);
    const [review] = await db
      .select()
      .from(weeklyReviews)
      .where(and(eq(weeklyReviews.userId, userId), eq(weeklyReviews.weekStartDate, weekStartDate)))
      .limit(1);

    return {
      review: review ?? null,
      weekStartDate,
      title: `Weekly review ${weekStartDate}`,
    };
  }

  async upsertWeeklyReview(userId: string, dto: UpsertWeeklyReviewDto): Promise<WeeklyReviewPayload> {
    const timezone = await this.getUserTimezone(userId);
    const weekStartDate = dto.weekStartDate ?? this.weekStartDateKey(timezone);
    const primary = await this.getPrimaryAmbition(userId);

    if (!primary) {
      throw new BadRequestException('Set a primary ambition before writing a weekly review');
    }

    const [review] = await db
      .insert(weeklyReviews)
      .values({
        userId,
        ambitionId: primary.id,
        weekStartDate,
        moved: dto.moved,
        stalled: dto.stalled,
        skipReason: dto.skipReason ?? null,
        nextWeekContract: dto.nextWeekContract,
      })
      .onConflictDoUpdate({
        target: [weeklyReviews.userId, weeklyReviews.weekStartDate],
        set: {
          ambitionId: primary.id,
          moved: dto.moved,
          stalled: dto.stalled,
          skipReason: dto.skipReason ?? null,
          nextWeekContract: dto.nextWeekContract,
        },
      })
      .returning();

    return {
      review,
      weekStartDate,
      title: `Weekly review ${weekStartDate}`,
    };
  }

  async getAttentionCoach(userId: string): Promise<AttentionCoachPayload> {
    const primary = await this.getPrimaryAmbition(userId);
    if (!primary) {
      return {
        primaryAmbition: null,
        daysSinceLastCompletedMove: null,
        daysUntilEndDate: null,
        nextMilestoneTitle: null,
        proposedAction: null,
        summary: 'Favourite one active ambition to get coaching.',
      };
    }

    const timezone = await this.getUserTimezone(userId);
    const todayKey = this.localDayKey(timezone);
    const daysUntilEndDate = this.daysBetween(todayKey, this.localDayKey(timezone, new Date(primary.ambitionEndDate)));
    const daysSinceLastCompletedMove = await this.daysSinceLastCompletedMove(userId, primary.id, todayKey);

    const suggestedMove = await this.suggestMove(userId, primary.id);
    const nextMilestoneTitle =
      suggestedMove?.kind === 'milestone' ? suggestedMove.title : await this.nextMilestoneTitle(userId, primary.id);
    const proposedAction = suggestedMove ? `${suggestedMove.title} (20 min)` : null;

    const parts: string[] = [];
    if (daysSinceLastCompletedMove !== null && daysSinceLastCompletedMove > 0) {
      parts.push(`No completed move on ${primary.ambitionName} in ${daysSinceLastCompletedMove} day${daysSinceLastCompletedMove === 1 ? '' : 's'}`);
    }
    if (daysUntilEndDate !== null) {
      parts.push(`end date ${daysUntilEndDate} day${daysUntilEndDate === 1 ? '' : 's'} out`);
    }
    if (nextMilestoneTitle) {
      parts.push(`next milestone: ${nextMilestoneTitle}`);
    }
    if (proposedAction) {
      parts.push(`contract for tomorrow: ${proposedAction}`);
    }

    const summary = parts.length > 0 ? parts.join('; ') + '.' : `Keep momentum on ${primary.ambitionName}.`;

    return {
      primaryAmbition: primary,
      daysSinceLastCompletedMove,
      daysUntilEndDate,
      nextMilestoneTitle,
      proposedAction,
      summary,
    };
  }

  async getMissedDay(userId: string): Promise<MissedDayPayload> {
    const timezone = await this.getUserTimezone(userId);
    const todayKey = this.localDayKey(timezone);
    const yesterdayKey = this.addDays(todayKey, -1);

    const [yesterdayContract] = await db
      .select()
      .from(dailyContracts)
      .where(
        and(eq(dailyContracts.userId, userId), eq(dailyContracts.localDate, yesterdayKey), eq(dailyContracts.status, 'active')),
      )
      .limit(1);

    return {
      missedYesterday: Boolean(yesterdayContract),
      yesterdayContract: yesterdayContract ?? null,
    };
  }

  async restartTomorrow(userId: string): Promise<ContractPayload> {
    const timezone = await this.getUserTimezone(userId);
    const todayKey = this.localDayKey(timezone);
    const tomorrowKey = this.addDays(todayKey, 1);
    const primary = await this.getPrimaryAmbition(userId);

    if (!primary) {
      throw new BadRequestException('Set a primary ambition before scheduling a restart');
    }

    const suggestedMove = await this.suggestMove(userId, primary.id);
    if (!suggestedMove) {
      throw new BadRequestException('No open move on your primary ambition to restart with');
    }

    await db
      .insert(dailyContracts)
      .values({
        userId,
        ambitionId: primary.id,
        moveKind: suggestedMove.kind,
        moveId: suggestedMove.id,
        localDate: tomorrowKey,
        status: 'active',
        thenAction: '10-minute restart',
      })
      .onConflictDoUpdate({
        target: [dailyContracts.userId, dailyContracts.localDate],
        set: {
          ambitionId: primary.id,
          moveKind: suggestedMove.kind,
          moveId: suggestedMove.id,
          status: 'active',
          thenAction: '10-minute restart',
        },
      });

    return this.getContract(userId, todayKey);
  }

  async upsertContract(userId: string, dto: UpsertContractDto): Promise<ContractPayload> {
    const timezone = await this.getUserTimezone(userId);
    const localDate = dto.localDate ?? this.localDayKey(timezone);

    const primary = await this.getPrimaryAmbition(userId);
    if (!primary) {
      throw new BadRequestException('Set a primary ambition before creating a contract');
    }

    const move = await this.resolveMoveForAmbition(userId, primary.id, dto.moveKind, dto.moveId);
    if (!move) {
      throw new BadRequestException('Move not found on primary ambition');
    }

    const [contract] = await db
      .insert(dailyContracts)
      .values({
        userId,
        ambitionId: primary.id,
        moveKind: dto.moveKind,
        moveId: dto.moveId,
        localDate,
        status: 'active',
        ifTrigger: dto.ifTrigger ?? null,
        thenAction: dto.thenAction ?? null,
      })
      .onConflictDoUpdate({
        target: [dailyContracts.userId, dailyContracts.localDate],
        set: {
          ambitionId: primary.id,
          moveKind: dto.moveKind,
          moveId: dto.moveId,
          status: 'active',
          ifTrigger: dto.ifTrigger ?? null,
          thenAction: dto.thenAction ?? null,
        },
      })
      .returning();

    const moveDetails = await this.resolveMoveDetails(userId, contract.moveKind, contract.moveId);
    const suggestedMove = await this.suggestMove(userId, primary.id);

    return {
      contract,
      localDate,
      primaryAmbition: primary,
      suggestedMove,
      move: moveDetails,
    };
  }

  async completeContract(userId: string, contractId: string): Promise<ContractPayload> {
    const contract = await this.findOwnedContract(userId, contractId);

    await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(dailyContracts)
        .set({ status: 'completed' })
        .where(eq(dailyContracts.id, contract.id))
        .returning();

      if (updated.moveKind === 'task') {
        await tx
          .update(tasks)
          .set({ taskCompleted: true, taskCompletedAt: new Date() })
          .where(and(eq(tasks.id, updated.moveId), eq(tasks.userId, userId)));
      } else {
        await tx
          .update(milestones)
          .set({ milestoneCompleted: true, milestoneCompletedAt: new Date() })
          .where(and(eq(milestones.id, updated.moveId), eq(milestones.userId, userId)));
      }

      await recalculateAmbitionProgress(tx, { userId, ambitionId: updated.ambitionId });
    });

    return this.getContract(userId, contract.localDate);
  }

  async snoozeContract(userId: string, contractId: string): Promise<ContractPayload> {
    const contract = await this.findOwnedContract(userId, contractId);
    const timezone = await this.getUserTimezone(userId);
    const tomorrow = this.addDays(contract.localDate, 1);

    await db.transaction(async (tx) => {
      await tx.update(dailyContracts).set({ status: 'snoozed' }).where(eq(dailyContracts.id, contract.id));

      await tx
        .insert(dailyContracts)
        .values({
          userId,
          ambitionId: contract.ambitionId,
          moveKind: contract.moveKind,
          moveId: contract.moveId,
          localDate: tomorrow,
          status: 'active',
          ifTrigger: contract.ifTrigger,
          thenAction: contract.thenAction,
        })
        .onConflictDoUpdate({
          target: [dailyContracts.userId, dailyContracts.localDate],
          set: {
            ambitionId: contract.ambitionId,
            moveKind: contract.moveKind,
            moveId: contract.moveId,
            status: 'active',
            ifTrigger: contract.ifTrigger,
            thenAction: contract.thenAction,
          },
        });
    });

    return this.getContract(userId, this.localDayKey(timezone));
  }

  async getPrimaryAmbition(userId: string): Promise<Ambition | null> {
    const [row] = await db
      .select()
      .from(ambitions)
      .where(and(eq(ambitions.userId, userId), eq(ambitions.isFavourited, true), eq(ambitions.ambitionStatus, 'active')))
      .limit(1);
    return row ?? null;
  }

  private async findOwnedContract(userId: string, contractId: string): Promise<DailyContract> {
    const [contract] = await db
      .select()
      .from(dailyContracts)
      .where(and(eq(dailyContracts.id, contractId), eq(dailyContracts.userId, userId)))
      .limit(1);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }

  private async suggestMove(userId: string, ambitionId: string): Promise<SuggestedMove | null> {
    const [milestone] = await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.userId, userId), eq(milestones.ambitionId, ambitionId), eq(milestones.milestoneCompleted, false)))
      .orderBy(asc(milestones.milestoneTargetDate))
      .limit(1);

    if (milestone) {
      return {
        kind: 'milestone',
        id: milestone.id,
        title: milestone.milestone,
        description: milestone.milestoneDescription,
        date: milestone.milestoneTargetDate,
      };
    }

    const [task] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.ambitionId, ambitionId), eq(tasks.taskCompleted, false)))
      .orderBy(asc(tasks.taskDeadline))
      .limit(1);

    if (!task) {
      return null;
    }

    return {
      kind: 'task',
      id: task.id,
      title: task.task,
      description: task.taskDescription,
      date: task.taskDeadline,
    };
  }

  private async resolveMoveForAmbition(userId: string, ambitionId: string, moveKind: 'task' | 'milestone', moveId: string) {
    if (moveKind === 'task') {
      const [row] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, moveId), eq(tasks.userId, userId), eq(tasks.ambitionId, ambitionId)))
        .limit(1);
      return row ?? null;
    }

    const [row] = await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.id, moveId), eq(milestones.userId, userId), eq(milestones.ambitionId, ambitionId)))
      .limit(1);
    return row ?? null;
  }

  async getContractMoveTitle(userId: string, contract: DailyContract): Promise<string> {
    const move = await this.resolveMoveDetails(userId, contract.moveKind, contract.moveId);
    return move?.title ?? 'your move';
  }

  private async resolveMoveDetails(userId: string, moveKind: 'task' | 'milestone', moveId: string): Promise<SuggestedMove | null> {
    if (moveKind === 'task') {
      const [task] = await db
        .select()
        .from(tasks)
        .where(and(eq(tasks.id, moveId), eq(tasks.userId, userId)))
        .limit(1);
      if (!task) return null;
      return {
        kind: 'task',
        id: task.id,
        title: task.task,
        description: task.taskDescription,
        date: task.taskDeadline,
      };
    }

    const [milestone] = await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.id, moveId), eq(milestones.userId, userId)))
      .limit(1);
    if (!milestone) return null;
    return {
      kind: 'milestone',
      id: milestone.id,
      title: milestone.milestone,
      description: milestone.milestoneDescription,
      date: milestone.milestoneTargetDate,
    };
  }

  private async getUserTimezone(userId: string): Promise<string> {
    const [row] = await db.select({ userTimezone: settings.userTimezone }).from(settings).where(eq(settings.userId, userId)).limit(1);
    return this.sanitizeTimezone(row?.userTimezone);
  }

  private weekStartDateKey(timezone: string, now = new Date()): string {
    const local = this.localDayKey(timezone, now);
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(now);
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dayIndex = map[weekday] ?? 0;
    const daysFromMonday = (dayIndex + 6) % 7;
    return this.addDays(local, -daysFromMonday);
  }

  private daysBetween(fromKey: string, toKey: string): number {
    const from = new Date(`${fromKey}T12:00:00.000Z`).getTime();
    const to = new Date(`${toKey}T12:00:00.000Z`).getTime();
    return Math.round((to - from) / (24 * 60 * 60 * 1000));
  }

  private async daysSinceLastCompletedMove(userId: string, ambitionId: string, todayKey: string): Promise<number | null> {
    const [lastTask] = await db
      .select({ completedAt: tasks.taskCompletedAt })
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.ambitionId, ambitionId), eq(tasks.taskCompleted, true)))
      .orderBy(desc(tasks.taskCompletedAt))
      .limit(1);

    const [lastMilestone] = await db
      .select({ completedAt: milestones.milestoneCompletedAt })
      .from(milestones)
      .where(and(eq(milestones.userId, userId), eq(milestones.ambitionId, ambitionId), eq(milestones.milestoneCompleted, true)))
      .orderBy(desc(milestones.milestoneCompletedAt))
      .limit(1);

    const timestamps = [lastTask?.completedAt, lastMilestone?.completedAt].filter((value): value is Date => value instanceof Date);
    if (timestamps.length === 0) {
      return null;
    }

    const latest = timestamps.reduce((max, value) => (value.getTime() > max.getTime() ? value : max));
    const completedKey = latest.toISOString().slice(0, 10);
    return Math.max(0, this.daysBetween(completedKey, todayKey));
  }

  private async nextMilestoneTitle(userId: string, ambitionId: string): Promise<string | null> {
    const [milestone] = await db
      .select({ title: milestones.milestone })
      .from(milestones)
      .where(and(eq(milestones.userId, userId), eq(milestones.ambitionId, ambitionId), eq(milestones.milestoneCompleted, false)))
      .orderBy(asc(milestones.milestoneTargetDate))
      .limit(1);
    return milestone?.title ?? null;
  }

  localDayKey(timezone: string, now = new Date()): string {
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

  private addDays(dateKey: string, days: number): string {
    const date = new Date(`${dateKey}T12:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  private sanitizeTimezone(raw: string | null | undefined): string {
    const value = raw?.trim() || 'UTC';
    if (!/^[A-Za-z0-9_+\-/]+$/.test(value)) {
      return 'UTC';
    }
    return value;
  }

  /** Used by reminders (Wave 2) and restart flow. */
  async findActiveContractForLocalDate(userId: string, localDate: string): Promise<DailyContract | null> {
    const [row] = await db
      .select()
      .from(dailyContracts)
      .where(and(eq(dailyContracts.userId, userId), eq(dailyContracts.localDate, localDate), eq(dailyContracts.status, 'active')))
      .limit(1);
    return row ?? null;
  }

  async findIncompleteContractForLocalDate(userId: string, localDate: string): Promise<DailyContract | null> {
    const [row] = await db
      .select()
      .from(dailyContracts)
      .where(
        and(
          eq(dailyContracts.userId, userId),
          eq(dailyContracts.localDate, localDate),
          sql`${dailyContracts.status} IN ('active', 'snoozed')`,
        ),
      )
      .limit(1);
    return row ?? null;
  }
}
