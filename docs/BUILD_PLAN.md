# Build Plan — Stealth Pro (implement the rest of FUTURE_PLANS_AGENT_INSTRUCTIONS.md)

Date: 2026-08-14. Branch: `dev`. Reads: `docs/FUTURE_PLANS_AGENT_INSTRUCTIONS.md` (task spec), `docs/FUTURE_PLANS.md` (§6/§10/§19), `docs/AI-ROADMAP.md`.

## Progress assessment

**Waves 0–2 — done, tested, committed** (backend tests 79/79, frontend tests 73/73 pass).

| Wave | Status | What exists |
|---|---|---|
| 0 — plan + gate | ✅ Done | `users.plan` + `UserPlan` enum + migration; `ProGuard` (`src/auth/guards/pro.guard.ts`); `isProPlan` (`src/auth/plan.ts`); frontend `User.plan` + `isPro` (`src/lib/plan.ts`); `FOUNDER_PLAN_EMAILS` login bootstrap; `UpdateUserDto` rejects `plan` via `forbidNonWhitelisted`. Tests: `pro.guard.spec.ts`, `users.service.spec.ts` (create → `plan: 'free'`, public projection includes `plan`, never `passwordHash`). |
| 1 — the loop | ✅ Done | `loop` module: daily contract (upsert/complete/snooze), weekly review (4 prompts), attention coach, missed-day + restart-tomorrow, primary = `isFavourited` (transaction unsets prior), if-then (`ifTrigger`/`thenAction`). Tables `daily_contracts` + `weekly_reviews` migrated. Dashboard gated via `isPro`: TodayContract, WeeklyReviewCard, NeedsAttentionCoach, MissedDayRecovery, DoneMeansBanner. Free dashboard unchanged (TodayFocus, WeeklyPreview list, NeedsAttention stat). |
| 2 — reminders | ✅ Done | `notifications/reminders.service.ts` Pro-aware 18:00 contract copy ("Did you finish today's contract: {title}? Yes / snooze"); free users keep due/overdue nag. Tests updated. |
| 3 — AI breakdown | 🟡 Backend done, UI orphaned | `ai` module: `POST /ai/ambitions/:id/breakdown` + `/breakdown/accept` (Claude tool-calling, `@Throttle`, `ProGuard`). Frontend `AmbitionAiBreakdown.tsx` exists but is **never mounted**. |
| 4 — RAG chat | 🟡 Backend done, UI orphaned | `embeddings` table + pgvector; `POST /ai/chat` (grounded, tenant-filtered) + `POST /ai/index`. Chat UI lives only inside `FounderWorkspace.tsx` which is **never rendered**. No file upload (deferred). |
| 5 — calendar | 🟡 Backend done, UI orphaned | `calendar` module: Google OAuth connect/callback, `POST /calendar/block-contract` (45-min block for today's move). Frontend actions exist (`ai-actions.ts`) but UI only inside orphaned `FounderWorkspace.tsx`. |
| 6 — extras | 🟡 Backend done, UI orphaned | `proof` module (proof log), `export` module (CSV), milestone-weighted progress via `isProPlan` in `ambition-progress.util.ts`. Frontend actions exist but UI only in orphaned `FounderWorkspace.tsx`. ICP templates / AI coach / file upload deferred. |

**Regressions found:**
1. **Marketing copy** — commit `2bcb594` reverted `free-plan.ts`, `/pricing`, `/pricing.md`, `faqs.ts`, OG image, billing tab, and `seo/pages.ts` back to "Forever, for the core experience" / "Free. Actually free." This violates hard rule #9 and §19.2. Restore the limited-time-free copy.
2. **Backend lint** — 3 errors: `pro.guard.ts:11` (unsafe `request['user']` access), `calendar.controller.ts:8` (unused `eq`), plus a third from the `--fix` pass.
3. **Gate tests** — only `loop.controller.spec.ts` asserts the guard. `ai` / `proof` / `export` / `calendar` controllers have no spec; spec §12 requires gate tests (free 403, pro 200).

---

## Plan

### 1. Restore compliant public copy (hard rule #9, §19.2)

Allowed line: *"AmbitiousYou is free for a limited time. An upgraded version with significant, meaningful upgrades is underway. Create your account today."* — no Pro list, no checkout, no prices.

Restore these files to their `2bcb594^` state (the spec-compliant version that was reverted):

- `apps/frontend/src/lib/pricing/free-plan.ts` → `tagline: "Free for a limited time"` + `lede: "An upgraded version with significant, meaningful upgrades is underway. Create your account today."`
- `apps/frontend/src/app/(landing)/pricing/page.tsx` → `title: "Free for a limited time"`, description = `${freePlan.tagline}. ${freePlan.lede}`
- `apps/frontend/src/app/(landing)/pricing/opengraph-image.tsx` → subtitle "Free for a limited time. Create your account today."
- `apps/frontend/src/app/pricing.md/route.ts` → Notes: `${freePlan.lede}` + "There is no checkout today. New accounts sign up on the free plan."
- `apps/frontend/src/lib/seo/faqs.ts` → restore limited-time answers incl. "Will you add paid plans later?"
- `apps/frontend/src/components/(app)/settings/billing-settings-tab.tsx` → restore `AmbitiousYou is free for a limited time. {freePlan.lede}`
- `apps/frontend/src/lib/seo/pages.ts` → summary "Pricing — free for a limited time. Create your account today."

### 2. Fix backend lint

- `pro.guard.ts` — type `request.user` safely (reuse `RequestWithSession`-style cast, avoid `any` member access).
- `calendar.controller.ts` — drop unused `eq` import.
- Re-run `pnpm --filter backend lint` and fix any remaining error.

### 3. Surface FounderWorkspace for pro users

In `apps/frontend/src/app/(app)/dashboard/page.tsx` (server component):
- When `pro`, additionally fetch `getProofLogs(sessionToken)` (`src/lib/api/proof/get-proof-logs.ts` exists).
- Render `<FounderWorkspace initialProofLogs={proofLogs} />` only in the `pro` branch (proof log, CSV export, calendar block, AI chat/index).
- Free dashboard stays byte-for-byte unchanged.

### 4. Surface AmbitionAiBreakdown for pro users

In `apps/frontend/src/app/(app)/ambitions/[ambitionId]/page.tsx`:
- Compute `const pro = isPro(userDetails)` (already returns `User`).
- Render `<AmbitionAiBreakdown ambitionId={ambition.id} />` only when `pro`.

### 5. Add ProGuard gate tests for new controllers

Mirror `loop.controller.spec.ts` pattern (`jest.mock('src/db')`, mock service + `ProGuard`):
- `ai.controller.spec.ts`
- `proof.controller.spec.ts`
- `export.controller.spec.ts`
- `calendar.controller.spec.ts`

Assert: controller delegates to service; `ProGuard` present so a free user gets `ForbiddenException` (403) and a pro user passes (200).

### 6. Verify

- `pnpm --filter backend test`
- `pnpm --filter backend lint`
- `pnpm --filter frontend test`
- `pnpm --filter frontend lint`

## Deferred (per decision — surface UI + fixes only)

- Wave 3 AI coach (insights cron, AI-ROADMAP ③)
- Wave 4 file upload / RAG attachments
- Wave 6 ICP templates (Staff packet, AWS SAA 12-week, PMP 8-week)

## Out of scope (never in this session)

- Payments / MoR / checkout
- Spring Boot rewrite
- Capping free ambitions / closing signups
- LICENSE / OSS policy
- Showing Pro to free users, or any Pro names/prices/teasers in public copy
