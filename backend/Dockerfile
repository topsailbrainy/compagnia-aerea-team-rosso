FROM node:24.14-trixie-slim AS builder

WORKDIR /app

COPY ./package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:24.14-trixie-slim 

WORKDIR /app

ENV NODE_ENV=production

COPY ./package*.json .

RUN npm install

COPY --from=builder /app/dist /app/dist

CMD ["npm", "run", "start"]