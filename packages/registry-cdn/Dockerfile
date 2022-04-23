# BUILD env
FROM node:16 AS builder

WORKDIR '/var/www/app'

ENV BUILD_ID RROx
ENV NODE_ENV production

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile --production=false

COPY modules ./modules
COPY plugins ./plugins
COPY public ./public
COPY rollup.config.js ./rollup.config.js

RUN yarn build

# PROD env
FROM node:16

WORKDIR '/var/www/app'

ENV NODE_ENV production
ENV PORT 3000
ENV NPM_REGISTRY_URL https://rrox-registry.tom90.nl
ENV NPM_CACHE_DIR /cache

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile

COPY --from=builder /var/www/app/public /var/www/app/public
COPY --from=builder /var/www/app/server.js /var/www/app/server.js

EXPOSE 3000

CMD [ "node", "server.js" ]