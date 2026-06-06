// Single import surface for backend code:
//   import { db, users, sessions, type User } from 'src/db';
//   import { eq } from 'drizzle-orm';                          // operators come from here
//
// The schema lives in `@ambitiousyou/shared/db` so it's the single source of
// truth for both backend (runtime + drizzle-kit migrations) and frontend
// (type-only API contract).
export { db, closeDatabase, type Tx } from './client';
export * from '@ambitiousyou/shared/db';
