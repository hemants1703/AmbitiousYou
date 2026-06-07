<div align="center">

<img src="https://res.cloudinary.com/dej4ks4wd/image/upload/v1765910319/OG_IMAGE_AY.png" alt="AmbitiousYou" width="100%" />

# AmbitiousYou

### Where ambitious goals become inevitable outcomes.

A full-stack goal & progress-tracking platform that turns big, vague ambitions into structured, measurable plans — and keeps the numbers honest by computing progress on the server, inside the same transaction as every change.

<p>
  <!-- <a href="https://www.ambitiousyou.pro"><img src="https://img.shields.io/badge/Live-www.ambitiousyou.pro-64ccc5?style=flat-square&logo=vercel&logoColor=white" alt="Live site" /></a> -->
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React%2019-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/NestJS%2011-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
</p>

<p>
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-engineering-highlights">Engineering Highlights</a> ·
  <a href="#-data-model">Data Model</a> ·
  <a href="#-about-the-author">Author</a>
</p>

</div>

---

## Overview

**AmbitiousYou** helps people structure their biggest goals — *ambitions* — and drive them to completion. Each ambition is broken down with one of two tracking philosophies (granular **tasks** or one-time **milestones**), annotated with notes, and scored with a live completion percentage that the system derives automatically as work gets done.

It's built as a **TypeScript monorepo** with a clean separation of concerns:

- A **NestJS 11 + PostgreSQL** REST API using **Drizzle ORM** in a deliberate, SQL-first style.
- A **Next.js 16 (App Router, React 19)** frontend that is Server-Component-first, with Server Actions for mutations and a statically rendered, SEO-optimized marketing site.
- A **single shared package** that is the **one source of truth for the database schema *and* the API types** consumed by both apps.

> This repository is a portfolio-grade demonstration of end-to-end product engineering: data modeling, REST API design, session authentication, type-safe client/server contracts, modern React (RSC + Server Actions), technical SEO, and developer experience.

---

## ✨ Engineering Highlights

The parts I'm most proud of — each one is a deliberate decision, not an accident:

