import { date, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { contractMoveKindEnum, contractStatusEnum } from './enums';
import { users } from './users';
import { ambitions } from './ambitions';

export const dailyContracts = pgTable(
  'daily_contracts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ambitionId: uuid('ambition_id')
      .notNull()
      .references(() => ambitions.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    moveKind: contractMoveKindEnum('move_kind').notNull(),
    moveId: uuid('move_id').notNull(),
    localDate: date('local_date').notNull(),
    status: contractStatusEnum('status').notNull().default('active'),
    ifTrigger: text('if_trigger'),
    thenAction: text('then_action'),
    createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  },
  (table) => [unique('daily_contracts_user_local_date_key').on(table.userId, table.localDate)],
);

export type DailyContract = typeof dailyContracts.$inferSelect;
export type NewDailyContract = Pick<DailyContract, 'ambitionId' | 'moveKind' | 'moveId' | 'localDate'> &
  Partial<Pick<DailyContract, 'status' | 'ifTrigger' | 'thenAction'>>;
