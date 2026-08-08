Concise rules for building accessible, fast, delightful UIs. Use MUST/SHOULD/NEVER to guide decisions.

## Interactions

### Keyboard

- MUST: Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- MUST: Visible focus rings (`:focus-visible`; group with `:focus-within`)
- MUST: Manage focus (trap, move, return) per APG patterns
- NEVER: `outline: none` without visible focus replacement

### Targets & Input

- MUST: Hit target ≥24px (mobile ≥44px); if visual <24px, expand hit area
- MUST: Mobile `<input>` font-size ≥16px to prevent iOS zoom
- NEVER: Disable browser zoom (`user-scalable=no`, `maximum-scale=1`)
- MUST: `touch-action: manipulation` to prevent double-tap zoom
- SHOULD: Set `-webkit-tap-highlight-color` to match design

### Forms

- MUST: Hydration-safe inputs (no lost focus/value)
- NEVER: Block paste in `<input>`/`<textarea>`
- MUST: Loading buttons show spinner and keep original label — use `<PendingButton>` from `src/components/(app)/mutations/`
- MUST: Enter submits focused input; in `<textarea>`, ⌘/Ctrl+Enter submits
- MUST: Keep submit enabled until request starts; then disable with spinner
- MUST: Accept free text, validate after—don't block typing
- MUST: Allow incomplete form submission to surface validation
- MUST: Errors inline next to fields; on submit, focus first error
- MUST: `autocomplete` + meaningful `name`; correct `type` and `inputmode`
- SHOULD: Disable spellcheck for emails/codes/usernames
- SHOULD: Placeholders end with `…` and show example pattern
- MUST: Warn on unsaved changes before navigation
- MUST: Compatible with password managers & 2FA; allow pasting codes
- MUST: Trim values to handle text expansion trailing spaces
- MUST: No dead zones on checkboxes/radios; label+control share one hit target

### State & Navigation

- MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels)
- MUST: Back/Forward restores scroll position
- MUST: Links use `<a>`/`<Link>` for navigation (support Cmd/Ctrl/middle-click)
- NEVER: Use `<div onClick>` for navigation
- MUST: Add `loading.tsx` shells for routes where navigation should feel instant (mirror final layout to avoid CLS)
- SHOULD: Rely on Partial Prefetching’s shared App Shell for most `<Link>`s — do not blanket `prefetch={true}`
- MUST: Keep `prefetch` only where URL-bound runtime data still needs a full prefetch (today: `/ambitions/[id]`, `/ambitions/[id]/edit`)

### Feedback

- MUST: Optimistic UI for mutations — update local state immediately, reconcile from the action response, rollback on failure
- MUST: Per-item pending (`usePendingMap`) — one row's save must not disable the whole list
- SHOULD: In-place pending affordance on rows (`<OptimisticRow>`, spinner in the control that was clicked)
- MUST: Confirm destructive actions or provide Undo window
- MUST: Use polite `aria-live` for toasts/inline validation
- SHOULD: Ellipsis (`…`) for options opening follow-ups ("Rename…") and loading states ("Loading…")
- NEVER: Block the UI waiting for `router.refresh()` when local state + the action response fully reconcile the view

### Touch & Drag

- MUST: Generous targets, clear affordances; avoid finicky interactions
- MUST: Delay first tooltip; subsequent peers instant
- MUST: `overscroll-behavior: contain` in modals/drawers
- MUST: During drag, disable text selection and set `inert` on dragged elements
- MUST: If it looks clickable, it must be clickable

### Autofocus

- SHOULD: Autofocus on desktop with single primary input; rarely on mobile

## Animation

- MUST: Honor `prefers-reduced-motion` (provide reduced variant or disable)
- SHOULD: Prefer CSS (`FadeIn`, `animate-in`) on hot routes over framer-motion
- SHOULD: Prefer CSS > Web Animations API > JS libraries
- MUST: Animate compositor-friendly props (`transform`, `opacity`) only
- NEVER: Animate layout props (`top`, `left`, `width`, `height`)
- NEVER: `transition: all`—list properties explicitly
- SHOULD: Animate only to clarify cause/effect or add deliberate delight
- SHOULD: Choose easing to match the change (size/distance/trigger)
- MUST: Animations interruptible and input-driven (no autoplay)
- MUST: Correct `transform-origin` (motion starts where it "physically" should)
- MUST: SVG transforms on `<g>` wrapper with `transform-box: fill-box`
- MUST: Progress bars use shared `<Progress>` (`src/components/ui/progress.tsx`) — entrance fill is WAAPI; do not reintroduce React-state + `usePathname` loops that fight Soft Nav
- SHOULD: Entrance animations may replay when Activity reveals a route (effect teardown/setup) — that is expected, not a Cache Components bug

