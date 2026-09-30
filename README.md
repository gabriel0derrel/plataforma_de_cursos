# Trek HyperLessons

Aplicação de gestão de cursos composta por um frontend React/Vite e uma API NestJS com Prisma, PostgreSQL e autenticação JWT.

## Pré-requisitos

- Node.js 22 LTS ou superior e npm;
- PostgreSQL em execução e um banco de dados disponível;
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

## Swagger

Com a API em execução, acesse `http://localhost:8080/api/docs`.

Para testar rotas protegidas:

1. Use `POST /api/auth/register` para criar uma conta, ou `POST /api/auth/login` para entrar.
2. Copie o valor de `access_token` retornado.
3. Clique em **Authorize** no Swagger e informe o token JWT.
4. Execute as rotas de recursos, como `/api/cursos` e `/api/usuarios`.

O cadastro e o login são públicos. As demais rotas exigem o cabeçalho `Authorization: Bearer <token>`.

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
