import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { ambitions } from './ambitions';
import { users } from './users';

export const proofLogs = pgTable('proof_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ambitionId: uuid('ambition_id').references(() => ambitions.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  proofTitle: text('proof_title').notNull(),
  proofNote: text('proof_note'),
  loggedAt: timestamp('logged_at', { precision: 3 }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
});

export type ProofLog = typeof proofLogs.$inferSelect;
export type NewProofLog = Pick<ProofLog, 'proofTitle'> & Partial<Pick<ProofLog, 'ambitionId' | 'proofNote' | 'loggedAt'>>;
