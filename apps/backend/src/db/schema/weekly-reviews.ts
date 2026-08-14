import { date, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { ambitions } from './ambitions';

export const weeklyReviews = pgTable(
  'weekly_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ambitionId: uuid('ambition_id')
      .notNull()
      .references(() => ambitions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    weekStartDate: date('week_start_date').notNull(),
    moved: text('moved').notNull(),
    stalled: text('stalled').notNull(),
    skipReason: text('skip_reason'),
    nextWeekContract: text('next_week_contract').notNull(),
    createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique('weekly_reviews_user_week_key').on(table.userId, table.weekStartDate)],
);

export type WeeklyReview = typeof weeklyReviews.$inferSelect;
export type NewWeeklyReview = Pick<WeeklyReview, 'ambitionId' | 'weekStartDate' | 'moved' | 'stalled' | 'nextWeekContract'> &
  Partial<Pick<WeeklyReview, 'skipReason'>>;
