# === Build stage ===
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

COPY . .
RUN npm run build

# === Runtime stage ===
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/data ./server/data
COPY --from=builder /app/static-assets ./static-assets
COPY --from=builder /app/attached_assets ./attached_assets

EXPOSE 8080
CMD ["node", "dist/index.cjs"]
