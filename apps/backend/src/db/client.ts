// Load env BEFORE the DATABASE_URL check. `client.ts` is imported transitively
// by services, which run before NestJS's `ConfigModule.forRoot()` loads env
// files. Mirror ConfigModule's precedence (first wins): `.env` is gitignored
// and usually absent, so we must also load the committed `.env.development`.
// dotenv won't override vars already set (e.g. by Docker / k8s in prod), and
// missing files are skipped — safe everywhere.
import { config } from 'dotenv';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

config({ path: ['.env.development', '.env.production', '.env'] });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set (check apps/backend/.env.development)');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// node-postgres emits 'error' on IDLE clients when the connection drops out from
// under us (network blip, Supabase restart / idle timeout). Without a listener
// this surfaces as an uncaught exception that crashes the whole process. Log and
// swallow it — the pool transparently discards the dead client and opens a fresh
// one on the next query, so the app stays up through transient DB outages.
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client:', err.message);
});

/**
 * Process-wide Drizzle client. No relational query builder (`db.query.*`) —
 * use the SQL-style core API instead (`db.select().from().where()...`,
 * `db.insert(table).values().returning()`, `db.transaction(...)`).
 */
export const db: NodePgDatabase = drizzle(pool);

/**
 * Close the underlying `pg.Pool`. Called from `main.ts` on `SIGTERM`/`SIGINT`
 * so the process exits cleanly without leaking connections.
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}

/**
 * The transaction-scoped client passed to `db.transaction(async (tx) => ...)`.
 * Helpers that run inside a caller's transaction (e.g. `recalculateAmbitionProgress`)
 * accept this type so the helper joins the same transaction rather than opening a nested one.
 */
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
