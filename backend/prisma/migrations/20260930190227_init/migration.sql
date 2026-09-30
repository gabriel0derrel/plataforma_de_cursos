-- CreateTable
CREATE TABLE "Usuario" (
    "ID_Usuario" SERIAL NOT NULL,
    "NomeCompleto" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Senha" TEXT NOT NULL,
    "IsInstrutor" BOOLEAN NOT NULL DEFAULT false,
    "DataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("ID_Usuario")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "ID_Categoria" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Descricao" TEXT,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("ID_Categoria")
);

-- CreateTable
CREATE TABLE "Plano" (
    "ID_Plano" SERIAL NOT NULL,
    "Nome" TEXT NOT NULL,
    "Descricao" TEXT,
    "Preco" DECIMAL(10,2) NOT NULL,
    "DuracaoMeses" INTEGER NOT NULL,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("ID_Plano")
);

-- CreateTable
CREATE TABLE "Trilha" (
    "ID_Trilha" SERIAL NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Descricao" TEXT NOT NULL,
    "ID_Categoria" INTEGER,

    CONSTRAINT "Trilha_pkey" PRIMARY KEY ("ID_Trilha")
);

-- CreateTable
CREATE TABLE "Curso" (
    "ID_Curso" SERIAL NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Descricao" TEXT NOT NULL,
    "ID_Instrutor" INTEGER NOT NULL,
    "ID_Categoria" INTEGER NOT NULL,
    "Nivel" TEXT NOT NULL,
    "DataPublicacao" TIMESTAMP(3) NOT NULL,
    "TotalAulas" INTEGER NOT NULL DEFAULT 0,
    "TotalHoras" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("ID_Curso")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "ID_Modulo" SERIAL NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Ordem" INTEGER NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("ID_Modulo")
);

-- CreateTable
CREATE TABLE "Aula" (
    "ID_Aula" SERIAL NOT NULL,
    "ID_Modulo" INTEGER NOT NULL,
    "Titulo" TEXT NOT NULL,
    "TipoConteudo" TEXT NOT NULL,
    "URL_Conteudo" TEXT,
    "DuracaoMinutos" INTEGER NOT NULL,
    "Ordem" INTEGER NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("ID_Aula")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "ID_Matricula" SERIAL NOT NULL,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "DataMatricula" TIMESTAMP(3) NOT NULL,
    "DataConclusao" TIMESTAMP(3),

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("ID_Matricula")
);

-- CreateTable
CREATE TABLE "ProgressoAula" (
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Aula" INTEGER NOT NULL,
    "Status" TEXT NOT NULL,
    "DataConclusao" TIMESTAMP(3),

    CONSTRAINT "ProgressoAula_pkey" PRIMARY KEY ("ID_Usuario","ID_Aula")
);

-- CreateTable
CREATE TABLE "Assinatura" (
    "ID_Assinatura" SERIAL NOT NULL,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Plano" INTEGER NOT NULL,
    "DataInicio" TIMESTAMP(3) NOT NULL,
    "DataFim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("ID_Assinatura")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "ID_Pagamento" SERIAL NOT NULL,
    "ID_Assinatura" INTEGER NOT NULL,
    "ValorPago" DECIMAL(10,2) NOT NULL,
    "MetodoPagamento" TEXT NOT NULL,
    "DataPagamento" TIMESTAMP(3) NOT NULL,
    "Id_Transacao_Gateway" TEXT NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("ID_Pagamento")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "ID_Avaliacao" SERIAL NOT NULL,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "Nota" INTEGER NOT NULL,
    "Comentario" TEXT,
    "DataAvaliacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("ID_Avaliacao")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "ID_Certificado" SERIAL NOT NULL,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "ID_Trilha" INTEGER,
    "CodigoVerificacao" TEXT NOT NULL,
    "DataEmissao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("ID_Certificado")
);

-- CreateTable
CREATE TABLE "TrilhaCurso" (
    "ID_Trilha" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "Ordem" INTEGER NOT NULL,

    CONSTRAINT "TrilhaCurso_pkey" PRIMARY KEY ("ID_Trilha","ID_Curso")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_Email_key" ON "Usuario"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_Nome_key" ON "Categoria"("Nome");

-- CreateIndex
CREATE UNIQUE INDEX "Plano_Nome_key" ON "Plano"("Nome");

-- CreateIndex
CREATE UNIQUE INDEX "Modulo_ID_Curso_Ordem_key" ON "Modulo"("ID_Curso", "Ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Aula_ID_Modulo_Ordem_key" ON "Aula"("ID_Modulo", "Ordem");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_ID_Usuario_ID_Curso_key" ON "Matricula"("ID_Usuario", "ID_Curso");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_Id_Transacao_Gateway_key" ON "Pagamento"("Id_Transacao_Gateway");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_ID_Usuario_ID_Curso_key" ON "Avaliacao"("ID_Usuario", "ID_Curso");

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_CodigoVerificacao_key" ON "Certificado"("CodigoVerificacao");

-- CreateIndex
CREATE UNIQUE INDEX "TrilhaCurso_ID_Trilha_Ordem_key" ON "TrilhaCurso"("ID_Trilha", "Ordem");

-- AddForeignKey
ALTER TABLE "Trilha" ADD CONSTRAINT "Trilha_ID_Categoria_fkey" FOREIGN KEY ("ID_Categoria") REFERENCES "Categoria"("ID_Categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_ID_Instrutor_fkey" FOREIGN KEY ("ID_Instrutor") REFERENCES "Usuario"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_ID_Categoria_fkey" FOREIGN KEY ("ID_Categoria") REFERENCES "Categoria"("ID_Categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Modulo" ADD CONSTRAINT "Modulo_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Curso"("ID_Curso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_ID_Modulo_fkey" FOREIGN KEY ("ID_Modulo") REFERENCES "Modulo"("ID_Modulo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Curso"("ID_Curso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoAula" ADD CONSTRAINT "ProgressoAula_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoAula" ADD CONSTRAINT "ProgressoAula_ID_Aula_fkey" FOREIGN KEY ("ID_Aula") REFERENCES "Aula"("ID_Aula") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_ID_Plano_fkey" FOREIGN KEY ("ID_Plano") REFERENCES "Plano"("ID_Plano") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_ID_Assinatura_fkey" FOREIGN KEY ("ID_Assinatura") REFERENCES "Assinatura"("ID_Assinatura") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Curso"("ID_Curso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Curso"("ID_Curso") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_ID_Trilha_fkey" FOREIGN KEY ("ID_Trilha") REFERENCES "Trilha"("ID_Trilha") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrilhaCurso" ADD CONSTRAINT "TrilhaCurso_ID_Trilha_fkey" FOREIGN KEY ("ID_Trilha") REFERENCES "Trilha"("ID_Trilha") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrilhaCurso" ADD CONSTRAINT "TrilhaCurso_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Curso"("ID_Curso") ON DELETE CASCADE ON UPDATE CASCADE;
