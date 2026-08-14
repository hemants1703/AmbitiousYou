# AmbitiousYou — Revenue & Growth Plan

**Status:** canonical. If a feature, ICP, or marketing line is not in this file, it is not the plan.  
**Operating mode right now:** **§19 stealth Pro** — build every Pro feature in Nest; hide from hosted-app UI; unlock only `users.plan = pro` (founder); public copy is limited-time free with **no Pro list**; no payments; Spring + checkout later. Agent build spec: [`FUTURE_PLANS_AGENT_INSTRUCTIONS.md`](./FUTURE_PLANS_AGENT_INSTRUCTIONS.md).  
**Goal:** a **$1M ARR** software business that people pay because it closes their achievement loop — not because it stores another todo list.  
**Posture:** this is a billing business. Care is a byproduct. If a feature does not raise conversion, ARPU, or 90-day retention, it does not ship. While §19 is active, **do not collect money**; still do not ship features that cannot later sit on `users.plan`.

Related: engineering AI build spec lives in [`AI-ROADMAP.md`](./AI-ROADMAP.md). That file is **how** to build AI. **This file decides when and whether AI ships** (after the loop is in daily founder use under §19; after paying customers exist once §19 ends). Do not let résumé keywords lead the product.

---

## 0. The company in one paragraph

Apple Reminders (and every inbox) wins **capture**. AmbitiousYou wins the **3–12 month dated outcome**.

The visitor sees:

1. **Problem:** you already know the outcome and the date. The plan is split across 8–10 tabs. Nothing forces today’s move or a weekly close.
2. **Solution:** one primary ambition, today’s contract, Friday review, stall recovery — in one dashboard.
3. **Charge (at official launch):** $12/mo or $99/yr. Day 1 they are inside the loop. **Until then (§19):** limited-time free, no Pro mention, no checkout; founder is the only `plan = pro` user.

That is the whole company until money is real. We are not a social caretaker, a manifesto brand, or a free tracker. We solve a painful, expensive failure (intentions that never become outcomes) and we invoice for it — after Spring cutover.

**Current blocker:** the product was priced as “Free. Actually free.” That copy is being replaced with **limited-time free + “upgrades underway, create your account today.”** Do **not** list Pro features in public UI until official launch. Do **not** take payments yet. Forever-free is still forbidden.

---

## 1. Why tracking does not pay (the market we refuse)

### 1.1 The intention–behavior gap (why lists fail)

| Finding | Source | Implication |
|---|---|---|
| Goal intentions explain only **~28%** of variance in behavior; people act on “good” intentions **~53%** of the time | Sheeran (2002) | Storing the intention is not the product |
| Experimentally changing intention produces only a **small** behavior change (**d ≈ 0.36**) | Webb & Sheeran (2006) | Motivation copy and dashboards do not close the gap |
| Implementation intentions (“If situation Y, then I do X”) improve goal attainment by **d = 0.65** (94 tests, 8,000+ people). Getting started **d = 0.61**. Shielding from derailment **d = 0.77** | Gollwitzer & Sheeran (2006), *Advances in Experimental Social Psychology* | The paid object is **when / where / if interrupted**, not the task title |
| Locke & Latham: performance needs **clarity, challenge, commitment, feedback, strategy** | Locke & Latham goal-setting theory | AY today has names, dates, checkbox %. It is missing outcome metrics, commitment, review, recovery |

### 1.2 Category death rates (why “more tracking” churns)

| Finding | Source |
|---|---|
| **~60%** of habit-tracker signups never log a single check; **~75%** of habits never pass a 1-day streak; **~0.5%** reach ~66-day automaticity | loggd.life, 4,000+ people / 45,000+ check-ins |
| Day 1 **100%** → Day 3 **40%** → Day 7 **12%** → Day 14 **~4%**; **73%** quit in the “void” phase | Independent habit-app telemetry, 28k users |
| **>52%** gone by day 30; industry mobile D30 retention ~**8%** | Habit category 2026 summaries |
| Habit-app churn **11.3% monthly (~75% annual)**; **43%** cancel because motivation died; **25%** because free tools were enough; **44%** lose motivation after a streak break | RetentionCheck 2026; habit-streak industry notes |
| B2C freemium median convert **3.0%** (top quartile **5.8%**); B2B **5.1%** (top quartile **9.4%**) | ProfitWell / Paddle 2025 |
| “Good” self-serve freemium **3–5%**; “great” **8–12%**. Credit-card trial **~30%** vs **~5%** without | ChartMogul / ProductLed 2026 (n=200); Lenny / OpenView / Pendo |

### 1.3 Who already extracted cash (do not copy the grind)

| Company | Money | Lesson |
|---|---|---|
| Todoist | ~**$26.5M ARR** (Dec 2024, GetLatka), **30M+** users, **~$4–6/user/mo**, historically **~70% annual churn**, **~17 years** | Winning as a better inbox needs tens of millions of users. We will not catch that. Do not price at $4. |
| Notion | ~**$600M ARR** (early 2026), ~**4%** of 100M+ convert, seats **$10–20**, AI became ~half of revenue only **after** scale | AI is an ARPU lever on an already-paid product, not a GTM. |
| LinkedIn Premium | **$2B TTM** (Microsoft, Jan 2025), **$30–60/mo** Careers/Business | Career-outcome buyers already exist and pay. That is our ICP’s wallet. |
| ChatGPT Plus | **~$20/mo**, ~**5.5%** of ~900M WAU pay (~50M consumer subs, early 2026) | $20 is a normal professional line item. |
| GoalsWon | **$90/mo** (or **$720/yr**) for daily human check-ins | People pay 5–20× a todo app for **accountability**, not storage. |
| Focusmate | **$8–12/mo** for a ritual (body doubling), not a database | Sell the ritual. |
| Coaching (ICF / PwC 2025) | **$5.34B**, **122,974** coaches, **+17%** vs prior cycle; **57%** of sessions employer-paid | The money pool is outcomes/coaching. Productize the ritual; do not staff humans first. |

### 1.4 Market sizes (directional TAM — not our forecast)

Treat aggregator reports as order-of-magnitude, not as addressable revenue.

