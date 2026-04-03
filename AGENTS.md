## Project Overview

AmbitiousYou is a goal-tracking app on steroids — focus on life goals in a prioritised approach and become a superhuman!

### Key Features

- **Ambitions**: Add/update/delete life goals broken down into smaller tasks and milestones. _e.g.: "Achieve 9+ GPA this semester" → break down steps to achieve it!_
  - `task`: Time-bound, recurring actions (e.g., "Exercise 3x/week", "Save $100/month")
  - `milestone`: Sequential achievements (e.g., "5K → 10K → Half Marathon → Marathon")
- **Notes**: Add/edit/delete notes to Ambitions
- **Ambition Stats & Details**: Current state, start/end dates, priority, completion percentage

### Tech Stack

- Next.js (App Router, Route Handlers) · TypeScript · Supabase (PostgreSQL, Drizzle) · Vercel
- BetterAuth (Email signup) · pnpm · Playwright (E2E) · Tabler Icons · shadcn · `cn` utility
- Zod for strict input validation in Route Handlers and Server Actions
- Notifications microservice integration via `NOTIFICATIONS_SERVICE_BASE_URL` (used by `src/services/emailService.ts` and `src/app/api/health/route.ts`)

### Project Structure

**Root**: `/public` (static content), `AGENTS.md` (single source of project context)

**`/src`**:

- `/app` — App Router; `/app/api` — Route Handlers (use services)
- `/components` — Common UI components
- `/features` — Route-specific components, forms, Server Actions _(e.g., `ambitions/CreateNewAmbition/actions.ts`, `ambitions/components/AmbitionCard.tsx`)_
- `/hooks` — Custom React Hooks
- `/db` — Drizzle & DB work
- `/lib` — Utilities and auth helpers; `/lib/auth/auth.ts` — BetterAuth config; `/lib/auth/confirmSession.ts` — session guard for Server Components/Actions
- `/services` — Class-based services for Route Handlers _(e.g., `ambitionsService.ts`)_
- `/styles` — Stylesheets
- `/types` — TypeScript types; `globals.ts` for shared types _(e.g., `interface Ambition`)_, local types defined where needed _(e.g., `AmbitionPageProps` in page.tsx)_
- `/tests` — Playwright tests
- `/utils/validators` — Shared Zod validators for nested payloads in Server Actions _(e.g., `taskSchema.ts`, `milestoneSchema.ts`)_

### Design System

**Principle**: Heavily B&W; accent colors for key elements only — don't overuse.

```css
--custom-light: #64ccc5;
--custom-dark: #176b87;
--custom-light-pale: rgba(100, 204, 197, 0.3);
--custom-completed: rgba(16, 185, 129, 0.3);
--custom-ongoing: rgba(59, 130, 246, 0.3);
--custom-future: rgba(168, 85, 247, 0.3);
--custom-incomplete: rgba(255, 99, 71, 0.3);
--custom-background-gradient-start: rgba(100, 204, 197, 0.251);
--scrollbar-bg-light: #fff;
--scrollbar-thumb-light: #000;
--scrollbar-bg-dark: #000;
--scrollbar-thumb-dark: #fff;
```

### Development Conventions

**Code Quality**: Production-grade, efficient, bug-free, cost-effective.

- **Services**: Class-based _(e.g., `AmbitionsService.ts`)_. Methods return `Promise<T | Error>`. Use services to fetch data in Server Components.
- **Server Components first**: Client Components only for browser APIs/interactivity. Extract client-specific parts to `/features/<route>/components/` and `/features/<route>/actions.ts`.
- **Error Handling**: Services throw → Server Components catch → `error.tsx` renders. Use `loading.tsx` when needed.
- **Forms**: Tightly integrated with `useActionState<>()` (fully typed) + Server Actions.
- **Auth wiring**: BetterAuth handler lives at `src/app/api/auth/[...all]/route.ts` and uses `src/lib/auth/auth.ts`; protect app pages/actions with `confirmSession`.
- **Commands**: Use pnpm scripts from `package.json` (`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm db:migrate`, `pnpm db:studio`); run E2E with `pnpm exec playwright test`.
- **95% confidence rule**: Ask clarifying questions before implementing.
