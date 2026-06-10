<div align="center">

<img src="https://res.cloudinary.com/dej4ks4wd/image/upload/v1781083117/OG_IMAGE_AY.png" alt="AmbitiousYou" width="100%" />

# AmbitiousYou

### Where ambitious goals become inevitable outcomes.

A full-stack goal & progress-tracking platform that turns big, vague ambitions into structured, measurable plans — and keeps the numbers honest by computing progress on the server, inside the same transaction as every change.

<p>
  <a href="https://www.ambitiousyou.pro"><img src="https://img.shields.io/badge/Live-www.ambitiousyou.pro-64ccc5?style=flat-square&logo=vercel&logoColor=white" alt="Live site" /></a>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React%2019-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/NestJS%2011-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/nginx-009639?style=flat-square&logo=nginx&logoColor=white" alt="nginx" />
</p>

<p>
  <a href="#-getting-started">Getting Started</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-deployment--infrastructure">Deployment</a> ·
  <a href="#-security">Security</a> ·
  <a href="#-engineering-highlights">Engineering Highlights</a> ·
  <a href="#-data-model">Data Model</a> ·
  <a href="#-about-the-author">Author</a>
</p>

</div>

---

## Overview

**AmbitiousYou** helps people structure their biggest goals — *ambitions* — and drive them to completion. Each ambition is broken down into **moves** — a free mix of granular **tasks** and one-time **milestones** — annotated with notes, and scored with a live completion percentage that the system derives automatically as work gets done.

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
| 9 | **Transactional email & account recovery.** Signup sends an **Azure Communication Services** verification email (verify-then-welcome); logged-out **password recovery** and an in-app **reset** run single-use token flows that reuse one `verifications` table and confirm by email — and forgot-password is **non-enumerating**. | The full account lifecycle (verify, recover, change) is handled securely: 1-hour single-use tokens, sessions invalidated on reset, and HTML-escaped templates. |
| 10 | **Defense-in-depth, by design.** Per-IP **rate limiting** (`@nestjs/throttler`) on auth routes, **Helmet** headers, a **CSRF-resistant `POST` logout**, and per-user **ownership checks on every write**. | Brute-force, email-bombing, forced-logout, and cross-tenant writes are closed off — not left to chance. |

---

## 🧱 Tech Stack

<table>
<tr><td valign="top" width="50%">

**Backend** — `apps/backend`
- **NestJS 11** (modular, dependency-injected)
- **Drizzle ORM 0.45** over **PostgreSQL** (`pg`)
- Opaque-token sessions + `bcrypt` password hashing
- Transactional email via **Azure Communication Services**
- Rate limiting (`@nestjs/throttler`) + **Helmet** headers
- `class-validator` DTOs + global `ValidationPipe`
- **drizzle-kit** migrations · **Jest 30** unit tests

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
- **pnpm** workspace monorepo · ESLint 9 + Prettier
- **Docker** (multi-stage) · **GitHub Actions** CI/CD
- **nginx** blue-green · **Let's Encrypt** · DigitalOcean VPS
- **Vercel** (frontend) · **Supabase** Postgres
- Graceful shutdown (SIGTERM → pool drain)

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
        GUARD["Helmet · ThrottlerGuard<br/>SessionGuard · ValidationPipe"]
        MODS["Modules: auth · ambitions · tasks ·<br/>milestones · notes · settings · notifications"]
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

## 🚢 Deployment & Infrastructure

Two environments, fully automated, **zero-downtime** — every `git push` ships. The frontend rides Vercel's git integration; the backend runs as a Docker container on a self-managed Linux VPS, deployed by a hand-built CI/CD pipeline with a blue-green swap behind nginx.

