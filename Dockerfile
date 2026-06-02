FROM node:22.12.0-alpine AS base

# 1. Instalar dependencias necesarias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# 2. Reconstruir el código fuente y Prisma
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm
RUN npx prisma generate
RUN pnpm build

# 3. Servidor de producción listo para correr
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["pnpm", "start"]