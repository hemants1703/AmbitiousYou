# Cache Components Migration Plan

Adopted on branch `feat/cache-components-partial-prefetch` against **Next.js 16.3**.

> **Status: adopted (composition model).** Cache Components + Partial Prefetching are
> enabled for PPR shells, Suspense streaming, and shared App Shell prefetches — **not**
> for caching personal ambition/move payloads or ISR on `(app)` routes.
>
> **Day-to-day rules for agents:** `apps/frontend/AGENTS.md` (Cache Components section).
> Prefer that for new features; this doc is the adoption record.

## Why this is one decision, not two

Partial Prefetching is the product win — every `<Link>` shares an **App Shell** per route
instead of a per-link full prefetch (Hobby cost + SPA-feeling nav on hot paths).

It cannot ship alone. From the [adoption guide](https://nextjs.org/docs/app/guides/adopting-partial-prefetching):

> Partial Prefetching only works when `cacheComponents` is enabled.

## What we enabled

In [`apps/frontend/next.config.ts`](../apps/frontend/next.config.ts):

```ts
cacheComponents: true,
partialPrefetching: true,
```

## What we did for `(app)`

1. **`(app)/layout.tsx`** — static chrome (nav links, frames). `requireUser` / `NavUser` and
   notifications stream behind `<Suspense>` so they do not block `{children}`.
2. **Pages** — runtime awaits (`cookies`, `params`, `searchParams`, domain fetches) live inside
   Suspense children; route `loading.tsx` files remain as fallbacks where useful.
3. **No `'use cache'` on ambitions / moves / notes / inbox** — optimistic UI + scoped
   `revalidatePath` stay the source of truth. Never key a server cache on the opaque
   `sessionToken` (cache keys are plain text).
4. **Activity** — transient dialogs/menus close on hide via
   `useCloseOnActivityHide` ([preserving UI state](https://nextjs.org/docs/app/guides/preserving-ui-state)).
5. **`prefetch={true}`** — removed on static/landing links; **kept** only on links that need
   runtime prefetch of URL data (`/ambitions/[id]`, `/ambitions/[id]/edit`).

## Landing

Removed `dynamic = "force-static"` (invalid under Cache Components). Marketing routes still
prerender as `○` Static in `next build` (Hobby lever intact). Copyright year / sitemap use
`"use cache"` + `cacheLife` where `new Date()` would block prerender.

## Explicit non-goals

- ISR / `generateStaticParams` for ambition IDs
- Tag-heavy rewrite of the mutation layer for personal data
- `experimental.turbopackRustReactCompiler`, `useOffline` (revisit later; offline pairs best
  *after* Partial Prefetching)
- Root params, `import.meta.glob`, TypeScript 7 (unchanged rationale)

## Optional follow-ups

- `'use cache: private'` for current user (official auth pattern) if prefetch metrics warrant
- Short `userId`-keyed inbox cache with `updateTag` — only if measured
- Playwright `instant()` coverage on hot paths (net-new e2e)

## Historical notes

Node runtime prerequisite (OG routes off `runtime = 'edge'`) was completed in the 16.3
upgrade before this migration.