```mermaid
flowchart LR
    PUSH["git push<br/>(dev / main)"]

    subgraph GHA["GitHub Actions"]
        direction TB
        MIG["migrate Supabase<br/>(drizzle-kit)"]
        BUILD["build multi-stage<br/>Docker image"]
        GHCR["push → GHCR"]
        MIG --> BUILD --> GHCR
    end

    subgraph VPS["DigitalOcean VPS"]
        direction TB
        NGINX["nginx + Let's Encrypt TLS"]
        SWAP["blue-green swap<br/>health-gated"]
        CTR["NestJS container :3001"]
        NGINX --> SWAP --> CTR
    end

    VERCEL["Vercel — frontend"]
    SUPA[("Supabase<br/>PostgreSQL")]

    PUSH --> GHA
    PUSH --> VERCEL
    GHCR -->|"scp + SSH"| NGINX
    CTR --> SUPA
    MIG -.-> SUPA
```

| Surface | Production | Development |
|---|---|---|
| Frontend (Vercel) | `www.ambitiousyou.pro` | `dev.ambitiousyou.pro` |
| Backend (VPS) | `api.ambitiousyou.pro` | `api.dev.ambitiousyou.pro` |
| Database (Supabase) | prod project | dev project |

**Zero-downtime blue-green swap.** On deploy, the new image starts on an *idle* port (prod `3001`↔`3002`, dev `3101`↔`3102`) while the current container keeps serving. Only after the new one passes a **DB-aware `/health` check** does nginx's upstream get rewritten and gracefully reloaded — then the old container is drained (`SIGTERM`, 30s grace) and removed. A failed health check **aborts the deploy and leaves production untouched**.

**Multi-stage Docker image.** A `node:22-bookworm-slim` build stage compiles the shared package + backend and prunes to production-only dependencies (`pnpm deploy`); the runtime stage ships only `dist/` + pruned `node_modules`, runs as a **non-root user**, and declares a container `HEALTHCHECK`.

**The pipeline** (`.github/workflows/deploy-backend.yml`): `git push` → verify DB connectivity → run migrations → build & push the image to GHCR → `scp` the deploy script → SSH-trigger the blue-green swap. The branch picks the target — `dev` → dev, `main` → prod — each against its own Supabase project and env file.

**Hardened host.** The Ubuntu VPS is provisioned by one idempotent script (`infra/setup-vps.sh`): Docker, nginx, Certbot, a `ufw` firewall (22/80/443 only), fail2ban, swap, **key-only SSH**, and a least-privilege deploy user whose `sudo` is scoped to *just* the nginx reload. Runtime secrets are injected from host env files — never baked into the image or committed.

---

## 🔒 Security

Defense-in-depth, enforced by the design rather than by remembering to.

**Rate limiting** — `@nestjs/throttler`, per-IP and proxy-aware (`trust proxy`):

| Scope | Limit |
|---|---|
| Global (every route) | **100** req / min |
| `POST /auth/register`, `/auth/login` | **5** req / min |
| `/auth/forgot-password`, verify-email resend | **3** req / min |

