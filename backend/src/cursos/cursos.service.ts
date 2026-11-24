import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';

@Injectable()
export class CursosService extends CrudService {
  constructor(prisma: PrismaService, private readonly notificacoes: NotificacoesService) { super(prisma, 'curso', 'ID_Curso'); }

  async create(data: CreateCursoDto) {
    const curso = await super.create(data) as { Titulo: string };
    void this.notificacoes.publicar({ tipo: 'novo-curso', paraTodosAlunos: true, titulo: 'Novo curso disponível', mensagem: `O curso “${curso.Titulo}” acabou de ser adicionado à plataforma.` });
    return curso;
  }
}