| Market | Size | CAGR | Our relationship |
|---|---|---|---|
| Personal goal-setting apps | ~**$3.15B (2025)** → ~$8B by 2035 | ~**9.8%** | Adjacent; we take the **paying professional slice**, not “everyone with a goal” |
| Personal OKR tracker apps | ~**$1.61B (2025)** → ~$4.7B by 2034 | **13.7%** | Closest category label |
| Goal-setting software (broader / org) | **$1.38–4.5B (2025)** depending on vendor | **~10–11%** | Includes enterprise we do **not** sell first |
| OKR / goal management (Mordor) | **$2.40B (2025) → $2.65B (2026)** | **10.6%** | Lattice / 15Five / Betterworks. Wrong GTM for year 1. |
| Coaching | **$5.34B (ICF/PwC 2025)** | ~**8–9%** | WTP proof; we productize, not marketplace |
| Career development software | **~$5.5–7.7B (2025)** | **~10–14.5%** | Year-3 expansion (proof logs, team), not day 1 |
| Gallup workplace | Global engagement **20% (2025)**; lost productivity **~$10T (~9% GDP)**; managers = **70%** of team engagement variance; manager engagement **31% → 22%** since 2022 | — | Why team seats can become the $1M+ expansion **after** self-serve works |

### 1.5 Tool sprawl (why “one dashboard” is the pitch — and a trap)

| Finding | Source | Use |
|---|---|---|
| Knowledge workers use **9–11 apps/day**; many toggle ~**1,200** times/day | RingCentral 2024; HBR-cited desktop studies | Pitch: collapse the **ambition tabs**, not their entire OS |
| Context switching ~**$450B/year** US; ~**1.8 hours/day** hunting information | Qatalog/Cornell estimates; McKinsey Global Institute | Problem is real |
| Asana: **~60%** of time is “work about work” | Asana Anatomy of Work | Pitch line for ICP-1 |
| Average company **101+ SaaS apps** (Okta 2025) | Okta Businesses at Work | Do **not** become app #102 that syncs the other 101 |

**Rule:** we collapse the 6–10 tabs that belong to **one dated ambition**. We do not replace Linear, Gmail, Notion, or Apple Reminders.

---

## 2. The sentence we sell (no “life-changing”)

**Homepage / ads / first visit — nothing else:**

> Your promotion / exam / launch has a date. The plan is in 10 tabs. We run today’s contract and Friday’s review in one dashboard. **$12/mo.**

Forbidden language: “life-changing,” “stay focused and make progress every day,” “where ambitious goals become inevitable outcomes” as the commercial promise. Brand poetry is not GTM.

Compare pages already exist (`/compare/todoist`, `/compare/notion`, `/compare/asana`). Rewrite the promise to: **they capture; we run the dated loop** — not “we’re free and they charge.”

---

## 3. ICPs — who needs one dashboard, who has money

Three ICPs only. If they do not match, do not acquire them.

### Tab map (what “one platform” means)

| Their tabs today | Job in AmbitiousYou | Stay outside AY |
|---|---|---|
| Notion / Google Doc career plan | Outcome + milestones | — |
| Coursera / A Cloud Guru / Udemy | Moves with dates | The course player |
| ChatGPT “make me a study plan” | Plan lives as tasks/milestones | Ad-hoc questions until paid AI |
| Calendar | Today’s time block (Phase 6 integration) | Meetings |
| Apple Reminders | Optional one-way: today’s contract | Daily capture, groceries, calls |
| Spreadsheet of practice scores | Milestone evidence | — |
| Brag doc / LinkedIn drafts | Proof log | LinkedIn itself |
| Email “I’ll do it this weekend” | Weekly review | Email |

### ICP-1 — Promotion / level-up IC (**primary volume**)

| Field | Definition |
|---|---|
| Who | Employed IC, typically **26–40**, software / product / data / design. Target: **Senior / Staff / first manager** in **6–12 months**. |
| Income | Roughly **$80k–200k** (US/EU/remote). India equivalent: well-paid product/tech ICs who already buy USD tools. |
| Already pays | LinkedIn Premium **$30–60/mo** and/or ChatGPT Plus **$20** and/or Notion **$10–12**. |
| Problem | “I have a promotion date in my head. The evidence is in 6 places. My manager sees activity, not a packet.” |
| 10-tab stack | Reminders, Notion/Docs, calendar, ChatGPT, course site, GitHub, 1:1 notes, LinkedIn. |
| Offer | One ambition: the level. Milestones = artifacts (design doc, cert, review). Today = one 45-min move. Friday = 12-min review. |
| Why they pay without a fight | **$12/mo is &lt;1% of one month’s raise** if the loop works. They already pay $20–60 for adjacent tools. |
| Marketing line | “Your promotion has a date. Today’s 45 minutes and Friday’s review live in one place.” |

**Mix weight next 12 months: 60%.** This is the brand.

### ICP-2 — Dated credential candidate (**fastest cash**)

| Field | Definition |
|---|---|
| Who | Person who has **paid for an exam** (or employer did) and has a **calendar date**. AWS, Azure, PMP, CFA, CISSP, other professional exams. |
| Spend already | AWS exams **$100–300**; **1.05M** unique AWS-certified people, **1.42M** active certs (AWS, Jan 2025). PMP exam **$405–655** + prep **$50–2,500**. CFA L1 registration often **$900–1,200** + prep **$500–1,500**. Retake = more money + months. |
| Problem | Prep is scattered (videos, Anki, PDFs, calendar). Missing the date is an expensive failure, not a mood. |
| Offer | Exam date = `ambitionEndDate`. Practice-test scores = milestones. Weekly review = hours vs plan. Stall = “you are behind the hours curve.” |
| Why money is easy | **$12–29/mo is 1–3% of total cert spend.** They are already in buying mode. External deadline + sunk cost. |
| Marketing line | “Exam on 12 October. We run the study loop until that morning.” |

**Mix weight: 30%.** Highest urgency, easiest conversion. Credit-card trial is justified here.

### ICP-3 — Technical founder with one number (**highest ARPU, fewer people**)

| Field | Definition |
|---|---|
| Who | Solo or 2-person technical founder. One number: **launch date, first $10k MRR, 10 paying customers, raise by DATE**. |
| Already pays | Hosting, ChatGPT, analytics, maybe a coach **$90–500/mo**. |
| Problem | Linear / GitHub / Stripe / analytics / Reminders. No single “is the company goal on track this week.” |
| Offer | **One** company ambition. Not a second Linear. Weekly review is the product. |
| Price | **$29–49/mo**. They will not haggle $12. |
| Refuse | Replacing issue tracking, email, or “second brain.” |

**Mix weight: 10%.** Do not build for them first; they will pull the product into project management.

### Explicit non-ICPs (do not acquire)

