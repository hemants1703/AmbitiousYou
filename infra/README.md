# infra/ — deployment reference

In-repo reference for the AmbitiousYou deployment. The full design is in the
approved plan. **These files run on the VPS / in dashboards — they are NOT built
into the Docker image** (`.dockerignore` excludes `infra/`).

| File | Purpose | Where it ends up |
|---|---|---|
| `setup-vps.sh` | One-time provision + hardening (Docker, nginx, certbot, ufw, deploy user) | run once as root on the VPS |
| `deploy.sh` | Zero-downtime blue-green container swap for one env | `/opt/ambitiousyou/deploy.sh` |
| `nginx/sites.conf` | Reverse-proxy server blocks (certbot adds TLS) | `/etc/nginx/sites-available/` |

## Architecture

```
push dev  -> Vercel (dev.ambitiousyou.pro)  + GH Actions -> VPS api.dev -> Supabase DEV
push main -> Vercel (www.ambitiousyou.pro)  + GH Actions -> VPS api     -> Supabase PROD
```

Backend zero-downtime = host nginx + Docker, blue-green swap: new container
starts on the idle port (prod 3001/3002, dev 3101/3102), `/health` gate, nginx
`upstream` rewrite + graceful `reload`, old container drained.

## How the CI/CD works (plain-English)

Think of it as **two independent robots** that wake up every time you `git push`:

- **Robot A — Vercel** rebuilds your **frontend** (the website).
- **Robot B — GitHub Actions** rebuilds your **backend** (the API server) and ships it to your VPS.

They run in parallel and don't talk to each other. The branch you push to decides
which environment gets updated:

| You push to… | Frontend goes live at | Backend goes live at | Database used |
|---|---|---|---|
| `dev`  | dev.ambitiousyou.pro | api.dev.ambitiousyou.pro | Supabase **dev** |
| `main` | www.ambitiousyou.pro | api.ambitiousyou.pro     | Supabase **prod** |

### The big picture

```
                            you: git push  (to dev or main)
                                     │
              ┌──────────────────────┴───────────────────────┐
              ▼                                               ▼
   ┌────────────────────┐                      ┌──────────────────────────────┐
   │  VERCEL (automatic)│                      │  GITHUB ACTIONS (free runner) │
   │  runs `next build` │                      │  builds + ships the backend   │
   └─────────┬──────────┘                      │  1. run DB migrations          │
             │ publishes                       │  2. build Docker image         │
             ▼                                 │  3. push image to GHCR         │
   dev / www .ambitiousyou.pro                 │  4. ssh into the VPS ──────────┼──┐
   (the website)                               └──────────────────────────────┘  │
                                                                                  ▼
                                                        ┌───────────────────────────────┐
                                                        │  YOUR VPS                      │
                                                        │  deploy.sh does a blue-green   │
                                                        │  swap:  nginx ──► backend box  │
                                                        └───────────────┬───────────────┘
                                                                        ▼
                                                        api.dev / api .ambitiousyou.pro
                                                                        │
                                                                        ▼
                                                              Supabase (dev / prod DB)
```

The key idea: **all the heavy lifting (building the image) happens on GitHub's
free machine, not your VPS.** Your VPS only downloads the finished "box" (the
Docker image) and runs it. That's why the VPS can be small — but not *too* small
(see **VPS sizing** below).

### The frontend half (Vercel) — you run nothing
You connect the repo to Vercel once. After that, every push: Vercel pulls the
code, runs `next build`, and publishes it to the right domain automatically. The
only per-environment difference is two env vars (`API_URL`, `NEXT_PUBLIC_SITE_URL`)
that you set once in the Vercel dashboard so the dev site talks to the dev API and
the prod site to the prod API.

### The backend half (GitHub Actions → VPS) — the 5 steps
A push to `dev`/`main` triggers `.github/workflows/deploy-backend.yml`, which runs
these steps on a throwaway GitHub machine:

1. **Checkout + install** the code.
2. **Migrate the database** — `drizzle-kit migrate` applies any new schema changes
   to that environment's Supabase, *before* the new code goes live.
3. **Build the Docker image** — packages the NestJS server into a self-contained
   "box" that runs identically anywhere.
4. **Push the image to GHCR** (GitHub Container Registry — free image storage).
5. **SSH into the VPS** and run `deploy.sh`, which swaps the running container
   with **zero downtime** (next section).

### Why "zero downtime"? The blue-green swap

A naive deploy would *stop the old server, then start the new one* — leaving a few
seconds where requests fail. Blue-green avoids that by running the **new** server
**next to** the old one and only switching once the new one is proven healthy.
Each environment has two ports — one "active", one "idle":

```
STEP 1 — before deploy: nginx sends everyone to the OLD container
        nginx ──► :3001  [OLD v1]  ◄── all traffic
                  :3002  (idle, empty)

STEP 2 — deploy.sh starts the NEW container on the idle port and health-checks it
        nginx ──► :3001  [OLD v1]  ◄── all traffic STILL here (no one affected)
                  :3002  [NEW v2]  ← starting…  curl /health until it returns 200

STEP 3 — once NEW is healthy, rewrite nginx's upstream + `nginx reload` (graceful)
        nginx ──► :3002  [NEW v2]  ◄── all NEW traffic now here
                  :3001  [OLD v1]  ← finishes its in-flight requests, then removed
```

