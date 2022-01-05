# BUILD env
FROM node:16 AS builder

WORKDIR '/var/www/app'

ENV NODE_ENV production

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile --production=false

COPY src ./src

RUN yarn build

# PROD env
FROM node:16

WORKDIR '/var/www/app'

ENV NODE_ENV production

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY public ./public
COPY --from=builder /var/www/app/dist /var/www/app/dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]