| Segment | Why money is hard |
|---|---|
| Students / “semester tracker” | Low WTP, high churn after exams. Use-case pages may exist for SEO; they are not the paid GTM. |
| Generic personal growth / fitness / journaling | Habit-app economics. Apple Fitness / Reminders win. |
| “Anyone with goals” | B2C **3%** convert + **75%** category churn. |
| Enterprise OKR / HR | 12–18 month sales. Lattice already owns this. |
| People who only need a grocery/work inbox | They should stay on Apple Reminders. Competing here is how we stay at $0. |

### Apple Reminders (non-negotiable)

The founder already moved to Apple Reminders because it is fast, on-device, and always there. **That is correct for capture.**

- Reminders cannot run “Staff by November,” an AWS exam date, or a launch number.
- AY must never try to be the inbox.
- Optional later: **one-way push** of today’s contract into Reminders.
- Never pull their whole inbox into AY. Never build a native app “to be as accessible as Reminders” before the loop is paid.

---

## 4. Packaging and willingness to pay

You solve a hard problem. **Collection should be boring.**

### 4.1 Plans

| Plan | Price | Who | What they buy |
|---|---|---|---|
| **Free** | $0 | Evaluation | **1** active ambition, 14-day history, no AI. Enough to feel the loop. Not enough to run a career year. |
| **Pro** | **$12/mo or $99/yr** | ICP-1, ICP-2 | 3 active ambitions, today’s contract, weekly review, stall recovery, reminder intelligence, ICP templates. |
| **Accountability** | **$29/mo** | ICP-3 + stuck ICP-1 | Written weekly close + AI next-move on *their* data. Files/RAG when Phase 4 ships. |
| **Team** | Later, **$8–12/seat** | Managers | Only after ~$10k MRR self-serve. |

**Rules:**

- Kill “unlimited free.” Unlimited goals is a todo-app feature. High performers run **1 primary + at most 2 supporting**.
- Do not compete at Todoist’s **$4**. You inherit their churn and never catch their distribution.
- Price on the first screen. No “maybe later.”
- 14-day Pro trial. ICP-2: credit card upfront is OK (ChartMogul: ~**30%** convert vs ~**5%** without).
- Annual default ($99) — cash up front, lower churn.
- One checkout, one plan picker. No custom invoices, no “email me for pricing,” no discounting except the annual save.
- Prosumer ACV median is **~$180/year**. $99–129/year is on-market.

### 4.2 Path to $1M ARR (the grind is volume × retention, not features)

**$1,000,000 / 12 = $83,333 MRR.**

| Mix | What it takes | Comment |
|---|---|---|
| Pro only @ $12/mo | **6,945** paying | Pure volume. Needs retention or you are on a hamster wheel. |
| Pro @ $99/yr | **~10,100** annual | Better cash, still volume. |
| **Base mix (plan)** | **4,000 Pro ($12) + 1,200 Accountability ($29)** = $48k + $34.8k = **$82.8k MRR ≈ $994k ARR** | Same order of users as a small SaaS, not Todoist. |
| With Team | 4,000 Pro + 800 Accountability + **150 teams × 8 seats × $10** | Team is how you cross $1M without 7k consumers. |
| Blended ARPU $18 | **~4,630** paying | What AI attach + Accountability should do. |

**Conversion reality:** at **5%** free→paid you need **~80k–140k** signups depending on mix. That is a grind (SEO + ICP landing pages + LinkedIn + exam-intent content). It is **finite**. At Todoist’s $4 and ~3%, you need an order of magnitude more people for less revenue.

**Retention is the actual $1M business.** Habit apps at **~75% annual churn** cannot compound. Target:

| Metric | Target (payers) | Kill-switch |
|---|---|---|
| Complete a move within 48h of signup | ≥40% | Onboarding is still a tracker |
| Week-1 review completed | ≥35% | Review is not the product yet |
| D7 return | ≥25% (vs habit-app ~12%) | Loop not habitual |
| D30 return | ≥15% | Do not spend on ads |
| Weekly-review completion among payers (week 4) | **>50%** | This predicts revenue more than signup count |
| Monthly logo churn | **<8%** then **<5%** | Cannot reach $1M if this stays habit-app-like |
| Free→paid (6 months) | **5%** good / **8%+** great | If stuck at 2%, packaging or ICP is wrong |

**Do not spend on paid ads until D30 return ≥15% and 10 people have paid.** Ads amplify a leaky bucket.

---

## 5. Payments (India, Stripe Payments invite-only, no headache)

**Use a Merchant of Record. Do not wait for Stripe India. Do not become the tax department.**

Stripe **Payments** is invite-only in India. Stripe **Connect Express payouts** still work *through* an MoR. Polar documents **India** as a payout country. You never need a Stripe merchant account in India to sell.

| Option | Role | Fees (headline) | India founder | Tax headache | Verdict |
|---|---|---|---|---|---|
| **Dodo Payments** | MoR, India-first | ~**4% + $0.40** (subs often +0.5%) | Individuals + Pvt Ltd; **UPI + RuPay** | They VAT/sales-tax globally; you still pay Indian income tax | **Default pick** |
| **Polar.sh** | MoR | Similar indie MoR band | **India listed for payouts** via Connect Express | Same MoR deal; weaker UPI | **Best DX** if buyers are mostly US/EU cards |
| **Paddle** | Mature MoR | **5% + $0.50** | Works; slower KYC | Least DIY tax | Overkill until ~$20k MRR |
| **Lemon Squeezy** | MoR, Stripe-owned | ~5% + $0.50 | Friction for Indian merchants post-acquisition | — | Skip |
| **Razorpay International** | Gateway, **not** MoR | **~3% + GST**, auto-**eFIRC** | Best for **GST LUT zero-rating** | **You** own EU VAT / US sales tax | Cheaper later; **more** headache now |
| Stripe India | Gateway | — | Invite-only | You own tax | Not a plan |
| US LLC + Stripe US | DIY | Stripe rates | FEMA ODI (Form FC, APR, FLA) | Powerful, high paperwork | Opposite of no-headache |

**Production default: Dodo Payments.** Polar is the legitimate alternative if DX/sandbox/AI-docs matter more than UPI and 1 point of fee. Full rationale, beginner walkthrough, sandbox testing, and open-source rules: **§13–§17**.

**Implementation (either MoR):** hosted/overlay checkout + customer portal + webhooks (`subscription.created` / `canceled` / `past_due`) → `users.plan`. Keep a thin `BillingProvider` adapter so swapping Dodo ↔ Polar is not a rewrite. No homemade billing. No invoices by email.

---

## 6. What we actually sell (the loop)

