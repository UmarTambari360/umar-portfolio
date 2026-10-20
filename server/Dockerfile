# syntax=docker/dockerfile:1.7
#
# API image (Express + Drizzle). Build context is the REPO ROOT, because this is
# a pnpm workspace and pnpm needs the root lockfile:
#   docker build -f server/Dockerfile .
#
# Three stages, so the final image holds only what it needs to run:
#   base    -> Node + a pinned pnpm
#   build   -> installs everything, compiles TypeScript, extracts prod-only deps
#   runtime -> compiled JS + production node_modules (no compiler, no dev tools)

ARG NODE_VERSION=22
# Pinned on purpose: "pnpm@latest" would let a rebuild silently change tooling.
# Keep in sync with "packageManager" in the root package.json (pnpm 10 needs Node >= 18.12).
ARG PNPM_VERSION=10.29.3

FROM node:${NODE_VERSION}-alpine AS base
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /repo

FROM base AS build
# 1) Manifests only. Docker caches this layer, so dependencies are re-installed
#    only when a package.json or the lockfile changes, not on every code edit.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY server/package.json server/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @umar-portfolio/server...
# 2) Source, then compile TypeScript -> server/dist
COPY server/ server/
RUN pnpm --filter @umar-portfolio/server build
# 3) Extract production dependencies only. "--legacy" is required by pnpm 10
#    for workspaces that do not use injected dependencies.
RUN pnpm --filter @umar-portfolio/server deploy --legacy --prod /out

FROM node:${NODE_VERSION}-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /out/node_modules ./node_modules
COPY --from=build --chown=node:node /out/package.json ./package.json
COPY --from=build --chown=node:node /repo/server/dist ./dist
# SQL migrations are read at runtime by dist/db/migrate.js.
COPY --from=build --chown=node:node /repo/server/src/db/migrations ./src/db/migrations

# Never run as root inside a container: if the app were compromised, root would
# make the damage much worse. The official image ships a "node" user.
USER node
EXPOSE 5000
CMD ["node", "dist/index.js"]

