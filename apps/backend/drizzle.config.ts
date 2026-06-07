import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit doesn't load env files on its own. Mirror ConfigModule's
// precedence (first wins): `.env` is gitignored and usually absent, so we load
// the committed `.env.development` too — plain `dotenv/config` reads only
// `.env`, which would leave DATABASE_URL unset. Missing files are skipped.
config({ path: ['.env.development', '.env.production', '.env'] });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to run drizzle-kit (check apps/backend/.env.development)');
}

export default defineConfig({
  dialect: 'postgresql',
  // Schema is the single source of truth at packages/shared. Drizzle-kit
  // resolves drizzle-orm from this backend's node_modules; the shared package
  // declares it as a dep so esbuild also finds it from packages/shared/.
  schema: '../../packages/shared/db/schema/index.ts',
  out: './src/db/migrations',
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
