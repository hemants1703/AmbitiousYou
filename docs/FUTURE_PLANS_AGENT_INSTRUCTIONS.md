# Agent instructions — stealth Pro (build now, hide from everyone except founder)

Give this file to a coding agent as the **task spec**. Product intent lives in [`FUTURE_PLANS.md`](./FUTURE_PLANS.md). AI implementation detail lives in [`AI-ROADMAP.md`](./AI-ROADMAP.md). **This file decides what to code, in what order, and how to hide it.**

Repo: pnpm monorepo. Backend `apps/backend` (NestJS 11 + Drizzle + Postgres). Frontend `apps/frontend` (Next.js App Router). Follow [`AGENTS.md`](../AGENTS.md) and [`apps/frontend/AGENTS.md`](../apps/frontend/AGENTS.md).

---

## 0. Mission (one paragraph)

Build **every Pro feature** in the **existing Nest + Next** stack. Ship them to production. **Do not show them in the UI** to hosted-app users. Unlock them **only** when `users.plan = 'pro'` in Postgres. That row will be **the founder only**. New signups stay `free` and keep using today’s public app unchanged. **Do not mention Pro, prices, checkout, or a feature list** on marketing or settings. Public copy is already: *free for a limited time; an upgraded version with meaningful upgrades is underway; create your account today.* Do **not** integrate payments. Do **not** rewrite to Spring Boot. Do **not** spend time on LICENSE / OSS policy. After the founder has used this to learn Spring and close career ambitions, a **later** human pass migrates the API to Spring, adds a MoR, and then lists Pro on `/pricing`.

---

## 1. Hard rules (violate any → stop)

1. **Gate on the server.** Every Pro HTTP route uses `SessionGuard` **and** a `ProGuard` (or equivalent `assertPro(userId)` that throws `ForbiddenException`). UI hiding is not security.
2. **Hide, don’t tease.** If `user.plan !== 'pro'`: do not render the control, nav item, empty state, lock icon, “Coming soon”, “Upgrade”, or Pro feature names. Free users must not know the surface exists.
3. **Do not cap free users** in this mode. Unlimited ambitions stay for `free`. Launch packaging (1 vs 3 ambitions) is later.
4. **Do not take money.** No Dodo/Polar/Stripe, no checkout button, no webhook, no “Upgrade to Pro”.
5. **Do not mention Pro in public copy.** Pricing, billing settings, homepage, FAQs, `/pricing.md`, compare pages: limited-time free only. Internal code names (`plan`, `ProGuard`, `isPro`) are fine.
6. **Signup stays open.** `createUser` always inserts `plan: 'free'`. Never auto-promote.
7. **Founder is the only Pro.** After the migration, set **one** email via SQL (or a one-shot `BETA_PRO_EMAILS` env used only to flip that row). Do not commit the email if it is sensitive; document the SQL in the PR description.
8. **Build in Nest.** Spring rewrite is out of scope for this agent.
9. **Do not change forever-free copy back.** Public billing/pricing already says limited-time free. Keep it.
10. **Loop before résumé AI.** Today’s one contract + Friday review must ship and be usable by the founder before RAG, files, calendar, or web research. If time is limited, stop after Wave 2 rather than shipping a chatbot with no loop.

---

## 2. Read first (do not skip)

| File | Why |
|---|---|
| `docs/FUTURE_PLANS.md` §6, §10, §19 | What Pro *is* (the achievement loop) |
| `docs/AI-ROADMAP.md` | How to build AI later (Waves 3–4) |
| `apps/backend/src/db/schema/users.ts` | Add `plan` here |
| `apps/backend/src/db/schema/enums.ts` | Add `userPlanEnum` next to existing pgEnums |
| `apps/backend/src/users/users.service.ts` | `publicUserColumns` already strips `passwordHash`; `plan` must be in the public projection |
| `apps/frontend/src/types/domain.ts` | Hand-written `User` — add `plan` |
| `apps/frontend/src/lib/auth.ts` | `requireUser()` already returns `User` — thread `plan` from `GET /users` |
| `apps/frontend/src/lib/pricing/free-plan.ts` | Public copy source. Do not add a Pro feature array here |
| `apps/frontend/src/components/(app)/settings/billing-settings-tab.tsx` | Must stay limited-time free, **no Pro card** |
| `apps/frontend/src/components/(app)/dashboard/today-focus.tsx` | Today is a due/overdue **queue** — Pro changes this to **one contract** |
| `apps/frontend/src/components/(app)/dashboard/weekly-preview.tsx` | Look-ahead list — Pro adds a separate Friday review card |
| `apps/frontend/src/components/(app)/dashboard/needs-attention-stat.tsx` | Display — Pro turns it into a coach |
| `.github/workflows/reminders-cron.yml` | 09:00 / 18:00 reminders — Pro changes 18:00 copy for the contract |

Commands from repo root: `pnpm --filter backend test`, `pnpm --filter backend lint`, `pnpm --filter frontend lint`, `pnpm --filter backend db:generate` then review SQL, never invent migration filenames by hand if drizzle-kit can generate them.

