# Trek HyperLessons

Aplicacao React com Vite para a administracao da plataforma de cursos.

## Executar

1. Instale as dependencias com npm install.
2. Inicie com npm run dev.

## Backend

Defina VITE_API_URL no arquivo .env, por exemplo:

    VITE_API_URL=http://localhost:8080/api

Nao ha uso de localStorage. A aplicacao consome GET e POST para os recursos e POST /auth/login e POST /auth/register para autenticacao. O token de acesso e mantido somente em memoria.

Os endpoints previstos sao:

- /auth/login e /auth/register
- /usuarios, /categorias, /cursos, /modulos e /aulas
- /matriculas, /progresso-aulas, /avaliacoes, /trilhas e /trilha-cursos
- /certificados, /planos, /assinaturas e /pagamentos

Cada endpoint de recurso deve aceitar GET para listagem e POST para criacao.
