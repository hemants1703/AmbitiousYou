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
push dev  -> Vercel (dev.ambitiousyou.pro)  + GH Actions -> VPS api-dev -> Supabase DEV
push main -> Vercel (www.ambitiousyou.pro)  + GH Actions -> VPS api     -> Supabase PROD
```

Backend zero-downtime = host nginx + Docker, blue-green swap: new container
starts on the idle port (prod 3001/3002, dev 3101/3102), `/health` gate, nginx
`upstream` rewrite + graceful `reload`, old container drained.

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
| `api-dev` | A | VPS IP |

Then issue certs: `certbot --nginx -d api.ambitiousyou.pro -d api-dev.ambitiousyou.pro`

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
  | `API_URL` | `https://api.ambitiousyou.pro` | `https://api-dev.ambitiousyou.pro` |
  | `NEXT_PUBLIC_SITE_URL` | `https://www.ambitiousyou.pro` | `https://dev.ambitiousyou.pro` |

### 6. Deploy
Push to `dev` -> watch GitHub Actions (migrate -> build -> push -> SSH deploy).
Verify zero downtime:
```
while true; do curl -s -o /dev/null -w "%{http_code}\n" https://api-dev.ambitiousyou.pro/health; sleep 0.3; done
```
trigger a redeploy and confirm an unbroken stream of `200`s. Then merge `dev -> main`.

## Ongoing schema changes
Edit `packages/shared/db/schema/*` -> `pnpm db:generate` -> **commit** the SQL ->
push. CI applies it (`drizzle-kit migrate`) before the container swap. Keep
changes expand/contract-safe. **Never `db:push`** to cloud DBs.
