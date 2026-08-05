import { pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { ambitions } from './ambitions';

export const notificationTypeEnumValues = ['task_due_today', 'milestone_due_today'] as const;
export type NotificationType = (typeof notificationTypeEnumValues)[number];

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    type: varchar('type', { length: 64 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    body: text('body').notNull(),
    href: varchar('href', { length: 512 }).notNull(),
    ambitionId: uuid('ambition_id').references(() => ambitions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    resourceId: uuid('resource_id'),
    dedupeKey: varchar('dedupe_key', { length: 255 }).notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('notifications_user_id_dedupe_key_key').on(table.userId, table.dedupeKey)],
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = Pick<Notification, 'userId' | 'type' | 'title' | 'body' | 'href' | 'dedupeKey'> &
  Partial<Pick<Notification, 'ambitionId' | 'resourceId' | 'readAt'>>;
