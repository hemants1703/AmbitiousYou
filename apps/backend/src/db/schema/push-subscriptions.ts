import { pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

export const pushSubscriptions = pgTable(
  'push_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    endpoint: text('endpoint').notNull(),
    p256dh: text('p256dh').notNull(),
    auth: text('auth').notNull(),
    userAgent: varchar('user_agent', { length: 512 }),
    expirationTime: timestamp('expiration_time', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('push_subscriptions_endpoint_key').on(table.endpoint)],
);

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = Pick<PushSubscription, 'userId' | 'endpoint' | 'p256dh' | 'auth'> & Partial<Pick<PushSubscription, 'userAgent' | 'expirationTime'>>;
