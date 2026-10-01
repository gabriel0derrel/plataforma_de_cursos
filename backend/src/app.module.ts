import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AlunoModule } from './aluno/aluno.module';
import { AssinaturasModule } from './assinaturas/assinaturas.module';
import { AulasModule } from './aulas/aulas.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { CertificadosModule } from './certificados/certificados.module';
import { CursosModule } from './cursos/cursos.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MatriculasModule } from './matriculas/matriculas.module';
import { ModulosModule } from './modulos/modulos.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { PlanosModule } from './planos/planos.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProgressoAulasModule } from './progresso-aulas/progresso-aulas.module';
import { TrilhasModule } from './trilhas/trilhas.module';
import { TrilhaCursosModule } from './trilha-cursos/trilha-cursos.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({ imports: [PrismaModule, AuthModule, DashboardModule, AlunoModule, UsuariosModule, CategoriasModule, PlanosModule, TrilhasModule, CursosModule, ModulosModule, AulasModule, MatriculasModule, ProgressoAulasModule, AssinaturasModule, PagamentosModule, AvaliacoesModule, CertificadosModule, TrilhaCursosModule] })
export class AppModule {}
