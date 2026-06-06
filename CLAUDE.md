# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

pnpm workspace monorepo. Three workspaces — order from least to most code:

- `packages/shared` — **single source of truth for the database schema AND derived API types.** Contains the Drizzle `pgTable` definitions under `db/schema/*` plus the inferred TS types (`User`, `Ambition`, `Task`, etc.). Backend imports the schema for runtime queries + migration generation; frontend imports types-only for API response shapes. Buildable via `pnpm --filter @ambitiousyou/shared build` → `dist/` (CJS). The backend's `prebuild` / `prestart:dev` scripts trigger this automatically; the frontend uses `transpilePackages: ['@ambitiousyou/shared']` in `next.config.ts` so no build is required to consume from there.
- `apps/backend` — NestJS 11 + Drizzle ORM + PostgreSQL. REST API on port `3001`. Feature modules: `auth`, `users`, `ambitions`, `tasks`, `milestones`, `notes`, `settings`, plus a shared global `db` module (`DatabaseModule.forRoot()`).
- `apps/frontend` — Next.js 16 (App Router, React 19, React Compiler on, Turbopack). Talks to the backend over HTTP using `process.env.API_URL` and a Bearer token.

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
```

No tests are wired up on the frontend.

## Architecture

### Backend (NestJS + Drizzle ORM)

Drizzle is used in **raw SQL-style** — no DI ceremony, no `db.query.*` relational builder, no `DatabaseModule`. Services import a singleton `db` directly and write queries that look like SQL.

- `main.ts` registers a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — any request body field not listed on a DTO is rejected with a 400. Mutate DTOs (in `<module>/dto/*.ts`), not just controllers, when you change a payload. Graceful shutdown: `process.once('SIGTERM' / 'SIGINT', ...)` calls `app.close()` then `closeDatabase()` to drain the `pg.Pool`. `app.enableShutdownHooks()` is also called so any module-level `OnModuleDestroy` hooks still fire.
- Database wiring (`src/db/`) — minimal, two files (the schema itself lives in `packages/shared`):
  - `src/db/client.ts` creates a process-wide `pg.Pool` from `process.env.DATABASE_URL` (throws at boot if missing) and exports `db` (the Drizzle client), `closeDatabase()`, and the transaction-scope type `Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]`.
  - `src/db/index.ts` is a barrel: re-exports everything from `client.ts` and `* from '@ambitiousyou/shared/db'` so feature code uses a single import.
  - **Schema lives at `packages/shared/db/schema/`** — per-table TS files with a barrel `index.ts`. Each file is `pgTable(...)` + the inferred row type (`User` is `Omit<typeof users.$inferSelect, 'passwordHash'>`; everything else is `typeof foo.$inferSelect`) + a hand-narrowed `NewFoo` (`Pick<Foo, ...> ± Partial<Pick<...>>`) for API request body shapes. **No `relations()`** declarations — joins are written explicitly with `.innerJoin()`.
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
- Migrations: `drizzle.config.ts` at the backend root (loads `.env` via `dotenv/config`). Schema path is `'../../packages/shared/db/schema/index.ts'`; migrations live at `apps/backend/src/db/migrations/`. The baseline `0000_purple_hobgoblin.sql` matches the prior Prisma init migration semantically. Workflow: edit schema TS files in `packages/shared/db/schema/` → `pnpm db:generate` from backend → review the new SQL → `pnpm db:migrate`. Use `db:push` only for throwaway dev iteration.
- **Shared schema rebuild trigger**: backend has `prebuild` / `prestart:dev` / `prestart:debug` scripts that run `pnpm --filter @ambitiousyou/shared build` first. tsc with `incremental: true` keeps these near-instant after the first build. Frontend doesn't need a shared build — `next.config.ts`'s `transpilePackages` picks up TS source directly.
- Tests use **classic CJS jest** with an auto-mock at `src/db/__mocks__/index.ts`. Activated by `jest.mock('src/db')` at the top of any spec. The auto-mock exposes `db.select/insert/update/delete` as `jest.fn()` returning a default chainable resolving to `[]`, plus the **real schema tables** (re-exported from `'../schema'`) so `getTableColumns(users)` works in tests. Specs that need to stage a specific row import `buildChain` from `src/test-utils/db-chain` and call `(db.insert as jest.Mock).mockReturnValueOnce(buildChain([row]));`. Service specs that read `mock.calls[0]` for arg-shape assertions call `jest.clearAllMocks()` in `beforeEach` — the `jest.fn()` instances in the auto-mock persist across tests in the same file.
- Config: `ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development', '.env.production', '.env'] })`. `DATABASE_URL` is read by `src/db/client.ts` at module load via `process.env.DATABASE_URL` (NestJS's `@nestjs/config` ALSO loads `.env`, but `client.ts` is imported before the Nest container boots so it reads directly from `process.env`). drizzle-kit reads it via `dotenv` in `drizzle.config.ts`.

### Frontend (Next.js App Router)

- Route groups under `src/app/`:
  - `(landing)/` — public marketing pages (`/`, `/features`, `/experience`, `/privacy-policy`, `/terms-and-conditions`).
  - `(auth)/` — `/login`, `/signup`. Use `redirectIfAuthenticated()` to bounce signed-in visitors to `/dashboard`.
  - `(app)/` — authenticated app (`/dashboard`, `/ambitions`, `/ambitions/[ambitionId]`, `/ambitions/create`, `/settings`). The layout calls `requireUser()`.
  - `api/logout/` — the only Route Handler; everything else goes through Server Actions.
- Auth gate (`src/lib/auth.ts`): three functions with distinct contracts. **Use the right one** — the file documents why.
  - `requireUser()` — mandatory gate for protected pages. Reads the cookie *and* calls the backend to validate; redirects to `/login` on missing OR forged/expired. Wrapped by React `cache()` so layout + page in the same request = one backend call.
  - `getSessionToken()` — returns the raw cookie value without validating it. Only safe to use when the downstream backend call is itself behind `SessionGuard` (a forged token will be rejected there with a 401). Never use this to gate a render.
  - `redirectIfAuthenticated()` — for `(auth)` pages.
- Data layer split:
  - `src/lib/api/<resource>/` — read functions (`get-*.ts`). Server-side `fetch` with `Authorization: Bearer ${sessionToken}`. Some use React `cache()` for request-scoped deduping (e.g. `getAmbitionDetails`).
  - `src/lib/actions/(app)/<resource>/` — Server Actions (`"use server"`) for mutations. Pattern: read session via `getSessionToken()`, send a typed payload to the backend, `revalidatePath()` the affected routes, return `{ error, ...result }`. See `toggle-ambition-favourite.ts` as the canonical example — note how it rehydrates the full DTO before PATCH because the backend's `ValidationPipe` is strict.
- Component organization (also see `apps/frontend/AGENTS.md`):
  - Default to **Server Components**. `"use client"` only when state/interactivity demands it, and split the client part into a separate file so the page route itself stays server-rendered.
  - File naming: `kebab-case.tsx`, component name `PascalCase`, variables `camelCase`.
  - Per-page supporting components live under `src/components/(app)/(<resource>)/(<routeParam>)/...` mirroring the route. E.g. components for `/ambitions/[ambitionId]` go under `src/components/(app)/(ambitions)/(ambitionId)/`.
  - Props always typed as a `*Props` interface in the same file; consume as `props.thing` (no destructuring).
  - Lucide icons imported with the `*Icon` suffix (`SunIcon`, not `Sun`).
- `next.config.ts` sets `turbopack.root` to the monorepo root and enables `reactCompiler: true`. UI uses shadcn (style: `radix-luma`, baseColor: `neutral`) under `src/components/ui/`. Theming via `next-themes` + `ThemeColorSync`; toasts via `sonner`.

### Cross-cutting

- All domain types are **derived from the Drizzle schema** at `packages/shared/db/schema/*` and re-exported through `@ambitiousyou/shared` (and the legacy `@ambitiousyou/shared/types` shim). Both apps import from the same source — change a column in the schema once and both sides' types update on the next build. The frontend should never import from `apps/backend`, and the backend never duplicates types it could derive from the schema.
- Field naming convention is verbose and resource-prefixed (`ambitionName`, `ambitionStartDate`, `taskDeadline`, `milestoneTargetDate`). Keep it consistent — DTOs, types, columns, and UI all use the same names.

### Frontend UI/UX guidelines

`apps/frontend/AGENTS.md` is a detailed UI rule set (MUST/SHOULD/NEVER) covering keyboard, focus, forms, animation, layout, accessibility, performance, dark mode, hydration. Read it before non-trivial UI work.
