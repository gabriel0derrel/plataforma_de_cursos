# Trek HyperLessons

Aplicação de gestão de cursos composta por um frontend React/Vite e uma API NestJS com Prisma, PostgreSQL e autenticação JWT.

## Primeira inicialização

Tenha o Docker Engine com Docker Compose, Node.js 22.13 ou mais recente com npm
e o Expo Go instalado no celular. Conecte o celular e o computador à mesma
rede Wi-Fi.

### 1. Prepare os arquivos de ambiente

Na raiz do projeto, crie somente os `.env` que estiverem faltando:

```bash
for projeto in backend frontend mobile; do
  test -f "$projeto/.env" || cp "$projeto/.env.example" "$projeto/.env"
done
```

Em `backend/.env`, confira as credenciais e o nome do banco em `DATABASE_URL`
e configure `JWT_SECRET`. O PostgreSQL do Compose será inicializado com essas
credenciais. Em `mobile/.env`, use o IP local do computador nas duas URLs:

```env
EXPO_PUBLIC_API_URL=http://192.168.107.175:8080/api
EXPO_PACKAGER_PROXY_URL=http://192.168.107.175:8081
```

### 2. Inicie a pilha Docker

```bash
docker compose --env-file frontend/.env up -d --build
docker compose ps -a
```

Aguarde o backend ficar `healthy`. O serviço `kafka-init` termina com código
`0` após criar o tópico de notificações. Abra o frontend em
`http://localhost:5173` e o Prisma Studio em `http://localhost:5555`.

### 3. Inicie o Metro no computador

Em outro terminal, a partir da raiz do projeto:

```bash
cd mobile
npm ci
npx expo login
npx expo start --go --lan --port 8081
```

