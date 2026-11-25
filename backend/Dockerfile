FROM node:22-bookworm-slim AS build

WORKDIR /app

# Prisma needs OpenSSL and a DATABASE_URL while its client is generated. This
# placeholder is never used to connect to a database.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
ENV DATABASE_URL="postgresql://placeholder:placeholder@postgres:5432/placeholder?schema=public"
RUN npx prisma generate && npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./src/generated
COPY prisma-studio.cjs ./prisma-studio.cjs
COPY docker-entrypoint.sh /usr/local/bin/hyperlessons-api

RUN chmod +x /usr/local/bin/hyperlessons-api \
  && chown -R node:node /app

USER node
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/hyperlessons-api"]
CMD ["api"]