| # | Decision | Why it matters |
|---|----------|----------------|
| 1 | **One schema, two consumers.** The Drizzle `pgTable` definitions in `packages/shared` are the single source of truth. The backend imports them for runtime queries *and* migration generation; the frontend imports the **inferred types** for its API contracts. | Change a column once and both sides' types update on the next build. There is no hand-written, drift-prone DTO duplicated across the stack. |
| 2 | **Data integrity by construction.** An ambition's completion `%` and derived status (`active` / `completed` / `missed`) are **recomputed on the server inside the same DB transaction** as the task/milestone mutation that triggered them — via a single SQL `count(*) FILTER (WHERE …)` aggregate. | Progress can never drift out of sync, there's no race between two queries, and the client needs **zero** extra round-trips to stay accurate. |
| 3 | **Opaque session auth, no JWT.** Server-issued UUID session tokens stored in Postgres, delivered via an `httpOnly` cookie, validated by a `SessionGuard` that also **self-cleans expired sessions**. | Tokens are revocable and stateless-token pitfalls (can't-revoke, oversized cookies) are avoided. Auth state lives where it can be trusted. |
| 4 | **Secure-by-default reads.** A `passwordHash` "default-deny" column projection means every public user query physically cannot leak the hash — only the single login path opts into reading it. | Security is enforced by the query shape, not by remembering to omit a field. |
| 5 | **RSC-first frontend.** Next.js 16 with the React Compiler and Turbopack. Server Components by default; `"use client"` only where interactivity demands it; mutations flow through typed Server Actions. | Minimal client JS, fast loads, and a clean rendering boundary. |
| 6 | **A marketing site that's static *and* auth-aware *and* self-healing.** The landing pages are `force-static` for SEO, yet still show "Go to Dashboard" to logged-in users — validated against the backend via a dynamic route handler that clears stale cookies when a session is gone. | You don't have to choose between a fast, indexable static site and correct, personalized UI. |
| 7 | **Technical SEO, done properly.** Per-page canonical URLs, JSON-LD structured data (Organization, WebSite, SoftwareApplication, FAQ), and generated `sitemap.xml` / `robots.txt` / `manifest` — all driven from one site-config source of truth. | The product is built to be discovered, not just built. |
| 8 | **Strict input validation.** A global `ValidationPipe` with `whitelist + forbidNonWhitelisted + transform` rejects any unexpected field with a 400; every payload is DTO-defined. | The API has a hard, explicit contract surface. |

---

## 🧱 Tech Stack

<table>
<tr><td valign="top" width="50%">

**Backend** — `apps/backend`
- **NestJS 11** (modular, dependency-injected)
- **Drizzle ORM 0.45** over **PostgreSQL** (`pg`)
- Opaque-token sessions + `bcrypt` password hashing
- `class-validator` DTOs + global `ValidationPipe`
- **drizzle-kit** migrations
- **Jest 30** unit tests (auto-mocked DB layer)

</td><td valign="top" width="50%">

**Frontend** — `apps/frontend`
- **Next.js 16** App Router, **React 19**, **React Compiler**
- **Turbopack**, **TypeScript 5**
- **Tailwind CSS v4** + **shadcn/ui** (Radix)
- **Framer Motion**, **Recharts**, **dnd-kit**, **TanStack Table**
- **next-themes** (dark mode), **sonner** toasts
- Server Actions + a single Route Handler boundary

</td></tr>
<tr><td valign="top">

**Shared** — `packages/shared`
- Drizzle schema = **single source of truth**
- Inferred domain types (`User`, `Ambition`, `Task`, …)
- Built to CJS; consumed type-only by the frontend

</td><td valign="top">

**Tooling & Infra**
- **pnpm** workspace monorepo
- ESLint 9 + Prettier
- Graceful shutdown (SIGTERM/SIGINT → pool drain)
- Strict, accessibility-first UI rule set (`AGENTS.md`)

</td></tr>
</table>

---

## 🏗 Architecture

A pnpm monorepo with three workspaces. The shared package sits between the apps as the contract that keeps them in lockstep.

```mermaid
flowchart LR
    subgraph Browser
        UI["Next.js 16 · React 19<br/>RSC + Server Actions"]
    end

    subgraph FE["apps/frontend"]
        direction TB
        SC["Server Components<br/>requireUser() gate"]
        ACT["Server Actions<br/>+ /api route handlers"]
    end

    subgraph SHARED["packages/shared"]
        SCHEMA["Drizzle schema<br/>tables + inferred types"]
    end

    subgraph BE["apps/backend · NestJS :3001"]
        direction TB
        GUARD["SessionGuard + ValidationPipe"]
        MODS["Modules: auth · ambitions ·<br/>tasks · milestones · notes · settings"]
    end

    DB[("PostgreSQL")]

    UI -->|"interactions"| SC
    UI -->|"mutations"| ACT
    SC -->|"Bearer token"| GUARD
    ACT -->|"HTTP + Bearer"| GUARD
    GUARD --> MODS
    MODS -->|"Drizzle (SQL-style)"| DB

    SCHEMA -. "types only" .-> FE
    SCHEMA -. "tables + types" .-> BE
```

**Request lifecycle (a typical mutation):** a client component calls a typed **Server Action** → the action attaches the session token and `POST`/`PATCH`es the NestJS API → `SessionGuard` validates the token → the feature service runs the write inside a **transaction**, recalculating derived state atomically → the action `revalidatePath()`s the affected routes and the UI reconciles.

**Why Drizzle, SQL-first:** services import a process-wide `db` client and write queries that read like SQL (`db.select().from().innerJoin().where()`), use explicit transactions for multi-entity creates, and prefer a single filtered aggregate over multiple count queries. No relational-builder magic, no hidden N+1s — the data access is exactly what you'd expect from the SQL.

---

## 🗄 Data Model

Every domain type is **inferred from these tables** and shared across the stack. Ownership cascades from the user; deleting a user (or an ambition) cleanly removes everything beneath it.

```mermaid
erDiagram
    USERS ||--o{ AMBITIONS : owns
    USERS ||--o{ SESSIONS : authenticates
    USERS ||--|| SETTINGS : configures
    AMBITIONS ||--o{ TASKS : "tracked by"
    AMBITIONS ||--o{ MILESTONES : "tracked by"
    AMBITIONS ||--o{ NOTES : "annotated by"

    USERS {
        uuid id PK
        text email UK
        text passwordHash "never exposed by public reads"
        bool emailVerified
    }
    AMBITIONS {
        uuid id PK
        uuid userId FK
        varchar ambitionName
        enum ambitionTrackingMethod "task or milestone"
        enum ambitionStatus "active, completed, missed"
        enum ambitionPriority "low, medium, high"
        int ambitionPercentageCompleted "server-derived"
        bool isFavourited
        timestamp ambitionStartDate
        timestamp ambitionEndDate
    }
    TASKS {
        uuid id PK
        uuid ambitionId FK
        varchar task
        bool taskCompleted
        timestamp taskDeadline
    }
    MILESTONES {
        uuid id PK
        uuid ambitionId FK
        varchar milestone
        bool milestoneCompleted "one-way / permanent"
        timestamp milestoneTargetDate
    }
    NOTES {
        uuid id PK
        uuid ambitionId FK
        text note
    }
    SETTINGS {
        uuid id PK
        uuid userId UK "one row per user"
        varchar userTimezone
        bool emailAccountActivity
        bool pushAmbitionReminders
    }
    SESSIONS {
        uuid id PK
        uuid userId FK
        varchar token
        timestamp expiresAt
    }
```

A nice detail: **tasks and milestones are deliberately different.** Tasks are checkable and reversible. Milestones model one-time achievements — completing one is **permanent** (the UI gates it behind a confirm dialog and the backend rejects re-opening), because "I graduated" doesn't get un-happened.

---

## 🚀 Feature Tour

- **Ambitions** — create a goal with a tracking method, priority, start/end dates, and a definition; favourite, edit, and watch its progress bar fill as work completes.
- **Dual progress tracking** — switch between task-based and milestone-based execution per ambition; the completion `%` and status are computed for you.
- **Execution board** — manage tasks/milestones inline with **optimistic UI**, a search-and-filter drawer, and instant reconciliation on the server response.
- **Notes** — capture context against any ambition.
- **Dashboard** — an at-a-glance view of active ambitions and progress insights, aggregated resiliently with `Promise.allSettled` so one slow fetch never breaks the page.
- **Settings** — timezone-aware preferences and notification toggles.
- **Auth** — email/password sign-up & login, server-validated session gating on every protected route, and a polished, accessible marketing site for logged-out visitors.

---

## 📁 Project Structure

```
AmbitiousYou/
├── apps/
│   ├── backend/                 # NestJS 11 + Drizzle + PostgreSQL (REST API :3001)
│   │   ├── src/
│   │   │   ├── auth/            # SessionGuard, decorators, login/register/logout
│   │   │   ├── ambitions/      # incl. ambition-progress.util.ts (atomic recalc)
│   │   │   ├── tasks/ milestones/ notes/ settings/ users/
│   │   │   └── db/             # pg.Pool client + drizzle wiring + migrations
│   │   └── drizzle.config.ts
│   └── frontend/                # Next.js 16 App Router (React 19, RSC, Turbopack)
│       └── src/
│           ├── app/            # (landing) static SEO pages · (auth) · (app) gated · sitemap/robots/manifest
│           ├── components/     # Server + client components, shadcn/ui
│           ├── lib/            # api/ (reads) · actions/ (mutations) · auth.ts · seo/ · site.ts
│           └── hooks/
├── packages/
│   └── shared/                  # ⭐ Drizzle schema = single source of truth (tables + types)
└── pnpm-workspace.yaml
```

---

## 🛠 Getting Started

**Prerequisites:** Node.js 20+, [pnpm](https://pnpm.io) 11+, and a PostgreSQL database.

```bash
# 1. Clone and install (installs all three workspaces)
git clone https://github.com/hemants1703/AmbitiousYou.git
cd AmbitiousYou
pnpm install
```

**2. Configure the backend** — create `apps/backend/.env.development`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ambitiousyou_dev"
PORT=3001
```

**3. Configure the frontend** — create `apps/frontend/.env.local`:

```env
API_URL="http://localhost:3001"
# Optional: overrides the canonical site URL used for SEO
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**4. Run migrations and start both apps:**

```bash
# Apply the database schema
pnpm --filter backend db:migrate

# In two terminals (from the repo root):
pnpm start:backend     # NestJS on http://localhost:3001
pnpm start:frontend    # Next.js on http://localhost:3000
```

<details>
<summary><b>Useful workspace commands</b></summary>

```bash
# Backend
pnpm --filter backend test            # Jest unit tests
pnpm --filter backend db:generate     # diff schema → new migration SQL
pnpm --filter backend db:studio       # browse the DB

# Frontend
pnpm --filter frontend build          # production build
pnpm --filter frontend lint
```

The schema lives in `packages/shared/db/schema/*`. Edit a table there, run `db:generate`, review the SQL, then `db:migrate` — and both the API and the frontend types update on the next build.

</details>

---

## 🔬 Engineering Deep-Dives

<details>
<summary><b>Atomic, server-derived progress (the integrity guarantee)</b></summary>

When a task or milestone is toggled, the mutation and the ambition's recalculated state commit together. One load, one filtered aggregate, one update — all inside the caller's transaction:

```ts
// apps/backend/src/ambitions/ambition-progress.util.ts
const [{ total, completed }] = await tx
  .select({
    total:     sql<number>`count(*)::int`,
    completed: sql<number>`count(*) filter (where ${tasks.taskCompleted})::int`,
  })
  .from(tasks)
  .where(and(eq(tasks.ambitionId, id), eq(tasks.userId, userId)));

const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
// → derives 'completed' (+ completion date) at 100%, else 'active' / 'missed' vs. end date,
//   then persists in the SAME transaction. No drift, no extra client call.
```

</details>

<details>
<summary><b>Session auth without JWTs</b></summary>

`SessionGuard` accepts the token from either the `sessionToken` cookie or an `Authorization: Bearer` header, looks it up in Postgres, **deletes it if expired**, and attaches `{ id }` to the request — so downstream services never re-query the user just to authorize. The frontend mirrors this with a three-tier gate (`requireUser()` validates on every protected render; `getSessionToken()` only grabs the token for a backend call that itself enforces auth).

</details>

<details>
<summary><b>Static, SEO-friendly pages that still know who you are</b></summary>

The marketing pages render statically (`force-static`) for indexability and speed. A non-`httpOnly` "hint" cookie lets client components optimistically show the logged-in CTA without making the page dynamic — then a dynamic `/api/auth/status` route handler confirms the session against the backend and **clears stale cookies** if it's invalid, so the UI self-heals to the correct state.

</details>

---

## 🗺 Roadmap

- 📊 Richer analytics & time-investment insights across ambitions
- 🔔 Email + push reminders (the settings + schema scaffolding already exist)
- 📱 Native mobile apps
- 🤝 Public ambition sharing & accountability

---

## 👤 About the Author

**Hemant Sharma** — a full-stack engineer who enjoys designing systems that are correct by construction, type-safe end to end, and pleasant to use.

This project showcases how I approach building software: clear data modeling, strong contracts between layers, security and integrity baked into the design rather than bolted on, and a relentless focus on developer and user experience.

<p>
  <a href="https://hemantsharma.tech"><img src="https://img.shields.io/badge/Website-hemantsharma.tech-111?style=flat-square&logo=googlechrome&logoColor=white" alt="Website" /></a>
  <a href="https://github.com/hemants1703"><img src="https://img.shields.io/badge/GitHub-hemants1703-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub" /></a>
  <a href="https://linkedin.com/in/hemants1703"><img src="https://img.shields.io/badge/LinkedIn-hemants1703-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://bsky.app/profile/hemantsharma.tech"><img src="https://img.shields.io/badge/Bluesky-@hemantsharma.tech-0285FF?style=flat-square&logo=bluesky&logoColor=white" alt="Bluesky" /></a>
</p>

> **Hiring or curious?** I'd love to talk. Reach out via [my website](https://hemantsharma.tech) or [LinkedIn](https://linkedin.com/in/hemants1703).

---

<div align="center">

Built with care by **Hemant Sharma** · © 2026

<sub>If this project resonates with you, consider giving it a ⭐ — it genuinely helps.</sub>

</div>
