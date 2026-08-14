import { customType, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { embeddingSourceTypeEnum } from './enums';
import { users } from './users';

const vector1536 = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(1536)';
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`;
  },
  fromDriver(value: string): number[] {
    return value
      .slice(1, -1)
      .split(',')
      .map((part) => Number(part));
  },
});

export const embeddings = pgTable(
  'embeddings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    sourceType: embeddingSourceTypeEnum('source_type').notNull(),
    sourceId: uuid('source_id').notNull(),
    content: text('content').notNull(),
    embedding: vector1536('embedding').notNull(),
    createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { precision: 3 })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index('embeddings_user_source_idx').on(table.userId, table.sourceType, table.sourceId)],
);

export type Embedding = typeof embeddings.$inferSelect;
