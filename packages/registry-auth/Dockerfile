# BUILD env
FROM node:16-bullseye AS builder

WORKDIR '/var/www/app'

ENV NODE_ENV production

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --pure-lockfile --production=false

COPY src ./src
COPY .parcelrc ./parcelrc

RUN yarn build

# PROD env
FROM verdaccio/verdaccio

USER root

# Patch notify handlebars template engine with JSON function
RUN echo $'\n_handlebars.default.registerHelper("json", function(context) {return JSON.stringify(context); });' >> /opt/verdaccio/build/lib/notify/index.js

COPY --from=builder /var/www/app/dist /verdaccio/plugins/verdaccio-rrox-registry-auth/dist
COPY package.json /verdaccio/plugins/verdaccio-rrox-registry-auth/package.json

RUN cd /verdaccio/plugins/verdaccio-rrox-registry-auth && npm install --only=prod

COPY verdaccio.yaml /verdaccio/conf/config.yaml

USER verdaccio