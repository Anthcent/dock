FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY api/package*.json ./api/
RUN npm install
COPY api ./api
WORKDIR /app/api
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/api/package*.json ./api/
RUN npm install --omit=dev
COPY --from=builder /app/api/dist ./api/dist
WORKDIR /app/api
CMD ["node", "dist/server.js"]
