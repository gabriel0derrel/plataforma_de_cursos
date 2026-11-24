import { Module } from '@nestjs/common';
import { AlunoController } from './aluno.controller';
import { AlunoService } from './aluno.service';
import { NotificacoesModule } from '../notificacoes/notificacoes.module';
@Module({ imports: [NotificacoesModule], controllers: [AlunoController], providers: [AlunoService] })
export class AlunoModule {}
