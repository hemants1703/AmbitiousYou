# Ambition reminders (due today)

AmbitiousYou notifies opted-in users about **incomplete tasks, milestones, and ambitions that are due today or overdue**, using each user’s stored timezone.

| Slot | Local window | What happens |
|---|---|---|
| **Morning** | Local hour **≥ 9 and &lt; 18** | Notify open due/overdue moves once (deduped). |
| **Evening** | Local hour **≥ 18** | Notify again only if still open. |

Hourly Vercel Cron ticks are enough — Nest picks the slot from the user’s local hour, and dedupe keys prevent repeats inside the window.

Delivery channels:

1. **In-app inbox** — bell in the authenticated app header  
2. **On-device OS notification** — Web Push via the PWA (Windows / macOS / Android / iOS Home Screen)

No native apps. Scheduling is **Vercel Cron → Nest on Vercel**. Supabase Cron and GitHub Actions are not used.

---

## How it works (system design)

```mermaid
flowchart TB
  subgraph clients [PWA on Vercel]
    Settings[Settings toggle]
    SW[Service worker sw.js]
    Inbox[Header inbox]
  end

  subgraph backend [NestJS on Vercel]
    SubAPI[POST /notifications/push/subscribe]
    SyncAPI[POST /notifications/reminders/sync]
    CronAPI[GET /internal/reminders/run]
    Reminders[RemindersService]
    Push[PushService web-push VAPID]
    InboxAPI[GET /notifications]
  end

  subgraph data [Supabase Postgres]
    SettingsTbl[(settings)]
    Subs[(push_subscriptions)]
    Notifs[(notifications)]
    Tasks[(tasks / milestones)]
  end

  subgraph schedule [Vercel Cron]
    VC["vercel.json crons\n0 * * * *"]
  end

  Settings -->|enable + permission| SubAPI
  SubAPI --> Subs
  Settings -->|opt-in flag + timezone| SettingsTbl
  Settings -->|immediate sync| SyncAPI
  VC -->|Bearer CRON_SECRET| CronAPI
  CronAPI --> Reminders
  SyncAPI --> Reminders
  Reminders --> Tasks
  Reminders --> SettingsTbl
  Reminders -->|insert deduped rows| Notifs
  Reminders --> Push
  Push -->|Web Push protocol| SW
  SW -->|OS tray / lock screen| OS[Device notification]
  Inbox --> InboxAPI
  InboxAPI --> Notifs
```

### Why hourly cron, not two fixed UTC schedules?

Users live in many timezones. “9 AM” and “6 PM” must be **local**.

1. Vercel Cron runs **every hour UTC** (`0 * * * *`) — configured in [`vercel.json`](../vercel.json).
2. Nest loads users with `push_ambition_reminders = true`.
3. For each user, Nest reads `user_timezone` and computes the **local hour**.
4. **Morning window** (hour ≥ 9 and &lt; 18) or **evening window** (hour ≥ 18) creates/sends once per slot (deduped).
5. Queries **incomplete** tasks/milestones/ambitions with due/end date **≤ local today** (includes overdue).

Constants live in `RemindersService.MORNING_HOUR` / `EVENING_HOUR`.

Using hour **ranges** (not a single hour) means a delayed cron tick still delivers — dedupe keys prevent duplicate sends.

---

## Managing the Vercel Cron schedule

Cron definition: [`apps/backend/vercel.json`](../vercel.json) → `crons` array.

| Trigger | Behavior |
|---|---|
| `schedule: '0 * * * *'` | Automatic hourly UTC tick (production deployment) |
| Manual | `curl` with `CRON_SECRET` (see Operations) |

### Required Vercel env var

Backend Vercel project → **Settings → Environment Variables** (Production scope at minimum):

| Variable | Purpose |
|---|---|
| `CRON_SECRET` | Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` on each invocation |

Generate a strong random string (e.g. `openssl rand -hex 32`). **Without this, cron invocations return 401 and no reminders are sent.**

---

## API surface

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /internal/reminders/run` | `Bearer CRON_SECRET` | Hourly cron sweep (Vercel Cron) |
| `POST /internal/reminders/run` | `Bearer CRON_SECRET` | Manual sweep (curl / debugging) |
| `POST /notifications/reminders/sync` | Session | Immediate sync for current user/slot |

---

## Operations

### Manual API test

```bash
curl -X GET "$API_URL/internal/reminders/run" \
  -H "Authorization: Bearer $CRON_SECRET"
```

### Troubleshooting

| Symptom | Check |
|---|---|
| Cron 401 | `CRON_SECRET` set on backend Vercel project (Production) |
| Cron never runs | `crons` in `vercel.json` deployed? |
| No OS notification | Permission? VAPID on Vercel backend + frontend? |

---

## Code map

| Area | Path |
|---|---|
| Sweep + 9/18 slots | `apps/backend/src/notifications/reminders.service.ts` |
| HTTP | `apps/backend/src/notifications/reminders.controller.ts` |
| Cron config | `apps/backend/vercel.json` |
