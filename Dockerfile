# =========================================================================
# Stage 1: Build Frontend Assets
# =========================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./
RUN npm ci

# Copy all source files and manuals
COPY . .

# Run Vite build (machines.json already bundled in src/data)
RUN npx tsc && npx vite build

# =========================================================================
# Stage 2: Production Runtime Server
# =========================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy runtime server and static directories
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/manuals ./manuals
COPY --from=builder /app/server.cjs ./server.cjs
RUN mkdir -p ./credentials
COPY --from=builder /app/credentials* ./credentials/

# Default port for Cloud Run is 8080
EXPOSE 8080

CMD ["node", "server.cjs"]