## Layout

- SHOULD: Optical alignment; adjust ±1px when perception beats geometry
- MUST: Deliberate alignment to grid/baseline/edges—no accidental placement
- SHOULD: Balance icon/text lockups (weight/size/spacing/color)
- MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- MUST: Respect safe areas (`env(safe-area-inset-*)`)
- MUST: Avoid unwanted scrollbars; fix overflows
- SHOULD: Flex/grid over JS measurement for layout

## Content & Accessibility

- SHOULD: Inline help first; tooltips last resort
- MUST: Skeletons mirror final content to avoid layout shift
- MUST: `<title>` matches current context
- MUST: No dead ends; always offer next step/recovery
- MUST: Design empty/sparse/dense/error states
- SHOULD: Curly quotes (" "); avoid widows/orphans (`text-wrap: balance`)
- MUST: `font-variant-numeric: tabular-nums` for number comparisons
- MUST: Redundant status cues (not color-only); icons have text labels
- MUST: Accessible names exist even when visuals omit labels
- MUST: Use `…` character (not `...`)
- MUST: `scroll-margin-top` on headings; "Skip to content" link; hierarchical `<h1>`–`<h6>`
- MUST: Resilient to user-generated content (short/avg/very long)
- MUST: Locale-aware dates/times/numbers (`Intl.DateTimeFormat`, `Intl.NumberFormat`)
- SHOULD: `translate="no"` on brand names, code tokens, & identifiers to prevent garbled auto-translation
- MUST: Accurate `aria-label`; decorative elements `aria-hidden`
- MUST: Icon-only buttons have descriptive `aria-label`
- MUST: Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- MUST: Non-breaking spaces: `10&nbsp;MB`, `⌘&nbsp;K`, brand names

## Content Handling

- MUST: Text containers handle long content (`truncate`, `line-clamp-*`, `break-words`)
- MUST: Flex children need `min-w-0` to allow truncation
- MUST: Handle empty states—no broken UI for empty strings/arrays

## Performance

