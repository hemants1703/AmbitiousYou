import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { calendarProviderEnum } from './enums';
import { users } from './users';

export const calendarIntegrations = pgTable('calendar_integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique('calendar_integrations_user_id_key')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  provider: calendarProviderEnum('provider').notNull().default('google'),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at', { precision: 3 }),
  calendarId: text('calendar_id'),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type CalendarIntegration = typeof calendarIntegrations.$inferSelect;
