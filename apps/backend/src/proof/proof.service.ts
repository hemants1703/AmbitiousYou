import { Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db, proofLogs, type ProofLog } from '../db';
import { CreateProofLogDto } from './dto/create-proof-log.dto';

@Injectable()
export class ProofService {
  async listProofLogs(userId: string): Promise<ProofLog[]> {
    return db.select().from(proofLogs).where(eq(proofLogs.userId, userId)).orderBy(desc(proofLogs.loggedAt));
  }

  async createProofLog(userId: string, dto: CreateProofLogDto): Promise<ProofLog> {
    const [row] = await db
      .insert(proofLogs)
      .values({
        userId,
        proofTitle: dto.proofTitle.trim(),
        proofNote: dto.proofNote?.trim() || null,
        ambitionId: dto.ambitionId ?? null,
      })
      .returning();
    return row;
  }

  async deleteProofLog(userId: string, proofLogId: string): Promise<void> {
    const [row] = await db
      .delete(proofLogs)
      .where(and(eq(proofLogs.id, proofLogId), eq(proofLogs.userId, userId)))
      .returning();
    if (!row) {
      throw new NotFoundException('Proof log entry not found');
    }
  }
}
