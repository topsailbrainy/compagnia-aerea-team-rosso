FROM node:24.14-trixie-slim AS builder

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.29.7

COPY --from=builder /app/dist /usr/share/nginx/html