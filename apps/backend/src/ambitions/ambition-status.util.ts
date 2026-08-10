import { BadRequestException } from '@nestjs/common';
import { and, eq, lt, sql, type SQL } from 'drizzle-orm';
import type { Tx } from '../db';
import { ambitions, db } from '../db';

export function startOfDay(value: Date | string): Date {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

type AmbitionWindowRow = {
  id: string;
  ambitionStatus: 'active' | 'completed' | 'missed';
  ambitionEndDate: Date;
};

/** True when new moves must not be added (missed, or end date before today while not completed). */
export function isAmbitionWindowClosed(ambition: Pick<AmbitionWindowRow, 'ambitionStatus' | 'ambitionEndDate'>, now = new Date()): boolean {
  if (ambition.ambitionStatus === 'completed') {
    return false;
  }
  if (ambition.ambitionStatus === 'missed') {
    return true;
  }
  return startOfDay(ambition.ambitionEndDate).getTime() < startOfDay(now).getTime();
}

/**
 * Reject create-move when the ambition window is closed. If status is still `active`
 * but the end date has passed, persist `missed` first so list/revive UI catch up.
 */
export async function assertAmbitionAcceptsNewMoves(tx: Tx, ambition: AmbitionWindowRow, now = new Date()): Promise<void> {
  if (!isAmbitionWindowClosed(ambition, now)) {
    return;
  }

  if (ambition.ambitionStatus === 'active') {
    await tx.update(ambitions).set({ ambitionStatus: 'missed' }).where(eq(ambitions.id, ambition.id));
  }

  throw new BadRequestException('This ambition end date has passed. Extend the end date on the edit page before adding new moves.');
}

/**
 * Flip overdue `active` ambitions to `missed`. Used by the hourly reminders cron (global)
 * and by ambition list/detail reads (scoped to the current user) so status stays fresh
 * without waiting for a move mutation.
 */
export async function markOverdueAmbitionsMissed(options?: { userId?: string; now?: Date }): Promise<number> {
  const todayKey = startOfDay(options?.now ?? new Date())
    .toISOString()
    .slice(0, 10);
  const conditions: SQL[] = [eq(ambitions.ambitionStatus, 'active'), lt(ambitions.ambitionPercentageCompleted, 100), sql`(${ambitions.ambitionEndDate})::date < ${todayKey}::date`];
  if (options?.userId) {
    conditions.push(eq(ambitions.userId, options.userId));
  }

  const updated = await db
    .update(ambitions)
    .set({ ambitionStatus: 'missed' })
    .where(and(...conditions))
    .returning({ id: ambitions.id });

  return updated.length;
}

/** If a loaded ambition is overdue but still `active`, persist `missed` and return the updated row. */
export async function syncAmbitionMissedStatus<T extends AmbitionWindowRow>(ambition: T, now = new Date()): Promise<T> {
  if (ambition.ambitionStatus !== 'active') {
    return ambition;
  }
  if (startOfDay(ambition.ambitionEndDate).getTime() >= startOfDay(now).getTime()) {
    return ambition;
  }

  const [updated] = await db
    .update(ambitions)
    .set({ ambitionStatus: 'missed' })
    .where(and(eq(ambitions.id, ambition.id), eq(ambitions.ambitionStatus, 'active')))
    .returning();

  return (updated as T | undefined) ?? { ...ambition, ambitionStatus: 'missed' as const };
}
