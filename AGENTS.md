# AGENTS.md

Guidance for agents working in this monorepo.

## Repo layout

pnpm workspace monorepo with two apps:

- `apps/backend` — NestJS 11 + Drizzle ORM + PostgreSQL. REST API on port `3001`. Owns the Drizzle schema at `src/db/schema/*`, migrations, and Drizzle-inferred domain types. Feature modules: `auth`, `users`, `ambitions`, `tasks`, `milestones`, `notes`, `settings`.
- `apps/frontend` — Next.js App Router (React 19, React Compiler, Turbopack). **Cache Components + Partial Prefetching are enabled.** Hand-written API types live in `src/types/*`; profile avatar catalog in `src/lib/profile-icons.ts`. Day-to-day frontend UI rules live in [`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md). Adoption record: [`docs/NEXT-CACHE-COMPONENTS-MIGRATION.md`](docs/NEXT-CACHE-COMPONENTS-MIGRATION.md).

## Commands

Run from the repo root (uses `pnpm --filter`):

```
pnpm start:frontend         # next dev (apps/frontend)
pnpm start:backend          # nest start --watch (apps/backend)
```

Backend (`cd apps/backend`):

```
pnpm build                  # nest build → dist/main.js (CJS)
pnpm lint                   # eslint --fix on src/apps/libs/test
pnpm test                   # jest unit tests (*.spec.ts under src)
pnpm test -- ambitions      # run a subset by name pattern
pnpm test src/auth/auth.service.spec.ts   # run one file
pnpm test:e2e               # jest --config ./test/jest-e2e.json
pnpm db:generate            # drizzle-kit generate — diff schema, write next migration SQL under src/db/migrations
pnpm db:migrate             # drizzle-kit migrate — apply pending migrations against DATABASE_URL
pnpm db:push                # drizzle-kit push — sync schema directly without a migration (dev only)
pnpm db:studio              # drizzle-kit studio — browse the DB
```

Frontend (`cd apps/frontend`):

```
pnpm dev                    # next dev (Turbopack)
pnpm build                  # next build
pnpm lint                   # eslint (eslint-config-next + typescript)
pnpm test                   # vitest run
pnpm test:watch             # vitest
```

## Architecture

### Backend (NestJS + Drizzle ORM)

Drizzle is used in **raw SQL-style** — no DI ceremony, no `db.query.*` relational builder, no `DatabaseModule`. Services import a singleton `db` directly and write queries that look like SQL.

- `main.ts` registers a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — any request body field not listed on a DTO is rejected with a 400. Mutate DTOs (in `<module>/dto/*.ts`), not just controllers, when you change a payload. Graceful shutdown: `process.once('SIGTERM' / 'SIGINT', ...)` calls `app.close()` then `closeDatabase()` to drain the `pg.Pool`. `app.enableShutdownHooks()` is also called so any module-level `OnModuleDestroy` hooks still fire.
- Database wiring (`src/db/`) — client, schema, and profile-icons:
  - `src/db/client.ts` creates a process-wide `pg.Pool` from `process.env.DATABASE_URL` (throws at boot if missing) and exports `db` (the Drizzle client), `closeDatabase()`, and the transaction-scope type `Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]`.
  - `src/db/index.ts` is a barrel: re-exports everything from `client.ts`, `./schema`, and `./profile-icons` so feature code uses a single import.
  - **Schema lives at `src/db/schema/`** — per-table TS files with a barrel `index.ts`. Each file is `pgTable(...)` + the inferred row type (`User` is `Omit<typeof users.$inferSelect, 'passwordHash'>`; everything else is `typeof foo.$inferSelect`) + a hand-narrowed `NewFoo` (`Pick<Foo, ...> ± Partial<Pick<...>>`) for API request body shapes. **No `relations()`** declarations — joins are written explicitly with `.innerJoin()`.
- Services do `import { db, users, sessions, type User } from 'src/db';` plus operators from `drizzle-orm` (`eq`, `and`, `desc`, `getTableColumns`, `sql`). No `@Inject(DRIZZLE)`, no constructor param for the database. The few services with cross-service deps (e.g. `UsersService` → `SettingsService`, `AuthService` → `UsersService`) still take those via standard NestJS DI.
- Query style:
  - Reads: `const [user] = await db.select(publicUserColumns).from(users).where(eq(users.email, email)).limit(1);`
  - Joins: `db.select(publicUserColumns).from(sessions).innerJoin(users, eq(users.id, sessions.userId)).where(...).limit(1);`
  - Writes: `db.insert(table).values({...}).returning()` — destructure `[row]` off the array. Same for `update` and `delete`.
  - Transactions: `db.transaction(async (tx) => { ... })`. Helpers that join a caller's transaction (e.g. `recalculateAmbitionProgress` in `src/ambitions/ambition-progress.util.ts`) take `Tx` from `'src/db'`.
  - Aggregates: prefer a single `SELECT count(*)::int, count(*) FILTER (WHERE ...)::int FROM ...` via `sql<number>` template literals over multiple `$count` calls (see `recalculateAmbitionProgress`).
- `passwordHash` default-deny: `UsersService` derives `publicUserColumns` once at module scope: `const { passwordHash: _, ...publicUserColumns } = getTableColumns(users);`. Every public read passes it to `db.select(publicUserColumns)`. The login escape hatch `findOneByEmailWithPassword` calls `db.select()` with no projection to get the full row.
- PG errors: inlined where used. `users.service.ts` checks `(e as { code?: string }).code === '23505'` for unique-violation directly — only one call site needs it, so no helper file.
- Auth model: server-issued opaque UUID `sessionToken`, stored on `sessions` with `expiresAt = now + 7 days`. There is no JWT. `SessionGuard` (`src/auth/guards/session.guard.ts`) extracts the token from either the `sessionToken` cookie or `Authorization: Bearer <token>`, validates against the DB, deletes expired sessions, and attaches `request.user = { id }` + `request.session`. Controllers retrieve these via the `@CurrentUserId()` / `@CurrentSession()` decorators in `src/auth/decorators/`.
- Resource modules follow a consistent shape: `*.controller.ts` (HTTP + `@UseGuards(SessionGuard)`), `*.service.ts` (Drizzle queries), `dto/` (class-validator DTOs), `*.spec.ts` (unit tests). Multi-entity creates use `db.transaction(async (tx) => { ... })` — see `AmbitionsService.createAmbition` which atomically creates an ambition plus its tasks/milestones/notes via the transaction-scoped `tx`.
- Migrations: `drizzle.config.ts` at the backend root (loads `.env` via `dotenv/config`). Schema path is `'./src/db/schema/index.ts'`; migrations live at `apps/backend/src/db/migrations/`. Workflow: edit schema TS files in `src/db/schema/` → `pnpm db:generate` from backend → review the new SQL → `pnpm db:migrate`. Use `db:push` only for throwaway dev iteration.
- Tests use **classic CJS jest** with an auto-mock at `src/db/__mocks__/index.ts`. Activated by `jest.mock('src/db')` at the top of any spec. The auto-mock exposes `db.select/insert/update/delete` as `jest.fn()` returning a default chainable resolving to `[]`, plus the **real schema tables** (re-exported from `'../schema'`) so `getTableColumns(users)` works in tests. Specs that need to stage a specific row import `buildChain` from `src/test-utils/db-chain` and call `(db.insert as jest.Mock).mockReturnValueOnce(buildChain([row]));`. Service specs that read `mock.calls[0]` for arg-shape assertions call `jest.clearAllMocks()` in `beforeEach` — the `jest.fn()` instances in the auto-mock persist across tests in the same file.
- Config: `ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development', '.env.production', '.env'] })`. `DATABASE_URL` is read by `src/db/client.ts` at module load via `process.env.DATABASE_URL` (NestJS's `@nestjs/config` ALSO loads `.env`, but `client.ts` is imported before the Nest container boots so it reads directly from `process.env`). drizzle-kit reads it via `dotenv` in `drizzle.config.ts`.

### Frontend

All frontend architecture, UI/UX MUST/SHOULD/NEVER, dashboard viz (activity intensity = theme `--chart-*` blues; Needs Attention soft alert surface), Cache Components, and Partial Prefetching rules: **[`apps/frontend/AGENTS.md`](apps/frontend/AGENTS.md)**.

### Cross-cutting

- Backend domain types are **derived from the Drizzle schema** at `apps/backend/src/db/schema/*`. Frontend API types are **hand-written** in `apps/frontend/src/types/*` — update both when the API shape changes. The frontend should never import from `apps/backend`.
- Field naming convention is verbose and resource-prefixed (`ambitionName`, `ambitionStartDate`, `taskDeadline`, `milestoneTargetDate`). Keep it consistent — DTOs, types, columns, and UI all use the same names.
