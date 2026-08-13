// Single import surface for backend code:
//   import { db, users, sessions, type User } from 'src/db';
//   import { eq } from 'drizzle-orm';                          // operators come from here
export { db, closeDatabase, type Tx } from './client';
export * from './schema';
export * from './profile-icons';
