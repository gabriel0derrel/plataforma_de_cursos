#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL deve estar definido}"

# O .env local usa localhost. Dentro do Compose, o banco deve ser alcançado
# pelo nome do serviço na rede interna, sem alterar o .env usado fora do Docker.
# A variável precisa ser exportada pelo shell: alterá-la em um processo Node
# filho não modifica o ambiente deste processo que iniciará a API.
DATABASE_URL="$(node -e '
  const url = new URL(process.env.DATABASE_URL);
  url.hostname = process.env.DOCKER_POSTGRES_HOST || "postgres";
  url.port = process.env.DOCKER_POSTGRES_PORT || "5432";
  process.stdout.write(url.toString());
')"
export DATABASE_URL

if [ "${1:-api}" = api ]; then
  ./node_modules/.bin/prisma migrate deploy --config ./prisma.config.ts
  set -- node dist/main
fi

exec "$@"
