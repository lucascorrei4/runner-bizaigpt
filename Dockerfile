# ---- Build stage ----
FROM node:20 AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM mcr.microsoft.com/playwright:v1.42.0-jammy
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
ENV HEADLESS=false
ENV SLOW_MO=80

VOLUME ["/data"]
EXPOSE 3000

CMD ["node", "dist/src/server.js"]