The database already exists: ambitions, mixed tasks/milestones, notes, server-derived %, dashboard, streaks, activity calendar, Needs Attention, timezone-aware **09:00 / 18:00** reminder cron (`.github/workflows/reminders-cron.yml`), templates that hydrate into `/ambitions/create`.

**The subscription is the operating system around that data**, not more tables for their own sake.

```
Clarify outcome  →  Commit to one primary ambition
        →  If-then plan (when / where / how)
        →  Today's single contract (one move)
        →  Evidence of progress (milestone / outcome, not checkbox %)
        →  Weekly review (the ritual we charge for)
        →  Stall detection + recovery (not streak shame)
        →  Accountability close (you said X, did you do X?)
```

### Locke & Latham vs AY today

| Principle | Required | AY today | Ship |
|---|---|---|---|
| Clarity | Specific outcome, not “get better” | Name + dates. `ambitionDefinition` exists but is not the success line. | Require “Done means ____ by [end date].” |
| Challenge | Hard enough to matter | Priority enum only | ICP templates with real difficulty |
| Commitment | Public, social, or financial stake | Fully private. **$0** stake. | Paid plan **is** the stake. Later: weekly close. |
| Feedback | Frequent, on the *goal*, not busywork | Equal-weight checkbox % (gameable) | Milestone-weighted progress |
| Strategy | Plan for how + review | Tasks/milestones exist; no weekly review object, no if-then, no recovery | Today’s contract + Friday review + stall → next action |

Needs Attention is currently a **display**. It must become a **coach**: “No completed move on *Promotion* in 9 days; end date 41 days out; next unfinished milestone is X. Contract for tomorrow: Y (20 min).” Rules-first first; LLM later.

Progress % must not treat 10 easy tasks as equal to the career-defining milestone. Milestones are already one-way/permanent in the data model — **use that as the scoring spine**.

---

## 7. Phased build (each phase has a money test)

Fail the test → do not proceed. Grind means repeating the loop that makes money, not adding AI because it is interesting.

### Phase 0 — Personal dogfood (this week, no billing)

Founder uses AY as **ICP-1**: Spring Boot / Java backend + DSA + system design, dated. That is the career OS (§19). Do not use “10 paying users by DATE” as the primary ambition while career is the actual goal.

Ship only the day-1 slice in **§10**. Kill anything still done in Reminders that is **capture**. Keep anything Reminders cannot do.

**Money test (deferred):** you open AY daily for the *contract*, not to tick random tasks. If after 14 days AY is optional, the product is still a tracker — do not add AI, add the loop. **Do not open checkout** until §19 ends.

### Phase 1 — Charge for the loop (after §19: Spring in production)

Calendar weeks below are **post-launch**, not “next month.”

- Primary ambition (one per user)
- Today’s contract
- Persisted weekly review
- 18:00 close copy (existing cron)
- Dodo checkout
- Free = 1 active ambition; Pro = 3
- Rewrite pricing page (kill “actually free”)
- Rewrite homepage to problem → product → price

**Money test:** **20 paid trials or 10 paying customers**. If nobody pays, the loop is still a tracker — **do not add AI**.

### Phase 2 — ICP-2 cert machine (month 2–4)

Exam-dated templates as **programs to run**, not blank lists: AWS SAA 12-week, PMP 8-week, etc. Stall = hours-behind-curve.

SEO/landing: `/for/aws-saa`, `/for/pmp`, `/for/promotion` — not `/use-cases/personal-growth` as the hero.

**Money test:** ICP-2 trial→paid **>15%** (deadline buyers). This is the fastest path to first $2–5k MRR.

### Phase 3 — Paid AI that writes into the loop (month 4–7)

Only after Phase 1 money exists. Spec in `AI-ROADMAP.md` ① + ③, **gated to Pro/Accountability**, rate-limited.

- AI breakdown → tasks/milestones for **review/accept** (never auto-write)
- AI drafts the weekly review and **one** next move
- Per-user/day caps. Free AI is how MoR revenue disappears (ChartMogul 2026: supporting free AI users is expensive)

**Money test:** AI attach or Pro conversion up **≥2 points**. If usage is chat-without-moves, kill it.

### Phase 4 — Files + grounded RAG (month 6–10)

`AI-ROADMAP.md` ②, paid only.

- Upload PDFs/notes; attach **this ambition + selected files + moves** as context
- Chat may only cite those
- Output must be a **proposed move or review note**, not an essay

**Money test:** Accountability tier **$29** sells. If people treat it as ChatGPT with extra steps, it is a cost center.

### Phase 5 — Web research that becomes a move (month 8+)

Research **this plan only** → 3 sources → **proposed tasks**. Never a generic answer engine. Perplexity/ChatGPT already own generic research at $20 they already pay.

### Phase 6 — One integration that closes the loop

**Google/Apple Calendar: block 45 min for today’s contract.** That is the integration.

Optional: one-way **Reminders: today’s contract**. Capture stays in Apple.

Not Notion. Not Slack. Not Jira. Not “10 connectors.” Becoming Zapier is how a solo grind dies.

### Phase 7 — Team seats (only after ~$10k MRR)

Manager sees IC weekly reviews. This is the Gallup / career-development software money. It is **not** the first market. Do not pretend to be Workboard on day 1.

### Revenue checkpoints

| Paying | MRR (Pro $12) | ARR | Meaning |
|---|---|---|---|
| 10 | $120 | $1.4k | Loop is sellable |
| 50 | $600 | $7k | Keep grinding ICP-2 SEO |
| 200 | $2,400 | $29k | Real reinvestment income |
| 1,000 | $12,000 | $144k | Small SaaS; still nowhere near Todoist user count |
| 1,000 Pro + 150 × $29 | $16,350 | $196k | Packaging working |
| Mix in §4.2 | ~$83k | **~$1M** | The actual target |

---

## 8. AI / templates / files / RAG / research — keep, sequence, or kill

| Idea | Verdict | When | Why |
|---|---|---|---|
| Onboarding via **template ambitions to learn from** (not a blank builder) | **Keep, now** | Phase 0–1 | `/templates` + `hydrateTemplateDraft` already exist. Change them into **ICP programs**. Cheapest “AI-quality plan” with **$0 tokens**. |
| AI create ambition + breakdown | **Keep, paid** | Phase 3 | Plan must become when/where/how. Review/accept only. |
| Spawn chatbot with selectable context (files, notes, moves) | **Keep as Accountability SKU** | Phase 4 | This is the $29 reason. Not the homepage. |
| Attach files to RAG | **Keep, paid, later** | Phase 4 | Unique only if grounded in *this* ambition. Otherwise ChatGPT. |
| Web research on the plan | **Conditional** | Phase 5 | Allowed only if output is **proposed moves**. |
| Free AI chat | **Kill** | Never | Token cost + no conversion. |
| AI as the marketing headline | **Kill** | Never | ICP does not buy “we have GPT.” They buy the Friday review. |

