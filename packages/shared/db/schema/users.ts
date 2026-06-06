import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique('users_email_key'),
  emailVerified: boolean('email_verified').notNull().default(false),
  passwordHash: text('password_hash').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { precision: 3 })
    .notNull()
    .$onUpdate(() => new Date()),
});

/**
 * Public-API `User` — the full row with the password hash stripped. This is
 * what the backend returns from public methods and what the frontend should
 * type API responses as. Backend code that needs the hash (only the login
 * query in `UsersService.findOneByEmailWithPassword`) reads the inferred row
 * directly from the Drizzle query, so it doesn't reference this type.
 */
export type User = Omit<typeof users.$inferSelect, 'passwordHash'>;

// API request body shape (e.g. signup) — NOT the Drizzle insert shape.
// Backend writes to `db.insert(users).values({...})` use Drizzle's own
// inferred values type via the table, and add the server-derived fields
// (`passwordHash`, etc.) themselves.
export type NewUser = Pick<User, 'name' | 'email'>;
