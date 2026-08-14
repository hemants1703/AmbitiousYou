import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { db, ambitions } from '../db';

@Injectable()
export class ExportService {
  async buildAmbitionsCsv(userId: string): Promise<string> {
    const rows = await db
      .select({
        ambitionName: ambitions.ambitionName,
        ambitionStatus: ambitions.ambitionStatus,
        ambitionPriority: ambitions.ambitionPriority,
        ambitionStartDate: ambitions.ambitionStartDate,
        ambitionEndDate: ambitions.ambitionEndDate,
        ambitionPercentageCompleted: ambitions.ambitionPercentageCompleted,
        taskTotal: sql<number>`(select count(*)::int from tasks t where t.ambition_id = ${ambitions.id} and t.user_id = ${userId})`,
        taskCompleted: sql<number>`(select count(*)::int from tasks t where t.ambition_id = ${ambitions.id} and t.user_id = ${userId} and t.task_completed)`,
        milestoneTotal: sql<number>`(select count(*)::int from milestones m where m.ambition_id = ${ambitions.id} and m.user_id = ${userId})`,
        milestoneCompleted: sql<number>`(select count(*)::int from milestones m where m.ambition_id = ${ambitions.id} and m.user_id = ${userId} and m.milestone_completed)`,
      })
      .from(ambitions)
      .where(eq(ambitions.userId, userId))
      .orderBy(ambitions.createdAt);

    const header = [
      'ambitionName',
      'ambitionStatus',
      'ambitionPriority',
      'ambitionStartDate',
      'ambitionEndDate',
      'ambitionPercentageCompleted',
      'taskTotal',
      'taskCompleted',
      'milestoneTotal',
      'milestoneCompleted',
    ];

    const lines = [header.join(',')];
    for (const row of rows) {
      lines.push(
        [
          row.ambitionName,
          row.ambitionStatus,
          row.ambitionPriority,
          row.ambitionStartDate.toISOString(),
          row.ambitionEndDate.toISOString(),
          row.ambitionPercentageCompleted,
          row.taskTotal,
          row.taskCompleted,
          row.milestoneTotal,
          row.milestoneCompleted,
        ]
          .map((value) => csvEscape(String(value)))
          .join(','),
      );
    }

    return lines.join('\n');
  }
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