---

## 9. Never / always / wasted / beneficial / marketing

### Never be or do

- A todo inbox or Reminders competitor
- “Life-changing” / manifesto-first commercial brand
- Forever-free unlimited
- Habit-streak company (break → churn)
- Second brain / Notion clone
- Zapier with 10 integrations on day 1
- Enterprise OKR / HR suite in year 1
- Human coaching marketplace (ops eats a solo founder; $90/mo WTP is real — productize first)
- Perplexity / ChatGPT wrapper
- Student-first paid GTM
- Discounting to “get users”
- Native iOS “to be accessible” before the loop is paid
- US LLC just to get Stripe
- Building AI before 10 people have paid
- Ranking for “best todo app”

### Always be or do

- One dated outcome per user (primary)
- Today’s **one** contract
- Friday/Sunday **written** review
- Stall → next 20-minute action
- Price on the page
- ICP-1/2 copy only
- Reminders = capture; AY = outcome OS
- Charge before AI
- MoR checkout (Dodo)
- Measure the metrics in §4.2

### Wasted effort vs beneficial

| Wasted | Beneficial |
|---|---|
| More dashboard charts / heatmap polish | Today’s contract + weekly review persistence |
| Equal-weight checkbox % | Outcome field + milestone-weighted % |
| Native app v1 | 18:00 “did you do it?” using existing cron |
| RAG + web search now | ICP templates that are real exam/promotion programs |
| Slack / Notion / Jira sync | Calendar block for today’s move |
| Public social feed | Private proof log |
| Gamification badges | Recovery after a missed day |
| SEO “best todo app” | SEO “AWS SAA 12-week plan” / “staff engineer packet” |
| AI chat with no write-back | AI that proposes moves you accept |
| Paid ads at 8% D30 | LinkedIn + exam-intent pages after D30 ≥15% |

### Marketing that produces **paid** signups

| Do | Don’t |
|---|---|
| Problem → product → price in 5 seconds | Brand poetry |
| Landing per ICP: `/for/promotion`, `/for/aws-saa`, `/for/pmp` | `/use-cases/personal-growth` as hero |
| Templates as **runnable programs** | Empty “goal tracker” templates |
| LinkedIn from ICP-1 voice: “I stopped using 7 tabs for my promotion packet” | TikTok productivity-bro |
| Compare pages: they capture; we run the dated loop | “We’re free and they charge” |
| Exam-date SEO (commercial intent) | “Todo list app” keywords |
| 14-day trial; card for cert ICP | Endless free |
| Talk to **25 people** who already pay for LinkedIn Premium, a coach, or Notion — sell the weekly review | “Would you use a goal app?” surveys |

Existing assets to reuse, not rebuild: `/templates`, `/compare/*`, `/use-cases/*`, `/pricing`, `/features`. The **promise and the price** are wrong; the pages exist.

---

## 10. Day-1 features (small changes, founder dogfood)

The loop pieces **almost exist**. Do not rewrite the app.

| Existing | What it is today | Day-1 change |
|---|---|---|
| `today-focus.tsx` | Queue of **everything** due/overdue | **One** pinned contract on the primary ambition (milestone preferred — weekly preview already leads with milestones) |
| `weekly-preview.tsx` | Look-ahead list | Keep as look-ahead; add a **Friday review card** separately |
| `revive-missed.tsx` | Expired ambitions | Mirror a **missed-day** recovery: “10-minute restart tomorrow” |
| Needs Attention | Display | Rules-based “next 20-min action” copy (can be frontend-only at first) |
| `ambitionDefinition` / `ambitionMotivation` | Schema fields | Require definition as **“Done means ____ by [end date]”**; show on Today |
| `isFavourited` | Favourite flag | Treat as **primary** (one per user) until a dedicated `isPrimary` exists |
| 09:00 / 18:00 cron | Due/overdue nag | 18:00: “Did you finish today’s contract: {title}? Yes / snooze to tomorrow.” |
| `/templates` + `hydrateTemplateDraft` | Generic templates | Rewrite **3** ICP programs: Staff-track packet, AWS SAA 12-week, PMP 8-week. Demote “learn guitar” off the hero path |
| Create-ambition flow | Unlimited | Soft-warn at **>1 active** (“Pro will allow 3”) even before Dodo |
| Notes | Free text | Friday: 4 prompts (moved / stalled / skip / next week’s contract) → note titled `Weekly review YYYY-MM-DD`. No new table required |

**Do not implement on day 1:** billing, RAG, files, web search, calendar sync, native apps, AI breakdown, extra charts.

**Personal test (founder is first ICP-1):**

1. One ambition with a real date: **Spring / Java backend (+ DSA + system design) by DATE**.
2. Apple Reminders: capture only.
3. AY: morning contract + Friday review.
4. After 14 days: if AY is optional, still a tracker. If skipping Friday feels expensive, the loop is load-bearing — keep building Pro gated (§19). Charge **$12** only at official launch.

---

## 11. Decision lock

| Question | Answer |
|---|---|
| Who | ICP-1 promotion IC + ICP-2 exam date. ICP-3 later. |
| What | Dated outcome operating system. Not an inbox. |
| vs Apple Reminders | Capture stays there. Loop lives here. |
| vs 10 tabs | Collapse **ambition tabs only**. One calendar integration later. |
| Price | **Now (§19):** limited-time free for everyone who signs up. No prices, no Pro list, no checkout. **At launch:** $12 / $99. Free = 1 ambition. Accountability $29. |
| Payments | **Not now.** At official launch: **Dodo Payments** (MoR) default. **Polar.sh** if first-time DX/sandbox wins a 1-day spike. See §13. |
| AI | After the **loop is in daily founder use**. Gated to `plan = pro`. Never shown to free users. |
| $1M | ~4,000 Pro + 1,200 Accountability (or equivalent ARPU mix), **&lt;5–8% monthly churn**, then team seats. |
| First money | After Spring production API + MoR. Until then the only Pro user is the founder. |
| Grind **now** | Spring career + DSA + system design **inside AY**. Ship Pro in Nest, stealth-gated. |
| Who sees Pro? | Only `users.plan = pro` (founder). Free users keep today’s tracker. Pro UI is omitted, not locked. |

