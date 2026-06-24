FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=http://localhost:5050/api
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
COPY web/package*.json ./web/
RUN npm install
COPY web ./web
WORKDIR /app/web
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/web/dist ./dist
CMD ["serve", "-s", "dist", "-l", "4173"]
