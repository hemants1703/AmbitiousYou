import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// `user_id` intentionally has no FK constraint — matches the original Prisma
// schema, where Verification had no `@relation` declared.
export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { precision: 3 }).notNull(),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 })
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Verification = typeof verifications.$inferSelect;
export type NewVerification = Pick<Verification, 'userId' | 'value' | 'expiresAt'>;