---

## 12. Working order (start here)

**While §19 is active, this list wins over “charge next week.”** Coding agents: follow [`FUTURE_PLANS_AGENT_INSTRUCTIONS.md`](./FUTURE_PLANS_AGENT_INSTRUCTIONS.md).

1. Public copy: **limited-time free** + upgrades underway + create an account. **No Pro names, no prices, no feature list.**
2. `users.plan` + founder row `pro`. All new product behind `ProGuard` + `isPro`. Free UI unchanged. Signups stay open (`plan = free`).
3. Build Pro in Nest (loop first, then AI/files/calendar). Founder dogfoods Spring career on it.
4. Do not integrate payments. Do not cap free users. Do not tease locked features.
5. Later: Spring Boot cutover (same API, same DB) → MoR → list Pro on `/pricing` and open checkout.

This file is the plan. Update it when a money test fails — not when a new feature sounds exciting.

---

## 13. Why Dodo over Polar (and when to flip)

Both are **Merchants of Record**. The customer pays **them**; they pay **you**. You do not become the legal seller in 50 countries. That is the whole point of MoR vs Stripe/Razorpay.

Dodo was the default because of **India + fee + payment methods**, not because Polar is bad.

| Criterion | Dodo Payments | Polar.sh | Who wins for AY |
|---|---|---|---|
| Headline fee (early stage) | **4% + $0.40** (+**0.5%** on subscriptions; +1.5% some international) | Starter **5% + $0.50**; cheaper rates only on paid Polar plans (**$20–$400/mo**) | **Dodo** under ~$10k MRR |
| India founder | Built for Indian indie/SaaS; individuals OK | India is a **payout** country via Stripe Connect Express (works even when Stripe Payments is invite-only) | Tie on “can I get paid in India?” |
| Indian customers paying | **UPI + RuPay + INR** native | Card-first; UPI is not the product | **Dodo** if any INR checkout matters |
| First-time integrator DX | Overlay checkout, SDKs, test-mode API key | Isolated **sandbox.polar.sh**, official TypeScript SDK, **llms.txt** for coding agents, Polar itself is open source | **Polar** |
| Test without live money | `mode: 'test'` + test API key | Fully separate sandbox org, tokens, and `sandbox-api.polar.sh`; Stripe test card `4242…` | **Polar** (cleaner isolation) |
| Usage / AI metering later | Native credits / metered | Subscriptions + one-time; weaker metering | **Dodo** for Phase 3–4 AI SKUs |
| Cultural fit with a public GitHub star project | Closed-source MoR | Polar is OSS; common among indie/dev tools | **Polar** |
| Maturity / KYC | Fast signup claimed; still a younger MoR | Review before first **payout**; sandbox is instant | Polar safer to *code* against immediately |

**Keep Dodo as production default if:** you want the lower early-stage take-rate, UPI for Indian ICPs, and usage billing when AI ships.

**Pick Polar instead if (valid):** you have never integrated payments, you want the coding agent to read Polar’s docs/llms.txt, you want a sandbox that cannot touch live money, and your buyers are mostly USD/EU cards (ICP-1/2). One extra percentage point on $12/mo is **$0.12 per charge** — not the $1M problem.

**Process:** 1-day spike of Polar sandbox *or* Dodo test mode — whichever gets a test checkout + webhook updating `users.plan` first wins for Phase 1. Do not integrate both. Wrap the winner in `BillingProvider`.

Sources for the fee/DX split: Dodo’s public Polar comparison (treat as vendor-biased on narrative, usable on published rates); Polar sandbox docs; third-party MoR roundups (Fungies 2026).

---

## 14. How payments actually work (first time, no Stripe)

You have never needed a “payment gateway.” With MoR you still do not. You need **checkout + webhooks**.

### 14.1 What happens when someone pays $12

```
User clicks “Start Pro” on ambitiousyou.pro
  → Your backend creates a Checkout Session (API key server-side only)
  → User enters card/UPI on Dodo/Polar’s hosted overlay (PCI is their problem)
  → MoR charges the card, adds VAT/sales tax, becomes the legal seller
  → MoR POSTs a webhook to your API: subscription.active
  → You set users.plan = 'pro', users.planExpiresAt = …
  → User lands on /dashboard already Pro
  → Each month MoR bills them; you get a payout minus their fee
  → Cancel / failed card → webhook → you downgrade plan
```

You never see the raw card number. You never file Alabama sales tax. You still pay **Indian income tax** on money that lands in your account. Confirm FIRC/GST LUT with a CA once — do not block checkout on it (§5).

### 14.2 What you build in the repo (small)

| Piece | Where | Hard? |
|---|---|---|
| Create checkout session | NestJS `POST /billing/checkout` behind `SessionGuard` | Easy — one API call |
| Overlay or redirect to MoR checkout | Pricing page / settings | Easy — their JS SDK |
| Webhook endpoint | `POST /billing/webhook` **no session cookie**; verify signature | Medium — do this once, carefully |
| `users.plan` + gate | Schema + “1 vs 3 ambitions” checks | Easy |
| Customer portal link | Settings → “Manage billing” (MoR hosted) | Easy — do not build invoices |
| Test vs live keys | `BILLING_MODE=test\|live` env | Easy |

**Do not build:** card forms, tax tables, dunning emails, invoice PDFs, proration math. That is why MoR exists.

### 14.3 Hard vs easy, fast vs slow

| Step | Calendar time | Notes |
|---|---|---|
| Sign up + sandbox/test keys | **30–90 min** | Polar sandbox is a separate site; Dodo is a test API key |
| First test checkout in the app (agent-assisted) | **half day – 2 days** | Checkout session + overlay + “success” page |
| Webhook that actually flips `plan` (idempotent, signature verified) | **1–2 days** | This is the only part that bites beginners. Use their webhook CLI / dashboard “resend” |
| Plan gates in product (1 ambition free) | **1 day** | Reuse existing create-ambition flow |
| KYC / first **live** payout | **1–10 business days** (provider-dependent) | Code can be done; money cannot move until they verify you |
| First real $12 | After KYC + one live test with your own card | Refund yourself |

**Difficulty: easy-to-medium.** Harder than adding a button; much easier than Stripe Tax + VAT + Radar + Billing. The webhook is the one concept to learn: **the browser is not the source of truth; the signed webhook is.**

**Speed: you can integrate a test-mode checkout in a weekend.** Going live is gated by KYC, not by code.

---

## 15. Implementation time (all upgrades) and agentic coding