---

## 3. Wave 0 — plan column + gate (do this before any Pro UI)

### Schema

In `apps/backend/src/db/schema/enums.ts`:

```ts
export const userPlanEnum = pgEnum('UserPlan', ['free', 'pro']);
```

In `apps/backend/src/db/schema/users.ts` add:

```ts
plan: userPlanEnum('plan').notNull().default('free'),
```

`User` is `Omit<typeof users.$inferSelect, 'passwordHash'>` — `plan` will appear automatically on the backend type.

Generate migration: `pnpm --filter backend db:generate`. Review SQL: `ALTER TABLE "users" ADD COLUMN "plan" "UserPlan" DEFAULT 'free' NOT NULL`.

After migrate, flip founder only:

```sql
UPDATE users SET plan = 'pro' WHERE email = '<founder-email>' AND plan = 'free';
```

Optional bootstrap: if `process.env.BETA_PRO_EMAILS` is a comma-separated list, on login (not signup) if email matches and `plan = 'free'`, set `plan = 'pro'`. Default env empty. **Signup must still insert `free`.**

### API

- `GET /users` already returns the public user. Include `plan`.
- Add `apps/backend/src/auth/guards/pro.guard.ts`: load user by `request.user.id`, if missing or `plan !== 'pro'` → `ForbiddenException`. Use on every new Pro controller/route.
- Helper `isProPlan(plan: string): plan is 'pro'` in a small `apps/backend/src/auth/plan.ts` (no barrel sprawl).
- Frontend: `apps/frontend/src/types/domain.ts` `User.plan: "free" | "pro"`.
- Frontend helper `apps/frontend/src/lib/plan.ts`: `export function isPro(user: User | null | undefined): boolean { return user?.plan === "pro"; }`.
- Frontend **MUST NOT** send `plan` on PATCH `/users`. Backend UpdateUserDto must not accept `plan` (ValidationPipe `forbidNonWhitelisted`).

### Tests

- UsersService create → `plan === 'free'`.
- ProGuard: free user 403, pro user pass.
- UsersController / public columns include `plan`, never `passwordHash`.

**DoD:** founder row is `pro` in the DB the hosted app uses; `GET /users` as founder returns `"plan":"pro"`; as any other user `"plan":"free"`. No UI change required in Wave 0 except types compiling.

---

## 4. Wave 1 — the loop (this is the actual Pro product)

Product: [`FUTURE_PLANS.md`](./FUTURE_PLANS.md) §6 and §10. Prefer **small schema** and reuse notes/tasks. New tables only when a note cannot hold the object.

All of the following is **Pro-only**: free dashboard stays exactly as it is today (due queue, weekly preview list, Needs Attention as a stat).

| Feature | Behavior for `plan = pro` | Suggested persistence | Touch these first |
|---|---|---|---|
| Primary ambition | Exactly one primary. Reuse `isFavourited` as primary until a dedicated `isPrimary` is justified. Favouriting a second one unsets the first (transaction). | `ambitions.isFavourited` | ambitions service + ambition list UI |
| Done means | Require / surface `ambitionDefinition` as “Done means ____ by [end date]” on Today and ambition header | existing `ambitionDefinition` | create/edit ambition, today panel |
| Today’s **one** contract | Not the full due queue. Pin one move (milestone preferred) on the primary ambition for local today. Complete / snooze-to-tomorrow | new table `daily_contracts` **or** a well-named note + task id if you can query it reliably. A table is OK: `id, userId, ambitionId, moveKind, moveId, localDate, status, createdAt` | replace `today-focus.tsx` **only inside `isPro` branch**; keep current component for free |
| Friday weekly review | 4 prompts: moved / stalled / skip / next week’s contract. Persist. Title `Weekly review YYYY-MM-DD` | `notes` with a convention **or** `weekly_reviews` table if querying by week is painful | new card next to `weekly-preview.tsx`, Pro only |
| Missed-day recovery | If yesterday’s contract was not done: “10-minute restart tomorrow” CTA that writes tomorrow’s contract | same contract table | sibling of `revive-missed.tsx` |
| Needs Attention coach | Rules, not LLM: days since last completed move, days to end date, next unfinished milestone, proposed 20-min action | derived read endpoint `GET /loop/attention` | `needs-attention-stat.tsx` Pro variant |
| If-then (when/where) | Optional fields on the contract: `ifTrigger`, `thenAction` (plain text) | columns on `daily_contracts` | contract UI |

**Frontend pattern:** in the dashboard page/server component, `const pro = isPro(user)`. `{pro ? <TodayContract /> : <TodayFocus />}`. Do not wrap free UI in a lock. Do not add dashboard nav labels like “Contract” for free users.

**Backend:** `apps/backend/src/loop/` module (controller + service + dto) behind `SessionGuard` + `ProGuard`. Keep Drizzle style from AGENTS.md (singleton `db`, no `db.query`, transactions for multi-row writes).

