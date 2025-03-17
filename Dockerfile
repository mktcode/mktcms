FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
COPY .env ./.env
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
CMD ["node", "server/index.mjs"]