**Code to start charging is weeks. $1M ARR is years of customers.** Do not confuse those.

### 15.1 Calendar vs coding hours

Estimates assume **you + a coding agent**, you review every billing/auth PR, and you do not boil the ocean.

| Phase | What | Solo, no agent | With agent (you reviewing) | Wall-clock if focused |
|---|---|---|---|---|
| **0** Day-1 loop (§10) | Primary, today’s contract, weekly review note, 18:00 copy, 3 templates | 1–2 weeks | **2–4 days** | 1 week including dogfood |
| **1** Charge | MoR checkout, webhooks, plan gate, pricing/homepage rewrite | 2–3 weeks | **3–7 days** + KYC wait | 2 weeks |
| **2** ICP-2 machine | Exam programs, `/for/*` landings, SEO rewrite | 2–3 weeks | **1–2 weeks** | 3 weeks (copy matters more than code) |
| **3** Paid AI breakdown | `AI-ROADMAP` ① gated to Pro | 2–3 weeks | **1–2 weeks** | After 10 payers |
| **4** Files + RAG | Uploads, embeddings, citations | 4–8 weeks | **2–4 weeks** | After Accountability SKU is priced |
| **5–6** Research + calendar | Only if Phase 1 money exists | 2–4 weeks | **1–2 weeks** | Optional |
| **7** Team seats | Not year-1 code | — | — | After ~$10k MRR |

**Phase 0+1 (the only upgrades that create a business): ~2–4 weeks wall-clock with an agent, then 14 days of you using it.** KYC may add a week of waiting, not coding.

**Phases 2–7 are not a single “implement all” project.** Implementing “everything in this file” as one milestone is how you stay at $0. Sequence is the plan.

### 15.2 How fast with agentic coding assistants (Cursor, etc.)

Agents are fast at: overlay checkout from docs, DTOs, webhook signature boilerplate, plan gates, pricing page copy, template content, tests.

Agents are **not** fast at: KYC, tax advice, “does this webhook fire twice,” PCI mistakes, product taste on the Friday review.

**Rules when an agent writes billing:**

- Point it at Polar `llms.txt` / Dodo overlay + webhook docs; do not let it invent Stripe-India.
- You read every line of webhook verification and plan upgrade.
- Test in sandbox with `4242…` (Polar) or Dodo test cards before any live key hits Vercel.
- Do not let the agent “just add Stripe” because that is in its training data.

Realistic: **a focused agent week can ship Phase 0 + a sandbox checkout.** A focused second week can ship live billing after KYC. That is the grind that matters. The rest of this document is GTM, not a 30-day rewrite.

---

## 16. Testing as the builder without leaking secrets (sandbox / “top model”)

Yes. You can test the **full** checkout as the only user, for **$0**, without the public repo containing anything dangerous.

### 16.1 Payment sandbox (use this)

