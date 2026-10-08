# syntax=docker/dockerfile:1.6

############################
# Base
############################
FROM node:20-alpine AS base
WORKDIR /app
# Needed by Next.js standalone output on Alpine
RUN apk add --no-cache libc6-compat

############################
# 1) deps: install all deps
############################
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci

############################
# 2) builder: build Next.js
############################
FROM base AS builder
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env.production .env

# Assumes next.config.js has: output: 'standalone'
RUN npm run build

############################
# 3) runner: minimal runtime
############################
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Only what is needed to run
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# "server.js" is created by Next.js standalone mode
CMD ["node", "server.js"]