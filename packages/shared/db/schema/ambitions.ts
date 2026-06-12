import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';
import { ambitionPriorityEnum, ambitionStatusEnum } from './enums';

export const ambitions = pgTable('ambitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ambitionName: varchar('ambition_name', { length: 255 }).notNull(),
  ambitionDefinition: text('ambition_definition'),
  ambitionMotivation: text('ambition_motivation'),
  ambitionStartDate: timestamp('ambition_start_date', { precision: 3 }).notNull(),
  ambitionEndDate: timestamp('ambition_end_date', { precision: 3 }).notNull(),
  ambitionCompletionDate: timestamp('ambition_completion_date', { precision: 3 }),
  ambitionStatus: ambitionStatusEnum('ambition_status').notNull().default('active'),
  ambitionPriority: ambitionPriorityEnum('ambition_priority').notNull().default('medium'),
  ambitionPercentageCompleted: integer('ambition_percentage_completed').notNull().default(0),
  isFavourited: boolean('is_favourited').notNull().default(false),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 })
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Ambition = typeof ambitions.$inferSelect;
export type NewAmbition = Pick<Ambition, 'ambitionName' | 'ambitionStartDate' | 'ambitionEndDate'> &
  Partial<
    Pick<
      Ambition,
      'ambitionDefinition' | 'ambitionMotivation' | 'ambitionCompletionDate' | 'ambitionStatus' | 'ambitionPriority' | 'ambitionPercentageCompleted' | 'isFavourited'
    >
  >;
