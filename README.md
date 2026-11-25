# Trek HyperLessons

Plataforma de cursos com frontend React/Vite, API NestJS e aplicativo Expo. O PostgreSQL armazena os dados da plataforma, e o Kafka distribui os eventos de notificação.

## Primeira inicialização

O fluxo de desenvolvimento usa Docker Compose para a web, a API e os serviços de apoio. Para testar no celular, instale também Node.js 22.13 ou mais recente com npm no computador e Expo Go no celular.

### 1. Prepare os arquivos de ambiente

Na raiz do projeto, crie os arquivos `.env` que estiverem faltando:

```sh
for projeto in backend frontend mobile; do
  test -f "$projeto/.env" || cp "$projeto/.env.example" "$projeto/.env"
done
```

| Arquivo | O que configurar |
| --- | --- |
| `backend/.env` | Defina `JWT_SECRET` e confira o usuário, a senha e o nome do banco em `DATABASE_URL`. O Compose usa essas credenciais na primeira inicialização do PostgreSQL. |
| `frontend/.env` | Mantenha `VITE_API_URL=http://localhost:8080/api` para acessar a API pelo navegador do computador. O Vite usa esse valor durante o build. |
| `mobile/.env` | Use o IP do computador na rede local, como no exemplo abaixo. |

```env
EXPO_PUBLIC_API_URL=http://192.168.107.175:8080/api
EXPO_PACKAGER_PROXY_URL=http://192.168.107.175:8081
```

Substitua `192.168.107.175` pelo IP atual do computador nas duas URLs. No celular, `localhost` aponta para o próprio aparelho. Mantenha o `JWT_SECRET` e as credenciais do banco fora do controle de versão.

### 2. Inicie os serviços Docker

```sh
docker compose --env-file frontend/.env up -d --build
docker compose ps -a
```

Aguarde o backend ficar `healthy`. O Compose prepara o tópico de notificações e aplica as migrations do Prisma antes de iniciar a API. O serviço `kafka-init` termina normalmente com `Exited (0)`.

