import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// dotenv loads the sibling `.env` automatically. drizzle-kit doesn't load env
// files on its own, so we do it here. At runtime, the NestJS app reads
// DATABASE_URL via @nestjs/config; this file is only consumed by the CLI.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to run drizzle-kit (check apps/backend/.env)');
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
