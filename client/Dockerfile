# syntax=docker/dockerfile:1.7
#
# Web image: builds the React app, then serves it with Caddy, which also
# reverse-proxies /api to the server and handles HTTPS certificates.
# Build context is the REPO ROOT:
#   docker build -f client/Dockerfile .

ARG NODE_VERSION=22
ARG PNPM_VERSION=10.29.3

FROM node:${NODE_VERSION}-alpine AS build
ARG PNPM_VERSION
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /repo

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY client/package.json client/
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @umar-portfolio/client...
COPY client/ client/
# `build` runs the type check first, then Vite writes static files to client/dist.
RUN pnpm --filter @umar-portfolio/client build

# Final image: only Caddy plus the finished static files (no Node at all).
FROM caddy:2-alpine AS runtime
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/client/dist /srv
EXPOSE 80 443

