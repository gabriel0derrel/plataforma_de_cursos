-- CreateTable
CREATE TABLE "NotificacaoMobile" (
    "ID_Notificacao" SERIAL NOT NULL,
    "ID_Usuario" INTEGER NOT NULL,
    "EventoId" TEXT NOT NULL,
    "Tipo" TEXT NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Mensagem" TEXT NOT NULL,
    "Lida" BOOLEAN NOT NULL DEFAULT false,
    "DataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificacaoMobile_pkey" PRIMARY KEY ("ID_Notificacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificacaoMobile_ID_Usuario_EventoId_key" ON "NotificacaoMobile"("ID_Usuario", "EventoId");

-- CreateIndex
CREATE INDEX "NotificacaoMobile_ID_Usuario_DataCriacao_idx" ON "NotificacaoMobile"("ID_Usuario", "DataCriacao");

-- AddForeignKey
ALTER TABLE "NotificacaoMobile" ADD CONSTRAINT "NotificacaoMobile_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuario"("ID_Usuario") ON DELETE CASCADE ON UPDATE CASCADE;
