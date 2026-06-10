# AI Roadmap

A buildable plan for three AI features on top of AmbitiousYou. They're ordered by
**leverage** (effort → résumé/keyword payoff): ship ① first, then ② for the full
AI-native keyword set, then ③ which reuses infrastructure we already have.

> **Why these fit the app:** AmbitiousYou already has rich, structured per-user data
> (ambitions → tasks/milestones/notes). That's the perfect substrate for an LLM to
> *break down*, *retrieve over*, and *coach on* — so every feature is genuinely useful,
> not bolted-on AI for its own sake.

## Shared groundwork (do once)
- **New backend module** `apps/backend/src/ai/` (`ai.module.ts`, `ai.service.ts`,
  `ai.controller.ts`, `dto/`) — same shape as the other feature modules, behind `SessionGuard`
  and `@Throttle` (AI calls are expensive — rate-limit them tighter than normal routes).
- **Model providers:**
  - *Generation* → **Anthropic Claude** via `@anthropic-ai/sdk` (latest models, e.g.
    `claude-sonnet-4-6` for cost/latency, `claude-opus-4-8` for hardest reasoning). Reference
    the `claude-api` skill / docs when wiring tool-use, streaming, and token limits.
  - *Embeddings* (feature ②) → **OpenAI** `text-embedding-3-small` (1536-dim) — the standard,
    cheap RAG embedding; or Voyage AI if you prefer to stay off OpenAI.
- **New secrets:** `ANTHROPIC_API_KEY` (①②③) and `OPENAI_API_KEY` (②). Add to
  `apps/backend/.env.example`, the GitHub `Production`/`Development` environments, and the VPS
  `/opt/ambitiousyou/{prod,dev}/backend.env`. Read via `@nestjs/config`.
- **Cost/abuse guardrails:** per-user/day caps, max input size, and a feature flag so AI can be
  toggled per environment.

---

## ① AI Goal Breakdown — *ship first*
**What:** the user submits an ambition (name + optional definition + start/end dates) and gets a
proposed plan: a set of **moves** — a mix of **tasks** (with deadlines spread across the ambition
window) and **milestones** — that together cover the goal.

**How:**
- Endpoint `POST /ambitions/:id/ai-breakdown` → `AiService.breakdownAmbition()`.
- Call Claude with **tool/function-calling** so the model must return a structured payload
  (e.g. a `propose_plan` tool whose input schema lists `tasks[]` / `milestones[]` with titles +
  ISO deadlines). Validate the tool input against a **Zod / class-validator** schema before trusting it.
- Return the proposal to the UI for **review/edit/accept** (don't auto-write — let the user approve).
  On accept, persist with the existing transactional pattern in `AmbitionsService.createAmbition`
  (tasks/milestones already insert inside a `db.transaction`).
- Prompt engineering: pass the ambition context + today's date + the date window; instruct
  realistic, non-overlapping deadlines; cap counts.

**Data:** no new tables. Optional `tasks.aiGenerated` / `milestones.aiGenerated` boolean for analytics.

**Earns (résumé):** LLM integration, tool/function calling, structured/JSON-mode output, prompt
engineering, schema validation of model output.

---

## ② RAG Assistant over the user's data — *biggest keyword payoff*
**What:** a chat assistant that answers questions about the user's *own* goals — "Which ambitions
am I behind on?", "Summarize my notes on the fitness goal" — grounded in their data, with citations.

**How:**
- **Enable `pgvector`** on Supabase (`create extension if not exists vector;` — supported on Supabase).
- **New table** `embeddings`: `id`, `userId` (FK), `sourceType` (`ambition|task|milestone|note`),
  `sourceId`, `content` (text chunk), `embedding vector(1536)`, timestamps. Add an **HNSW** index
  (`using hnsw (embedding vector_cosine_ops)`) for fast approximate nearest-neighbour search.
- **Embed-on-write:** when an ambition/task/note is created or edited, (re)compute its embedding
  (OpenAI `text-embedding-3-small`) and upsert the row. Keep it simple synchronously first; move to a
  background job later if needed.
- **Query path** (`POST /ai/chat`, streamed): embed the question → retrieve top-k by cosine
  similarity **filtered by `userId`** (hard tenant isolation) → build a grounded prompt with the
  retrieved chunks → generate with Claude → **stream** the answer to the client (SSE / chunked).
- **Isolation:** filtering by `userId` is enforced server-side. *Optional hardening:* add PostgreSQL
  **row-level security** policies so isolation is enforced at the database layer too (this is what
  lets you truthfully claim "RLS" on a résumé).

**Data:** new `embeddings` table (+ HNSW index); schema lives in `packages/shared/db/schema/` like
everything else; migrate via `drizzle-kit`.

**Earns:** RAG, pgvector, vector embeddings (1536-dim), semantic search, HNSW indexing, cosine
similarity, streaming responses, multi-tenant data isolation (+ optional Postgres RLS).

---

## ③ AI Progress Coach — *reuses existing infra*
**What:** periodic, personalized insights and nudges — "You completed 3 tasks this week on *Launch
my SaaS*; the *fitness* ambition has had no activity in 12 days and its deadline is near."

**How:**
- **`@nestjs/schedule`** cron job running *inside the persistent VPS container* — a concrete payoff
  of choosing a long-running VPS over serverless (serverless makes scheduled work awkward).
- For each active user (respecting `settings.pushAmbitionReminders` / `emailAccountActivity`):
  summarize recent progress from the DB → ask Claude for 1–3 concise, actionable insights →
  store in a new `insights` table (surfaced on the dashboard) and/or send via the **existing**
  Azure Communication Services email path in the `notifications` module.
- Batch + cap LLM calls; stagger to respect rate limits and cost.

**Data:** new `insights` table (`id`, `userId`, `content`, `createdAt`, `readAt?`), or reuse
notifications.

**Earns:** scheduled jobs / cron, background processing, event-driven LLM analysis, working with an
existing notification pipeline.

---

## Suggested order & "definition of done"
1. **①** — 1 small module, 1 endpoint, no schema/infra change → fastest visible AI win.
2. **②** — pgvector + embeddings + streaming chat → unlocks the AI-native keyword set; most work.
3. **③** — cron + existing email → rounds out "background AI" with little new infra.

Once **① + ②** ship, the résumé can truthfully carry the AI bullet (see the project's resume notes):
> *Shipped LLM features with the Anthropic API — an AI goal-breakdown engine (tool-calling with
> schema-validated JSON) and a RAG assistant grounded in each user's data via pgvector embeddings
> (1536-dim) with HNSW semantic retrieval and streamed responses.*

**Keep it honest:** only add a keyword to the résumé/README once the corresponding code is merged
and working in production.