| Serviço | Endereço no computador |
| --- | --- |
| Frontend | [localhost:5173](http://localhost:5173) |
| Swagger da API | [localhost:8080/api/docs](http://localhost:8080/api/docs) |
| Kafka UI | [localhost:8090](http://localhost:8090) |
| Prisma Studio | [localhost:5555](http://localhost:5555) |

O frontend, a Kafka UI e o Studio ficam disponíveis no próprio computador. A API publica a porta `8080` para o celular. PostgreSQL e Kafka se comunicam com os serviços pela rede interna do Docker.

### 3. Abra o app no Expo Go

Com o computador e o celular na mesma rede Wi-Fi, execute em outro terminal:

```sh
cd mobile
npm ci
npx expo login
npx expo start --go --lan --port 8081
```

Entre com a mesma conta no Expo Go, escaneie o QR Code do terminal e responda no terminal se o CLI pedir confirmação. Nas próximas sessões, basta iniciar o Metro com o último comando, a partir da pasta `mobile`.

## Contas, catálogo e notificações

A API cria a conta administrativa inicial na primeira execução. Use `admin@admin.com` com a senha inicial `STARTREK` para entrar na web. Se a conta já existir, a inicialização preserva sua senha. O app mobile usa contas de aluno.

Na web, crie uma categoria e uma trilha dessa categoria antes de cadastrar um curso. Em **Cursos → Novo**, escolha a categoria e a trilha no próprio formulário. O novo curso entra no fim da trilha. No mobile, o catálogo segue **Categoria → Trilha → Curso**. Cursos antigos sem vínculo aparecem em **Sem trilha** dentro da categoria.

O backend publica eventos no Kafka e consome esses eventos para salvar no PostgreSQL as notificações de cada aluno. O app consulta `GET /api/me/notificacoes` e exibe os avisos no painel. O banco guarda o histórico e o estado de leitura de cada aluno.

Os eventos incluem cadastro de conta, login, conclusão de aula ou curso e cadastro de categoria, trilha, curso, módulo ou aula.

Para testar uma rota protegida no Swagger, faça login com `POST /api/auth/login`, copie o `access_token` e use **Authorize** para informar o token.

## Uso diário e diagnóstico

- Para aplicar alterações da web ou da API, repita o comando `up -d --build`.
- Para acompanhar os logs, use `docker compose logs -f backend`. Troque `backend` pelo serviço que deseja verificar, como `frontend` ou `prisma-studio`.
- Para encerrar a pilha, use `docker compose down`. Isso preserva os volumes nomeados. A opção `-v` remove esses volumes, incluindo os dados do PostgreSQL e do Kafka.

| Sintoma | O que verificar |
| --- | --- |
| O Expo Go não carrega o app | No navegador do celular, abra `http://IP_DO_COMPUTADOR:8081/status`. O Metro deve responder `packager-status:running`. Se falhar, confira o IP, o Wi-Fi e o acesso à porta `8081`. |
| O app abre, mas não carrega os dados | No navegador do celular, abra `http://IP_DO_COMPUTADOR:8080/api/dashboard/resumo`. A API deve retornar JSON. Se falhar, confira o endereço em `mobile/.env`, a porta `8080` e os logs do backend. |
| O Prisma Studio não abre | Confira `docker compose ps -a prisma-studio` e `docker compose logs prisma-studio`. O serviço inicia depois que o backend fica saudável. |

Se o Docker falhar ao resolver `registry-1.docker.io` e as imagens já estiverem na máquina, inicie a última versão construída com:

```sh
docker compose --env-file frontend/.env up -d --no-build --pull never
```

## Outros modos de execução

### Metro no Docker

No Linux, encerre o Metro local antes de iniciar o perfil `mobile-docker`, pois ambos usam a porta `8081`. A partir da raiz:

```sh
docker compose --env-file frontend/.env --profile mobile-docker up -d --build
docker compose exec mobile npx expo login --no-browser
docker compose restart mobile
docker compose logs -f mobile
```

O volume `expo_state` preserva a sessão do Expo CLI. Para voltar ao Metro local, use `docker compose --profile mobile-docker stop mobile` e inicie o Expo na pasta `mobile`.

### Backend e frontend sem Docker

Prepare o PostgreSQL e o Kafka localmente. Ajuste `DATABASE_URL` e `KAFKA_BROKERS` em `backend/.env`. Com o Kafka em execução, crie o tópico configurado em `KAFKA_NOTIFICATIONS_TOPIC`. Os valores de exemplo usam o broker `localhost:9092` e o tópico `hyperlessons.mobile.notifications.v1`.

Se estiver usando a distribuição do [Apache Kafka](https://kafka.apache.org/downloads/) em modo KRaft, inicialize o diretório de dados na primeira execução e inicie o broker:

```sh
KAFKA_CLUSTER_ID="$(bin/kafka-storage.sh random-uuid)"
bin/kafka-storage.sh format --standalone -t "$KAFKA_CLUSTER_ID" -c config/server.properties
bin/kafka-server-start.sh config/server.properties
```

Em outro terminal, na pasta da distribuição do Kafka:

```sh
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists \
  --topic hyperlessons.mobile.notifications.v1 --partitions 1 --replication-factor 1
```

Na raiz do projeto, inicie o backend:

```sh
cd backend
npm ci
npm run prisma:generate
npx prisma migrate dev
npm run start:dev
```

Em outro terminal, a partir da raiz, inicie a web:

```sh
cd frontend
npm ci
npm run dev
```

O schema do Prisma fica em `backend/prisma/schema.prisma` e as migrations em `backend/prisma/migrations`. Após alterar o schema, gere novamente o cliente com `npm run prisma:generate` na pasta `backend`. Para inspecionar o banco local, rode `npx prisma studio` nessa mesma pasta.
