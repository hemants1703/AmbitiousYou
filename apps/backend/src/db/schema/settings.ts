import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// `user_id` intentionally has no FK constraint — matches the original Prisma
// schema, where Settings had no `@relation` declared. The unique constraint
// enforces one-settings-row-per-user.
export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique('settings_user_id_key'),
  userTimezone: varchar('user_timezone', { length: 255 }).notNull(),
  emailAccountActivity: boolean('email_account_activity').notNull().default(false),
  pushAmbitionReminders: boolean('push_ambition_reminders').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Settings = typeof settings.$inferSelect;
