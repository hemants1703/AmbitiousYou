# Multi-stage build for the NestJS backend in a pnpm workspace.
# IMPORTANT: build context is the REPO ROOT, not apps/backend:
#   docker build -f apps/backend/Dockerfile -t ambitiousyou-backend .
#
# glibc base (bookworm-slim), NOT alpine/musl — avoids bcrypt prebuilt-binary
# mismatches/segfaults. Native build toolchain lives only in the build stage.

# ---------- base: pin pnpm to match devEngines + lockfileVersion 9 ----------
FROM node:22-bookworm-slim AS base
# Install pnpm directly rather than via corepack: corepack reads this repo's
# `devEngines.packageManager` field (pnpm@^11.1.2) and rejects the `^` range
# ("expected a semver version"). 11.1.2 satisfies the range, so pnpm's own
# devEngines check still passes.
RUN npm install -g pnpm@11.1.2
WORKDIR /app

# ---------- build: full (incl. dev) install + compile shared + backend ----------
FROM base AS build
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Copy manifests + lockfile first so this layer caches across source-only edits.
# ALL workspace manifests are needed so --frozen-lockfile can validate the
# lockfile's importers (the frontend manifest is only read, never installed).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json    apps/backend/package.json
COPY apps/frontend/package.json   apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json

# Workspace-aware, frozen install of backend + its workspace deps (shared).
# `backend...` pulls backend AND everything it depends on, skipping the frontend.
RUN pnpm install --frozen-lockfile --filter backend...

# Now copy sources (after install to preserve the dep-install cache layer).
COPY packages/shared ./packages/shared
COPY apps/backend    ./apps/backend

# Build shared FIRST (tsc -> packages/shared/dist), then backend
# (nest build -> apps/backend/dist/main.js + copied email templates).
RUN pnpm --filter @ambitiousyou/shared build \
 && pnpm --filter backend build

# Prune to a self-contained PROD deployment. `pnpm deploy` flattens the backend
# + its production-dep closure into /out and copies the built workspace package
# into node_modules/@ambitiousyou/shared (with its freshly built dist).
# Shared MUST already be built (above) or /out ships an empty dist.
# --legacy: pnpm v10+ refuses `deploy` unless inject-workspace-packages=true;
# the legacy algorithm is exactly the copy-the-workspace-package behavior we want.
# NOTE: pnpm's pack logic falls back to .gitignore when a package has no `files`
# field / .npmignore — and apps/backend/.gitignore lists `/dist`, so `deploy`
# omits the compiled output. Copy dist/ in explicitly (includes the email
# templates nest-cli copies there). CMD `node dist/main` then resolves /app/dist/main.js.
RUN pnpm --filter backend deploy --prod --legacy /out \
 && cp -r apps/backend/dist /out/dist

# ---------- runtime: minimal, no toolchain, unprivileged ----------
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3001
WORKDIR /app

# Self-contained deployment: app dist + pruned prod node_modules (incl. shared).
COPY --from=build --chown=node:node /out ./

USER node
EXPOSE 3001

# Readiness: /health does a SELECT 1 (see src/health.controller.ts). Inline Node
# fetch so we don't add curl to the slim image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3001)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Exec form: node is PID 1, so SIGTERM reaches the graceful-shutdown handler
# in main.ts (app.close() -> onModuleDestroy hooks -> pool.end()).
CMD ["node", "dist/main"]