- SHOULD: Test iOS Low Power Mode and macOS Safari
- MUST: Measure reliably (disable extensions that skew runtime)
- MUST: Track and minimize re-renders (React DevTools/React Scan)
- MUST: Profile with CPU/network throttling
- MUST: Batch layout reads/writes; avoid reflows/repaints
- MUST: Mutations feel instant via optimistic UI; network target <500ms
- SHOULD: Prefer uncontrolled inputs; controlled inputs cheap per keystroke
- MUST: Paginate or virtualize large lists (>50 items)
- MUST: Preload above-fold images; lazy-load the rest; `dynamic()` for heavy drawers
- MUST: Prevent CLS (explicit image dimensions)
- SHOULD: `<link rel="preconnect">` for CDN domains
- SHOULD: Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`

## Dark Mode & Theming

- MUST: `color-scheme: dark` on `<html>` for dark themes
- SHOULD: `<meta name="theme-color">` matches page background
- MUST: Native `<select>`: explicit `background-color` and `color` (Windows fix)

## Hydration

- MUST: Inputs with `value` need `onChange` (or use `defaultValue`)
- SHOULD: Guard date/time rendering against hydration mismatch

## Design

- SHOULD: Layered shadows (ambient + direct)
- SHOULD: Crisp edges via semi-transparent borders + shadows
- SHOULD: Nested radii: child ≤ parent; concentric
- SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
- MUST: Accessible charts (color-blind-friendly palettes)
- MUST: Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- MUST: Increase contrast on `:hover`/`:active`/`:focus`
- SHOULD: Match browser UI to bg
- SHOULD: Avoid dark color gradient banding (use background images when needed)

## Component Architecture

- **Default:** Server Components (pages, layouts, metadata)
- **"use client":** Only for state/interactivity; split into a client island, keep the route server-rendered
- **File naming:** PascalCase components, kebab-case files, camelCase variables
- **Props:** `ComponentNameProps` interface; access as `props.key` (no destructuring in signature)
- **Lucide:** `*Icon` suffix (`SunIcon`, not `Sun`)
- **Colocation:** Supporting components mirror the route under `src/components/(app)/…`
- **Page width:** Every authenticated page uses the `app-page` utility (`max-w-350`) — never ad-hoc `max-w-screen-2xl` / `max-w-6xl` on `(app)` content

## Data & Mutations (server-first)

- **Reads:** `src/lib/api/` — wrap helpers in React `cache()` for request-scoped dedup; prefer batch/composite backend endpoints (`getAmbitionFull`, `getAmbitionMovesBatch`) over N×per-resource fetches
- **Writes:** `src/lib/actions/` — all mutations via `mutateApi()`; scoped invalidation via `revalidateAmbition(id, scopes)` where scopes are `detail` | `list` | `dashboard` (never blanket triple-revalidate when unnecessary)
- **Client sync:** Optimistic local state reconciles from action responses; `useBackgroundRefresh()` only when server-derived aggregates change (progress %, dashboard buckets) — not after every click
- **Shared optimistic primitives:** `src/lib/(app)/mutations/` (`usePendingMap`, `useOptimisticList`, `useBackgroundRefresh`, `AmbitionNotesProvider`, `DashboardMovesProvider`)
- **NEVER:** SWR/React Query — fights the server-first model and adds bundle cost
- **Streaming:** `Suspense` + skeleton fallbacks for heavy server children (dashboard insights, activity)

## Cache Components & Partial Prefetching (CRITICAL)

**Status: adopted.** `cacheComponents: true` + `partialPrefetching: true` in `next.config.ts`. Full rationale: [`docs/NEXT-CACHE-COMPONENTS-MIGRATION.md`](../../docs/NEXT-CACHE-COMPONENTS-MIGRATION.md).

**Why this matters:** Partial Prefetching is the product win (shared App Shell per route → cheaper Hobby prefetches + SPA-feeling nav on dashboard ↔ ambitions ↔ detail). It **only works when Cache Components is enabled**. New features MUST preserve this composition model — do not “simplify” back to blocking layouts or per-link full prefetches.

### What we optimize for

| Lever | Intent |
| --- | --- |
| Static / early shell | Chrome and fallbacks paint before personal data |
| Suspense islands | Runtime awaits (`cookies`, `params`, `searchParams`, domain fetches) never block the whole route |
| Partial Prefetch | Shared App Shell; avoid redundant full RSC prefetches |
| Activity Soft Nav | Routes may stay mounted while hidden — client UI must tolerate hide/reveal |

### MUST

- Keep `(app)/layout` chrome static: nav links/frames render without awaiting auth; stream `AuthenticatedNavUser` / `HeaderInbox` (or successors) behind `<Suspense>` so they do not block `{children}`
- Put page-level runtime work inside Suspense children (or `loading.tsx` siblings); do not `await` cookies/session/domain data at the top of a layout/page that should contribute to the shell
- Close transient UI on Activity hide via `useCloseOnActivityHide` (`src/lib/(app)/use-close-on-activity-hide.ts`) for dialogs, menus, drawers, popovers
- Preserve `AppSidebar` `variant="inset"` (and other shell chrome) when touching layout — Soft Nav gains must not regress the visual shell
- Prefer optimistic UI + scoped `revalidatePath` / `revalidateAmbition` for personal data freshness

### NEVER

- Disable `cacheComponents` or `partialPrefetching` to “fix” an animation, dialog, or fetch issue
- Add `'use cache'` (or ISR / `generateStaticParams`) for ambitions, moves, notes, inbox, or any payload keyed by `sessionToken` — cache keys are plain text; optimistic mutations are the source of truth
- Reintroduce `export const dynamic = "force-static" | "force-dynamic"` — invalid / obsolete under Cache Components; landing still prerenders as Static without it
- Await `requireUser()` / inbox / heavy fetches in `(app)/layout` in a way that blocks `{children}`
- Blanket `prefetch={true}` on marketing or static links (fights Partial Prefetching cost model)
- Tie entrance animations to `usePathname()` in a way that restarts mid Soft Nav (causes stutter; use mount/Activity effect lifecycle instead)

### SHOULD

- Use `"use cache"` + `cacheLife` only for **non-personal** bits that would otherwise block prerender (e.g. copyright year, sitemap helpers)
- Measure before adding `'use cache: private'` for the current user or tagged inbox caches
- When adding a new `(app)` route: ship `loading.tsx`, Suspense around awaits, Activity-safe overlays, and Link prefetch policy consistent with above

### Not the goal

Cache Components here is **composition + prefetch shells**, not “cache all user data.” Personal ambition/move payloads stay request-time by design.

## Performance & Cost (Vercel Hobby)

- **Perceived speed first:** Optimistic UI + in-place spinners; user actions should feel instant
- **Actual speed:** Minimize HTTP round-trips (batch APIs, one fetch per page where possible); overlap independent server work with `Promise.all`
- **Serverless cost:** Fewer `router.refresh()` calls and narrower `revalidatePath` scopes = fewer full RSC re-renders; Partial Prefetching shared shells + static landing prerender; keep CSP nonce-free on marketing where applicable
- **Navigation:** Cache Components shells + `loading.tsx` + selective Link prefetch; ambition detail and list are the hot paths

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