- **Sessions, not JWTs** — server-issued **opaque UUID** tokens in PostgreSQL, 7-day TTL, **instantly revocable**, auto-deleted on expiry, validated on every protected request.
- **Password handling** — `bcrypt` (cost 10) + a **default-deny column projection** that makes it *physically impossible* for a public query to return the hash; only the login path opts in.
- **Cookies** — `httpOnly` + `sameSite=lax` + `secure` (production), 7-day max-age.
- **Hard input contract** — global `ValidationPipe` (`whitelist + forbidNonWhitelisted + transform`) rejects any unknown field with a 400.
- **HTTP hardening** — Helmet headers, per-user ownership checks on every write, **non-enumerating** password recovery, and a reset that invalidates all sessions.
- **No CORS attack surface** — all browser→backend traffic goes through server-side Server Actions / route handlers, so the API isn't exposed to cross-origin browser calls.
- **Transport & operations** — TLS everywhere (Let's Encrypt), runtime-injected secrets, and a graceful shutdown that drains the connection pool on every rollover.

---

## 🗄 Data Model

Every domain type is **inferred from these tables** and shared across the stack. Ownership cascades from the user; deleting a user (or an ambition) cleanly removes everything beneath it.

```mermaid
erDiagram
    USERS ||--o{ AMBITIONS : owns
    USERS ||--o{ SESSIONS : authenticates
    USERS ||--o{ VERIFICATIONS : "verify & reset tokens"
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
    VERIFICATIONS {
        uuid id PK
        uuid userId FK
        varchar identifier "email | password-reset"
        varchar value "single-use token · 1h TTL"
        timestamp expiresAt
    }
```

A nice detail: **tasks and milestones are deliberately different.** Tasks are checkable and reversible. Milestones model one-time achievements — completing one is **permanent** (the UI gates it behind a confirm dialog and the backend rejects re-opening), because "I graduated" doesn't get un-happened.

---

## 🚀 Feature Tour

- **Ambitions** — create a goal with a priority, start/end dates, and a definition; favourite, edit, and watch its progress bar fill as work completes.
- **Moves (tasks + milestones)** — track each ambition with a free mix of checkable tasks and one-time milestones; the completion `%` and status are computed for you across both.
- **Execution board** — manage tasks/milestones inline with **optimistic UI**, a search-and-filter drawer, and instant reconciliation on the server response.
- **Notes** — capture context against any ambition.
- **Dashboard** — an at-a-glance view of active ambitions and progress insights, aggregated resiliently with `Promise.allSettled` so one slow fetch never breaks the page.
- **Settings** — timezone-aware preferences and notification toggles.
- **Auth & account lifecycle** — email/password sign-up & login with **email verification** (verify-then-welcome), logged-out **forgot-password** recovery, and an in-settings **password reset** (with an optional "sign out of all devices") — all backed by Azure Communication Services emails. Server-validated session gating guards every protected route, and the marketing site stays polished and accessible for logged-out visitors.

---

## 📁 Project Structure

```
AmbitiousYou/
├── apps/
│   ├── backend/                 # NestJS 11 + Drizzle + PostgreSQL (REST API :3001)
│   │   ├── src/
│   │   │   ├── auth/            # SessionGuard · login/register/logout · verify-email · password reset
│   │   │   ├── notifications/  # Azure Communication Services email + HTML templates
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

# Transactional email (optional in dev). Without AZURE_CONNECTION_STRING the app
# still boots and simply logs-and-skips sends. APP_BASE_URL is the frontend
# origin used to build the links inside emails.
AZURE_CONNECTION_STRING="endpoint=https://<region>.communication.azure.com/;accesskey=<key>"
APP_BASE_URL="http://localhost:3000"
```

> Keep real secrets out of the git-tracked `.env.development` — put a live `AZURE_CONNECTION_STRING` in the gitignored `apps/backend/.env.local` instead.

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

<details>
<summary><b>Account-lifecycle email & recovery (one token table, two flows)</b></summary>

Signup fires a fire-and-forget **Azure Communication Services** verification email; clicking the link marks the account verified and triggers the welcome email. Logged-out password recovery and the in-settings password reset both run token flows that **reuse a single `verifications` table** — keyed by an `identifier` of `email` or `password-reset`, with 1-hour single-use tokens. Forgot-password is **non-enumerating** (an identical response whether or not the address exists), completing a reset **invalidates every session**, and resends are **rate-limited by the live token's lifetime**. Interpolated values are HTML-escaped before they ever touch the template, and email send never blocks the request (fire-and-forget, logged on failure).

</details>

---

## 🗺 Roadmap

**AI features** — planned; full build spec in [`docs/AI-ROADMAP.md`](docs/AI-ROADMAP.md):
- 🧩 **AI goal breakdown** — an LLM decomposes an ambition into structured tasks & milestones with deadlines (tool-calling + schema-validated output).
- 💬 **RAG assistant** — chat grounded in *your own* ambitions, tasks & notes via pgvector semantic search.
- 🧭 **AI progress coach** — scheduled, personalized insights & nudges on your goals.

**Product:**
- 📊 Richer analytics & time-investment insights across ambitions
- 🔔 Push reminders & digest emails (transactional auth emails — verify, welcome, password reset — already ship via Azure Communication Services)
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
