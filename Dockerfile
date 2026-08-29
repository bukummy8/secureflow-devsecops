FROM node:22.23.2-alpine3.24

WORKDIR /app

COPY app/package*.json ./

RUN apk upgrade --no-cache \
    && npm ci --omit=dev \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx

COPY app/ .

ENV NODE_ENV=production

EXPOSE 3000

USER node

CMD ["node", "server.js"]