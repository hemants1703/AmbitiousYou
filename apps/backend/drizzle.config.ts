import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit doesn't load env files on its own. Mirror ConfigModule's
// precedence (first wins): `.env` is gitignored and usually absent, so we load
// the committed `.env.development` too — plain `dotenv/config` reads only
// `.env`, which would leave DATABASE_URL unset. Missing files are skipped.
config({ path: ['.env.local', '.env.development', '.env.production', '.env'] });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set to run drizzle-kit (check apps/backend/.env.local)');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dbCredentials: { url: DATABASE_URL },
  strict: true,
  verbose: true,
});