If the new container **never** becomes healthy (e.g. it can't reach the database —
that's what the DB-aware `/health` endpoint checks), `deploy.sh` **aborts and
leaves the old one running**. A broken deploy can't take your site down.

`nginx reload` is graceful: existing requests finish on the old worker while new
requests go to the new config — so the switch itself drops nothing. And because
the backend handles `SIGTERM` (drains its DB connections before exiting), removing
the old container is clean too.

### What you'll actually see
- **GitHub → Actions tab:** the workflow running, its 5 steps turning green.
- **Vercel dashboard:** a deployment going "Building" → "Ready".
- Your live site updates a couple of minutes later — with no outage.

### A concrete example
You finish a feature on `dev`, commit, and `git push origin dev`:
1. *Instantly:* both robots start.
2. *~1 min:* Vercel finishes → `dev.ambitiousyou.pro` shows your new UI.
3. *~2–3 min:* Actions migrates the dev DB, builds the image, pushes it, SSHes in.
4. `deploy.sh` starts the new container on the idle port, waits for `/health`=200,
   flips nginx, drains the old one → `api.dev.ambitiousyou.pro` now runs new code,
   **zero requests dropped**.
5. Happy with it? Merge `dev → main`. The exact same thing happens for production
   (`www` + `api` + Supabase prod).

## VPS sizing

The VPS only **runs** containers (GitHub Actions does the building), but it runs
**both** the prod and dev backends + nginx + the Docker daemon, and **briefly a
second copy of a backend** during every blue-green deploy.

- **512 MB is not enough** — steady-state is already ~475 MB, and the transient
  blue-green container pushes it over → the OOM killer strikes mid-deploy.
- **2 GB recommended** (DigitalOcean `s-1vcpu-2gb` / `s-2vcpu-2gb`) — real headroom
  for prod + dev + the blue-green double. **Your free DO credits cover this**, so
  start here; after the credits it's ~$12-18/mo.
- **1 GB** (`s-1vcpu-1gb`, ~$6/mo) is the floor if you downsize later — workable but
  tight, leaning on the 2 GB swap `setup-vps.sh` creates.
- *Aside:* Hetzner CX22 (2 vCPU / 4 GB, ~€4.5/mo) is the best raw value if you ever
  move off DigitalOcean.

Swap is a safety net for short spikes, not a substitute for RAM (it's slow disk).

## Bring-up checklist

### 1. Supabase (2 projects)
- Create `ambitiousyou-prod` and `ambitiousyou-dev`.
- Grab each **session pooler** URL (IPv4, port 5432, host `aws-0-<region>.pooler.supabase.com`,
  user `postgres.<ref>`), append `?sslmode=require`. Use it for both runtime and CI migrations.

### 2. VPS
```
ssh root@<VPS_IP> 'DEPLOY_PUBKEY="ssh-ed25519 AAAA... ci-deploy" bash -s' < infra/setup-vps.sh
scp infra/deploy.sh        deploy@<VPS_IP>:/opt/ambitiousyou/deploy.sh
scp infra/nginx/sites.conf deploy@<VPS_IP>:/tmp/ambitiousyou.conf
# on the VPS, as root:
chmod +x /opt/ambitiousyou/deploy.sh && chown deploy:deploy /opt/ambitiousyou/deploy.sh
mv /tmp/ambitiousyou.conf /etc/nginx/sites-available/ambitiousyou.conf
ln -sf /etc/nginx/sites-available/ambitiousyou.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```
Create the secret env files (mode 600, owner deploy):
```
/opt/ambitiousyou/prod/backend.env
/opt/ambitiousyou/dev/backend.env
```
each with `DATABASE_URL`, `APP_BASE_URL`, `AZURE_CONNECTION_STRING`, `NODE_ENV=production`.
Then `docker login ghcr.io` as deploy (read:packages PAT) unless the image is public.

### 3. DNS
| Record | Type | Value |
|---|---|---|
| `www` | CNAME | `cname.vercel-dns.com` |
| `@` apex | A/ALIAS | Vercel (`76.76.21.21`) + redirect to www |
| `dev` | CNAME | Vercel target |
| `api` | A | VPS IP |
| `api.dev` | A | VPS IP |

Then issue certs: `certbot --nginx -d api.ambitiousyou.pro -d api.dev.ambitiousyou.pro`

### 4. GitHub
- **Environments** `production` + `development`, each with secrets:
  `DATABASE_URL`, `APP_BASE_URL`, `AZURE_CONNECTION_STRING`.
- **Repo secrets:** `VPS_HOST`, `VPS_USER` (=`deploy`), `VPS_SSH_KEY` (CI deploy private key).
- GHCR push uses the built-in `GITHUB_TOKEN` (workflow already has `packages: write`).

### 5. Vercel
- Import repo, **Root Directory = `apps/frontend`**, Node 22.
- Production branch `main` -> `www.ambitiousyou.pro` (+ apex redirect to www).
- Add `dev.ambitiousyou.pro`, assign to the `dev` branch.
- Env vars (scoped):
  | Var | Production | Preview/dev |
  |---|---|---|
  | `API_URL` | `https://api.ambitiousyou.pro` | `https://api.dev.ambitiousyou.pro` |
  | `NEXT_PUBLIC_SITE_URL` | `https://www.ambitiousyou.pro` | `https://dev.ambitiousyou.pro` |

### 6. Deploy
Push to `dev` -> watch GitHub Actions (migrate -> build -> push -> SSH deploy).
Verify zero downtime:
```
while true; do curl -s -o /dev/null -w "%{http_code}\n" https://api.dev.ambitiousyou.pro/health; sleep 0.3; done
```
trigger a redeploy and confirm an unbroken stream of `200`s. Then merge `dev -> main`.

## Ongoing schema changes
Edit `packages/shared/db/schema/*` -> `pnpm db:generate` -> **commit** the SQL ->
push. CI applies it (`drizzle-kit migrate`) before the container swap. Keep
changes expand/contract-safe. **Never `db:push`** to cloud DBs.