**DoD:** logged in as founder, dashboard shows one contract + a way to write this week’s review. Logged in as a normal user, dashboard is byte-for-byte the old tracker (no new cards). Hitting `POST /loop/*` as free → 403.

---

## 5. Wave 2 — reminder intelligence (still rules, still Pro)

Existing: `.github/workflows/reminders-cron.yml` + notifications module (email/push, timezone, 09:00 / 18:00).

Pro-only changes:

- 18:00: “Did you finish today’s contract: {title}? Yes / snooze to tomorrow.”
- Do not change 09:00/18:00 copy for `plan = free` (keep current due/overdue nags).
- Stall copy for Pro: no streak shame; next action + end-date pressure.

**DoD:** founder with reminders on gets contract-aware 18:00; a free user with a due task still gets the old nag.

---

## 6. Wave 3 — AI breakdown + coach (Pro, after Wave 1 is usable)

Follow [`AI-ROADMAP.md`](./AI-ROADMAP.md) ① and ③. **Gated `ProGuard`.** No free AI. Rate-limit tighter than normal routes (`@Throttle`).

- `POST /ambitions/:id/ai-breakdown` — Claude tool-calling, Zod/class-validator on tool input, return proposal, **never auto-write**. Accept endpoint writes via existing ambition transaction.
- Insights/coach: store in `insights` or notifications; dashboard panel **only if `isPro`**.
- Secrets: `ANTHROPIC_API_KEY` in env / Vercel / GitHub Environments. Never git. If the key is missing, Pro endpoints return 503 with a boring message — do not skip the gate.

**DoD:** founder can generate a plan and accept it; free user has no button and 403 on the route.

---

## 7. Wave 4 — files + RAG chat (Pro)

[`AI-ROADMAP.md`](./AI-ROADMAP.md) ②. pgvector + `embeddings` table, tenant filter `userId` on every query, stream chat. Chat **must** be able to propose a move or a review note, not a generic essay. Upload/attach files to **this ambition**.

UI: no sidebar “Assistant” for free users. No marketing screenshot of chat.

Need `OPENAI_API_KEY` (embeddings) + Anthropic. Same secret rules.

---

## 8. Wave 5 — calendar block + optional Reminders push (Pro)

[`FUTURE_PLANS.md`](./FUTURE_PLANS.md) Phase 6: **one** integration — block 45 minutes for today’s contract (Google Calendar first is fine). Optional one-way: today’s contract → Apple Reminders. **Never** pull the user’s whole inbox into AY. **Never** Notion/Slack/Jira.

OAuth secrets in env. ProGuard on connect + write routes.

---

## 9. Wave 6 — extras only if Waves 1–2 are in daily use

- Milestone-weighted progress % (milestones heavier than tasks) — can be Pro-only calculation with a flag, or behind plan.
- Proof log (private brag list) — Pro UI only.
- Export CSV/PDF of ambitions — Pro route + UI.
- ICP templates (Staff packet, AWS SAA 12-week, PMP 8-week) — templates may stay public; they already exist. Do **not** put “Pro” on the templates page.

Skip Team seats, Accountability SKU, native apps, public social, Zapier.

---

## 10. Public copy (already done — do not regress)

These files must **not** grow a Pro feature list or an Upgrade button until official launch:

- `apps/frontend/src/lib/pricing/free-plan.ts`
- `apps/frontend/src/components/(app)/settings/billing-settings-tab.tsx`
- `apps/frontend/src/app/(landing)/pricing/page.tsx`
- `apps/frontend/src/app/(landing)/pricing/opengraph-image.tsx`
- `apps/frontend/src/app/pricing.md/route.ts`
- `apps/frontend/src/lib/seo/faqs.ts` (`pricingFaq`)

Allowed public language:

> AmbitiousYou is free for a limited time. An upgraded version with significant, meaningful upgrades is underway. Create your account today.

Forbidden public language: “Pro”, “$12”, “coming soon: AI / RAG / weekly review”, “Upgrade”, “forever free”, “actually free”.

---

## 11. Out of scope (refuse if asked in the same session)

- Payment gateway / MoR / checkout
- Spring Boot rewrite
- Capping free ambitions
- Closing signups
- LICENSE / dual-license / closing the repo
- Showing Pro features to free users “so they get excited”
- Building Wave 4–5 before Wave 1 works for the founder

---

## 12. Suggested PR slices (keep them reviewable)

1. Wave 0 schema + ProGuard + frontend `User.plan` + founder SQL
2. Wave 1 contract + primary + done-means
3. Wave 1 weekly review + missed-day + attention coach
4. Wave 2 reminders
5. Wave 3 AI breakdown
6. Wave 3 coach
7. Wave 4 files/RAG
8. Wave 5 calendar

Each PR: tests for the gate (free 403, pro 200), no marketing copy changes unless fixing a regression.

---

## 13. Launch (not this agent)

Later, a human will: migrate Nest → Spring (same HTTP, same Postgres, `users.plan` unchanged), plug Dodo/Polar webhooks into `plan`, then put **$12/mo or $99/yr** and the real Pro list on `/pricing` and billing. Until that day, this file’s rules win.