| Provider | How | Real money? | Visible in GitHub? |
|---|---|---|---|
| **Polar** | Separate org at [sandbox.polar.sh](https://sandbox.polar.sh/start); SDK `environment: "sandbox"`; token from the **sandbox** dashboard only | No. Stripe test card `4242 4242 4242 4242` | Only if you commit the token (never do) |
| **Dodo** | `mode: 'test'` + test-prefixed API key | No | Same |

Sandbox data does not mix with live payouts (Polar isolates servers on purpose). Create products, subscribe, cancel, fire webhooks, refund — all fake.

**Live keys** go only in Vercel / GitHub Environment secrets (`DODO_API_KEY` or `POLAR_ACCESS_TOKEN`, `BILLING_WEBHOOK_SECRET`, `BILLING_MODE`). Same pattern as `DATABASE_URL` and `CRON_SECRET` today.

### 16.2 What the open repo should contain vs not

| In the public repo (good) | Never in git |
|---|---|
| Checkout button, webhook **handler code**, plan enum, pricing page | API keys, webhook secrets, customer emails, live product IDs if they are secret (public product IDs are fine) |
| `BILLING_MODE` reads from env | `.env`, `.env.local`, sandbox tokens |
| Docs saying “hosted product is paid; self-host is free” | A hidden second repo for “the real billing” |

Billing **code** in a public repo is normal (Plausible, Ghost, Cal, PostHog). Secrets in a public repo are an incident.

### 16.3 If “top model” meant AI models (Claude Opus, etc.)

- You cannot use Anthropic/OpenAI “for free” in production. You pay them. Sandbox billing ≠ free LLM.
- Put `ANTHROPIC_API_KEY` in env, never in git (already the `AI-ROADMAP.md` plan).
- Feature-flag AI off unless `plan` is Pro/Accountability.
- For **your** dogfood, a cheap model is enough. Opus is an Accountability-tier cost, not a README flex.

### 16.4 “Without people noticing”

**Do not hide that AmbitiousYou is a commercial hosted product.** Hide **keys**, not **intent**.

Hiding analytics/billing while the README still says “free forever” is what gets open-source backlash. Shipping an obvious Pro checkout, a LICENSE, and a privacy policy is what serious OSS-SaaS companies do.

While §19 is active: say **limited-time free** and that upgrades are underway. Do not list Pro features. Do not take cards. Founder-only access is a **DB flag**. Hide the product surface, not the fact that the hosted app will not stay free forever.

---

## 17. Keeping the project open source (billing, tracking, no backlash)

The repo can stay public. The **hosted** product `ambitiousyou.pro` is the business. That is the Plausible / PostHog / Ghost / (historical) Cal.com model: source visible, cloud paid.

You already load `@vercel/analytics` and Speed Insights **only when `NODE_ENV === production`** (`apps/frontend/src/app/layout.tsx`). That is the right shape: telemetry on the hosted app, not when someone runs `pnpm dev`.

### 17.1 What actually causes OSS backlash

| Gets backlash | Does not |
|---|---|
| Silent **phone-home** from self-hosted installs (telemetry you cannot turn off) | Analytics on **your** production domain, disclosed in privacy policy |
| Session replay of people’s ambitions without consent | Pageviews (Vercel Analytics / Plausible / Umami) |
| README “free forever” while the hosted app paywalls | Honest pricing page + “self-host the loop yourself” |
| License rug-pull (SSPL bait-and-switch) with no notice | Pick a license **now** and keep it |
| Selling user goal text to train models | AI that runs on **their** data, paid, with a delete story |
| Keys or customer data in git | Billing integration code |

Cal.com moving production closed (2026) is a reminder that **security/customer data** can justify a private production tree later. You do not need that at 0 customers. Do not pre-emptively close the star project.

### 17.2 Rules for AY (lock these)

1. **Add a real `LICENSE` at the repo root.** `package.json` currently says `"license": "ISC"` and there is no root LICENSE file. Use **Apache-2.0** or **MIT**. State in README: source is open; **ambitiousyou.pro** is the paid hosted product.
2. **Hosted vs self-host.** Self-hosters get the achievement-loop code. Billing, AI keys, and production analytics are **env-gated** and default **off**. No beacon to `ambitiousyou.pro` from a self-hosted copy.
3. **Analytics on production only.** Keep Vercel Analytics/Speed Insights behind production. If you add product analytics (funnels for “started weekly review”), use PostHog Cloud or similar **only** on the hosted app, document it in `/privacy-policy`, no session replay of notes/ambitions without an explicit setting.
4. **Do not track self-hosters.** If `NEXT_PUBLIC_SITE_URL` is not `ambitiousyou.pro`, analytics SDKs stay unmounted.
5. **Billing is not a secret.** Pro checkout in the public tree is fine. Webhook secrets are not.
6. **Do not dual-license later as a surprise.** If you ever need an `ee/` folder (Team SSO, etc.), say so in README from the day Team exists — PostHog’s MIT + `ee/` pattern. Not now.
7. **Star-project README** can stay engineering-proud. The **marketing site** must stop saying unlimited free forever. Those are different audiences.

Open source does not forbid making money. It forbids **deceiving** people who clone the repo.

---

## 18. Is the prior research in this file?

**Yes.** Sections **1–12** are the research corpus from the market work, not a summary that dropped the sources.

| Research block | Where in this file |
|---|---|
| Intention–behavior gap, Gollwitzer **d = 0.65**, Locke & Latham | §1.1, §6 |
| Habit/todo death rates, B2C vs B2B conversion, ChartMogul trials | §1.2 |
| Todoist / Notion / LinkedIn / ChatGPT / GoalsWon / Focusmate / ICF coaching | §1.3 |
| TAM tables (goal apps, personal OKR, OKR software, career software, Gallup) | §1.4 |
| Tool sprawl (9–11 apps, 1,200 toggles, Asana 60%, Okta 101+ SaaS) | §1.5 |
| Three ICPs, non-ICPs, Apple Reminders, tab map | §3 |
| Pricing, $1M mix, retention kill-switches | §4 |
| MoR vs Razorpay vs Stripe India, FIRC caveat | §5, §13–§14 |
| AI sequencing vs `AI-ROADMAP.md` | §8 |
| Never/always/wasted/marketing | §9 |
| Day-1 dogfood slice | §10 |
| Payments DX, sandbox, agents, OSS | §13–§17 |
| Founder Pro, limited-time free, Spring-then-launch | **§19 (active)** |
| Agent build spec (stealth Pro, Nest, gates) | [`FUTURE_PLANS_AGENT_INSTRUCTIONS.md`](./FUTURE_PLANS_AGENT_INSTRUCTIONS.md) |

If a later chat invents a new ICP or a new payment vendor, it does not exist until it is edited **here**.

---

## 19. Stealth Pro / limited-time free / Spring-then-launch (active)

This is the **current operating mode**. It does not cancel ICPs, prices, or MoR. It **delays collection** until the founder has used the loop for the career goal and the API has moved to Spring Boot.

**Build spec for coding agents:** [`FUTURE_PLANS_AGENT_INSTRUCTIONS.md`](./FUTURE_PLANS_AGENT_INSTRUCTIONS.md).

**Why this exists:** career (Java / Spring / DSA / system design) is priority 1. AmbitiousYou is the OS that runs that goal. Official SaaS launch is after the rewrite. Until then: ship Pro in Nest, hide it from the hosted app, founder-only via DB.

### 19.1 The sequence (do not reorder)

```
Public: “free for a limited time” + upgrades underway + create your account
        → Do not name Pro, prices, or the feature list
        → Ship every Pro feature in Nest, gated by users.plan
        → Founder is the only Pro row; new signups are free and use today’s app
        → Founder runs Spring + DSA + SD as the primary ambition
        → Migrate API Nest → Spring Boot (same HTTP, same Postgres)
        → MoR + checkout + feature Pro on /pricing
        → Limited-time free ends. Official launch.
```

Do **not** take cards, open a paywall, or run ads. Do **not** wait for Spring before using the loop. Signups stay open.

### 19.2 Public copy

Kill “Free. Actually free.” and “Forever, for the core experience”.

**Only allowed public line:**

> AmbitiousYou is free for a limited time. An upgraded version with significant, meaningful upgrades is underway. Create your account today.

**Forbidden in public UI:** “Pro”, “$12”, feature lists of what is being built, “Upgrade”, lock icons, “coming soon: AI”, “forever free”.

Internal code (`plan`, `ProGuard`) is fine. OSS worry is deferred — do not spend time on LICENSE in this mode.

Where this copy lives today: `free-plan.ts`, `/pricing`, billing settings, `pricingFaq`.

### 19.3 DB flag: founder is the only Pro user

- `users.plan` enum: `free` | `pro`. Default `free`.
- Signup always inserts `free`.
- `ProGuard` on every new Pro route. Frontend `isPro(user)` **omits** UI (does not tease).
- Optional `BETA_PRO_EMAILS` bootstrap on login only. Source of truth is the column.
- No checkout, no webhook until §19 ends.
- Do not cap free users. They keep unlimited ambitions.

Only the founder account is `pro`. A second tester requires an edit in this file first.

### 19.4 What to build

Build the commercial Pro surface in Nest and hide it. Order is in the agent instructions: **loop (Wave 1) before AI/RAG/calendar**. Free users must not see a lock. Founder must be able to use the full loop while learning Spring.

Do not cap free ambitions as a “rehearsal” in this mode.

### 19.5 Spring Boot rewrite (after the loop is habit, before money)

Same HTTP, same Postgres, same `users.plan`. Strangler, not dump-rewrite. JVM on existing VPS/Docker. Then MoR.

### 19.6 When §19 ends (official launch)

1. Founder has used the loop (weekly reviews in the DB).
2. Spring is the production API (or a dated hybrid).
3. MoR sandbox then live.
4. Public copy becomes **$12 / $99** with the real Pro list on `/pricing` and billing.
5. Webhooks drive `users.plan`. Founder can stay Pro.

### 19.7 What this mode is not

- Not a public Pro waitlist or teaser page.
- Not “no new signups.”
- Not payments this quarter.
- Not forever-free. The hosted app will charge later; we just do not itemize Pro until checkout exists.