Use a mesma conta no Expo Go e escaneie o QR Code que aparecer no terminal.
Na primeira inicialização, a porta `8081` fica reservada para esse Metro local.
Se você já tiver iniciado o perfil opcional `mobile-docker`, veja como liberar
a porta na seção [Rodar o mobile com Expo Go](#rodar-o-mobile-com-expo-go).

## Detalhes da execução com Docker

O Docker Compose inicia o frontend, a API, o PostgreSQL, o Kafka e a Kafka UI.
Para testar no celular, [rode o Metro no computador](#rodar-o-mobile-com-expo-go).

Antes da primeira execução, confira estes arquivos de ambiente:

- `backend/.env`: mantenha as credenciais e o nome do banco na `DATABASE_URL`.
  O Compose usa essas mesmas credenciais para inicializar o PostgreSQL e troca
  apenas o host interno de `localhost` para `postgres`.
- `frontend/.env`: `VITE_API_URL` precisa apontar para a API vista pelo
  navegador, normalmente `http://localhost:8080/api`.

Na raiz do repositório, inicie os serviços em segundo plano:

```bash
docker compose --env-file frontend/.env up -d --build
```

O `--env-file frontend/.env` fornece `VITE_API_URL` no momento do build do
Vite. O backend carrega seu próprio `.env`. O Compose aplica as migrations do
Prisma e cria o tópico Kafka de notificações antes de iniciar a API.

Se o build falhar com `lookup registry-1.docker.io: no such host` e as imagens
já estiverem na máquina, suba a pilha usando as imagens locais:

```bash
docker compose --env-file frontend/.env up -d --no-build --pull never
docker compose ps -a
```

Esse comando usa a última versão construída de cada imagem. Se faltar alguma,
o Docker precisa voltar a resolver `registry-1.docker.io` para refazer o build.

Os acessos publicados na máquina são:

| Serviço | Endereço |
| --- | --- |
| Frontend | http://localhost:5173 |
| Swagger da API | http://localhost:8080/api/docs |
| Kafka UI | http://localhost:8090 |
| Prisma Studio | http://localhost:5555 |

A pilha inicia o Prisma Studio depois da API. O Studio usa o mesmo PostgreSQL
da plataforma e sua porta fica disponível no próprio computador.

A rede `plataforma_interna` conecta a API, o PostgreSQL, o Kafka, o frontend e
a Kafka UI. Frontend e Kafka UI ficam disponíveis no próprio computador. A API
publica a porta `8080` para o celular. PostgreSQL e Kafka ficam na rede interna,
sem portas publicadas. `docker compose down` preserva os volumes nomeados.
`docker compose down -v` remove esses volumes, incluindo os dados do banco e do Kafka.

## Pré-requisitos

- Node.js 22 LTS ou superior e npm;
- PostgreSQL em execução e um banco de dados disponível;
- Apache Kafka em execução para as notificações do mobile;
- Git, para obter o projeto.

## Rodar o projeto

Abra dois terminais na raiz do repositório.

No primeiro, inicie a API:

```bash
cd backend
npm install
npm run prisma:generate
npm run start:dev
```

A API ficará disponível em `http://localhost:8080/api`.

## Notificações do mobile com Kafka

As notificações são produzidas e consumidas pelo backend via Kafka e são exibidas no painel do app mobile. Elas são geradas ao criar conta, entrar, concluir uma aula ou um curso e quando um administrador cadastra uma categoria, trilha, curso, módulo ou aula.

Na web, cadastre o curso escolhendo a categoria e uma trilha dessa categoria. O novo curso entra no fim da trilha. No app, o catálogo segue **Categoria → Trilha → Curso**. Cursos antigos sem vínculo aparecem em **Sem trilha**, dentro da categoria.

Sem Docker, deixe um broker Kafka já instalado e em execução no endereço configurado abaixo. Para usar outra máquina, porta ou cluster Kafka, informe os brokers separados por vírgula. A opção Docker da seção anterior já inicia o broker e a interface Kafka UI automaticamente.

### Iniciar Kafka pelo arquivo compactado

Os passos abaixo usam o Kafka em modo KRaft, sem ZooKeeper e sem Docker. É necessário ter Java 17 ou superior:

```bash
java -version
```

Baixe o arquivo compactado binário do Kafka no [site oficial](https://kafka.apache.org/downloads), extraia-o e entre na pasta criada. Exemplo para a versão `4.4.0`:

```bash
cd ~/Downloads
tar -xzf kafka_2.13-4.4.0.tgz
cd kafka_2.13-4.4.0
```

Na primeira execução, gere o identificador do cluster e formate o armazenamento local:

```bash
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
bin/kafka-storage.sh format --standalone -t "$KAFKA_CLUSTER_ID" -c config/server.properties
```

Inicie o broker e mantenha este terminal aberto:

```bash
bin/kafka-server-start.sh config/server.properties
```

Em outro terminal, ainda dentro da pasta extraída do Kafka, crie o tópico de notificações (o comando pode ser repetido com segurança):

```bash
bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --if-not-exists \
  --topic hyperlessons.mobile.notifications.v1 \
  --partitions 1 \
  --replication-factor 1
```

Confira se o tópico está disponível:

```bash
bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
```

O resultado deve conter `hyperlessons.mobile.notifications.v1`. Para encerrar o Kafka, use `Ctrl + C` no terminal que executa `kafka-server-start.sh`.

As configurações do broker ficam em `backend/.env`:

```env
KAFKA_BROKERS="localhost:9092"
KAFKA_NOTIFICATIONS_TOPIC="hyperlessons.mobile.notifications.v1"
KAFKA_CONSUMER_GROUP="hyperlessons-mobile-notification-store"
```

O backend grava cada mensagem recebida para o aluno no banco e o Expo Go consulta apenas a rota móvel protegida `/api/me/notificacoes`.

No segundo, inicie o frontend:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite — normalmente `http://localhost:5173`.
Por padrão, o frontend já consome `http://localhost:8080/api`.

Caso a API esteja em outro endereço, crie `frontend/.env` com:

```env
VITE_API_URL=http://localhost:8080/api
```

## Rodar o mobile com Expo Go

Instale o Expo Go no celular e use Node.js 22.13 ou mais recente no computador.
Conecte os dois dispositivos à mesma rede Wi-Fi. A API pode continuar no Docker.

Se já iniciou o Metro pelo Docker, pare apenas esse serviço na raiz do projeto
para liberar a porta `8081`:

```bash
docker compose --profile mobile-docker stop mobile
```

Confira se `mobile/.env` aponta para o IP atual do computador. Se precisar criar
o arquivo, use `mobile/.env.example` como base. Na máquina atual, os valores são:

```env
EXPO_PUBLIC_API_URL=http://192.168.107.175:8080/api
EXPO_PACKAGER_PROXY_URL=http://192.168.107.175:8081
```

No computador, instale as dependências e inicie o Metro em um terminal interativo:

```bash
cd mobile
npm ci
npx expo login
npx expo start --go --lan --port 8081
```

Faça login no Expo Go com a mesma conta usada no CLI e leia o QR Code do terminal.
Se o CLI pedir confirmação ao abrir o projeto, responda nesse terminal. Após a
primeira instalação, basta rodar `npx expo start --go --lan --port 8081`.

Se o celular não carregar o projeto, teste `http://192.168.107.175:8081/status`
no navegador do celular. Se o app abrir, mas falhar ao buscar dados, teste
`http://192.168.107.175:8080/api/dashboard/resumo`. O primeiro endereço deve
mostrar `packager-status:running`, e o segundo deve retornar JSON.

### Opção de rodar o Metro no Docker

No Linux, encerre o Metro local com `Ctrl+C` antes de ativar o perfil
`mobile-docker`. O perfil inicia a pilha incluindo o Metro na rede do host:

```bash
docker compose --env-file frontend/.env --profile mobile-docker up -d --build
docker compose exec mobile npx expo login --no-browser
docker compose restart mobile
docker compose logs -f mobile
```

O volume `expo_state` guarda a sessão do Expo CLI do contêiner.

## Swagger

Com a API em execução, acesse `http://localhost:8080/api/docs`.

Para testar rotas protegidas:

1. Use `POST /api/auth/register` para criar uma conta, ou `POST /api/auth/login` para entrar.
2. Copie o valor de `access_token` retornado.
3. Clique em **Authorize** no Swagger e informe o token JWT.
4. Execute as rotas de recursos, como `/api/cursos` e `/api/usuarios`.

O cadastro e o login são públicos. A consulta de categorias, cursos e módulos também é pública; as demais rotas exigem o cabeçalho `Authorization: Bearer <token>`.

## Acessos e administrador

Visitantes veem a Visão Geral, Categorias, Cursos e Módulos. Após o login, todos os menus ficam disponíveis. Apenas administradores podem criar, editar ou remover conteúdos e alterar o indicador de instrutor de um usuário existente.

Na primeira inicialização da API, o administrador é criado ou promovido automaticamente:

```text
Nome: Admin
E-mail: admin@admin.com
Senha: STARTREK
```

Após entrar com essa conta, use o menu **Usuários** e o botão **Tornar instrutor** (ou **Remover instrutor**) para administrar os instrutores.

## Prisma e banco de dados

O schema está em `backend/prisma/schema.prisma`; a migration inicial está em `backend/prisma/migrations`.

Após configurar a conexão, aplique as migrations no ambiente de desenvolvimento:

```bash
cd backend
npx prisma migrate dev
```

O Prisma Client é gerado em `backend/src/generated/prisma`. Não edite essa pasta manualmente. Sempre que o schema for alterado, execute:

```bash
cd backend
npm run prisma:generate
```

Para visualizar e administrar os dados localmente, use:

```bash
cd backend
npx prisma studio
```

## Configuração em um computador novo

1. Clone o repositório e entre na pasta do projeto.
2. Instale PostgreSQL e crie um banco, por exemplo `hyperlessons`.
3. Prepare as variáveis da API:

```bash
cd backend
cp .env.example .env
```

4. Edite `backend/.env` e configure `DATABASE_URL` com as credenciais do PostgreSQL. Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/hyperlessons?schema=public"
JWT_SECRET="uma-chave-longa-aleatoria-e-secreta"
PORT=8080
KAFKA_BROKERS="localhost:9092"
KAFKA_NOTIFICATIONS_TOPIC="hyperlessons.mobile.notifications.v1"
KAFKA_CONSUMER_GROUP="hyperlessons-mobile-notification-store"
```

Para gerar uma chave JWT no Linux/macOS, você pode usar `openssl rand -hex 32`. Nunca envie o arquivo `.env` ao repositório.

5. Instale dependências, gere o client e crie as tabelas:

```bash
npm install
npm run prisma:generate
npx prisma migrate dev
```

6. Em outro terminal, instale e execute o frontend conforme a seção [Rodar o projeto](#rodar-o-projeto).

## Comandos úteis

| Local | Comando | Finalidade |
| --- | --- | --- |
| `backend` | `npm run build` | Compila e valida a API NestJS. |
| `backend` | `npm run start` | Inicia a API sem modo watch. |
| `backend` | `npx prisma migrate dev` | Cria/aplica migrations no desenvolvimento. |
| `backend` | `npx prisma studio` | Abre a interface do banco pelo Prisma. |
| `frontend` | `npm run build` | Gera a versão de produção do frontend. |
