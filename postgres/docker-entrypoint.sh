#!/bin/sh
set -eu

: "${DATABASE_URL:?DATABASE_URL deve estar definido em backend/.env}"

# A fonte das credenciais é a mesma DATABASE_URL usada pelo backend. O host e
# a porta não importam para a inicialização do Postgres e por isso são apenas
# removidos aqui. Este formato atende URLs PostgreSQL convencionais.
database_url=${DATABASE_URL#*://}
credentials=${database_url%%@*}
database_and_options=${database_url#*@*/}

if [ "$credentials" = "$database_url" ] || [ "$database_and_options" = "$database_url" ]; then
  echo "DATABASE_URL não possui o formato postgresql://usuario:senha@host:porta/banco" >&2
  exit 1
fi

POSTGRES_USER=${POSTGRES_USER:-${credentials%%:*}}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-${credentials#*:}}
POSTGRES_DB=${POSTGRES_DB:-${database_and_options%%\?*}}

export POSTGRES_USER POSTGRES_PASSWORD POSTGRES_DB
exec /usr/local/bin/docker-entrypoint.sh "$@"
