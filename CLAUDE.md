# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

pnpm workspace monorepo. Three workspaces — order from least to most code:

- `packages/shared` — pure TS types only (`@ambitiousyou/shared` / `@ambitiousyou/shared/types`). The single source of truth for domain shapes (`User`, `Ambition`, `Task`, `Milestone`, `Note`, `Session`, `Settings`). Importable from both apps.
- `apps/backend` — NestJS 11 + Prisma 6 + PostgreSQL. REST API on port `3001`. Modules: `auth`, `users`, `ambitions`, `tasks`, `milestones`, `notes`, `settings`, plus a shared `prisma` module.
- `apps/frontend` — Next.js 16 (App Router, React 19, React Compiler on, Turbopack). Talks to the backend over HTTP using `process.env.API_URL` and a Bearer token.

## Commands

Run from the repo root (uses `pnpm --filter`):

```
pnpm start:frontend         # next dev (apps/frontend)
pnpm start:backend          # nest start --watch (apps/backend, runs prisma generate via prebuild)
```

Backend (`cd apps/backend`):

```
pnpm build                  # nest build (runs prisma generate first via prebuild)
pnpm lint                   # eslint --fix on src/apps/libs/test
pnpm test                   # jest unit tests (*.spec.ts under src)
pnpm test -- ambitions      # run a subset by name pattern
pnpm test src/auth/auth.service.spec.ts   # run one file
pnpm test:e2e               # jest --config ./test/jest-e2e.json
pnpm prisma:migrate         # prisma migrate dev (schema lives at prisma/schema.prisma)
pnpm prisma:generate        # regenerate Prisma client
pnpm prisma:studio          # browse the DB
```

Frontend (`cd apps/frontend`):

```
pnpm dev                    # next dev (Turbopack)
pnpm build                  # next build
pnpm lint                   # eslint (eslint-config-next + typescript)
```

No tests are wired up on the frontend.

## Architecture

### Backend (NestJS + Prisma)

- `main.ts` registers a global `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — any request body field not listed on a DTO is rejected with a 400. Mutate DTOs (in `<module>/dto/*.ts`), not just controllers, when you change a payload.
- `PrismaService` (`src/prisma/prisma.service.ts`) sets `omit: { user: { passwordHash: true } }` globally so `passwordHash` is never returned from queries. Login is the only path that needs it — explicitly pass `omit: { passwordHash: false }` (see `UsersService.findOneByEmailWithPassword`).
- Auth model: server-issued opaque UUID `sessionToken`, stored on the `sessions` row with `expiresAt = now + 7 days`. There is no JWT. `SessionGuard` (`src/auth/guards/session.guard.ts`) extracts the token from either the `sessionToken` cookie or `Authorization: Bearer <token>`, validates against the DB, deletes expired sessions, and attaches `request.user = { id }` + `request.session`. Controllers retrieve these via the `@CurrentUserId()` / `@CurrentSession()` decorators in `src/auth/decorators/`.
- Resource modules follow a consistent shape: `*.controller.ts` (HTTP + `@UseGuards(SessionGuard)`), `*.service.ts` (Prisma calls), `dto/` (class-validator DTOs), `*.spec.ts` (unit tests). Multi-entity creates use `prisma.$transaction` — see `AmbitionsService.createAmbition` which atomically creates an ambition plus its tasks/milestones/notes.
- Config: `ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development', '.env.production', '.env'] })`. `DATABASE_URL` is read by Prisma; see `prisma/schema.prisma`.

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

- All domain types come from `@ambitiousyou/shared` (or `@ambitiousyou/shared/types`). Update `packages/shared/types/index.ts` whenever the Prisma schema changes — the frontend imports from here, not from `@prisma/client`.
- Field naming convention is verbose and resource-prefixed (`ambitionName`, `ambitionStartDate`, `taskDeadline`, `milestoneTargetDate`). Keep it consistent — DTOs, types, columns, and UI all use the same names.

### Frontend UI/UX guidelines

`apps/frontend/AGENTS.md` is a detailed UI rule set (MUST/SHOULD/NEVER) covering keyboard, focus, forms, animation, layout, accessibility, performance, dark mode, hydration. Read it before non-trivial UI work.
