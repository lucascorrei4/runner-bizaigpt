# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including dev) to compile TypeScript
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript project (creates dist/)
RUN npm run build

# ---- Runtime stage ----
FROM mcr.microsoft.com/playwright:v1.42.0-jammy

WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
# Copy compiled output
COPY --from=builder /app/dist ./dist

# Environment defaults (can be overridden in EasyPanel)
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data
ENV HEADLESS=false
ENV SLOW_MO=80

# Persistent volume for session storage and logs
VOLUME ["/data"]

EXPOSE 3000

# Start the compiled server
CMD ["node", "dist/src/server.js"]
