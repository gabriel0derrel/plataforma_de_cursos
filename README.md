# Trek HyperLessons

Aplicação de gestão de cursos composta por um frontend React/Vite e uma API NestJS com Prisma, PostgreSQL e autenticação JWT.

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

As notificações são produzidas e consumidas pelo backend via Kafka e são exibidas somente no aplicativo mobile. Elas são geradas ao criar conta, entrar, concluir uma aula, concluir um curso e quando um administrador publica um curso.

O projeto não usa Docker. Antes de iniciar a API, deixe um broker Kafka já instalado e em execução no endereço configurado abaixo. Para usar outra máquina, porta ou cluster Kafka, informe os brokers separados por vírgula.

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

O aplicativo mobile está na pasta `mobile` e pode ser aberto no celular pelo **Expo Go**.

1. Instale o aplicativo Expo Go no Android (Google Play) ou no iOS (App Store).
2. Deixe o computador e o celular na mesma rede Wi-Fi.
3. Crie `mobile/.env` a partir de `mobile/.env.example` e substitua o IP pelo endereço local do computador que executa a API. Não use `localhost`, pois no celular ele aponta para o próprio dispositivo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:8080/api
```

4. Em um novo terminal, execute:

```bash
cd mobile
npm install
npx expo start
```

5. Após o Metro Bundler exibir o QR Code, abra o Expo Go e faça a leitura do código. No iOS, também é possível ler o QR Code com o aplicativo Câmera e escolher abrir no Expo Go.

O app será carregado no celular e atualizado automaticamente ao salvar alterações. Para encerrar o servidor, pressione `Ctrl + C` no terminal.

Se a rede impedir a conexão entre celular e computador, inicie o Expo usando um túnel:

```bash
cd mobile
npx expo start --tunnel
```

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
