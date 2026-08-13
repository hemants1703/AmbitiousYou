import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { ambitions } from './ambitions';

export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ambitionId: uuid('ambition_id')
    .notNull()
    .references(() => ambitions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  milestone: varchar('milestone', { length: 255 }).notNull(),
  milestoneDescription: text('milestone_description'),
  milestoneCompleted: boolean('milestone_completed').notNull().default(false),
  // Server-stamped when the milestone is reached (one-way; never cleared). Powers the dashboard
  // movement chart. Nullable: unreached milestones (and rows predating this column) have no completion time.
  milestoneCompletedAt: timestamp('milestone_completed_at', { precision: 3 }),
  milestoneTargetDate: timestamp('milestone_target_date', { precision: 3 }).notNull(),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 })
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Milestone = typeof milestones.$inferSelect;
export type NewMilestone = Pick<Milestone, 'ambitionId' | 'milestone' | 'milestoneTargetDate'> &
  Partial<Pick<Milestone, 'milestoneDescription' | 'milestoneCompleted'>>;
