import { boolean, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { ambitions } from './ambitions';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ambitionId: uuid('ambition_id')
    .notNull()
    .references(() => ambitions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  task: varchar('task', { length: 255 }).notNull(),
  taskDescription: text('task_description'),
  taskCompleted: boolean('task_completed').notNull().default(false),
  taskDeadline: timestamp('task_deadline', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 })
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = Pick<Task, 'ambitionId' | 'task' | 'taskDeadline'> & Partial<Pick<Task, 'taskDescription' | 'taskCompleted'>>;
