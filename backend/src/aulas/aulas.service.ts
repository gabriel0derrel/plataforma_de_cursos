import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAulaDto } from './dto/create-aula.dto';

@Injectable()
export class AulasService extends CrudService {
  constructor(prisma: PrismaService, private readonly notificacoes: NotificacoesService) {
    super(prisma, 'aula', 'ID_Aula');
  }

  async create(data: CreateAulaDto) {
    const registro = await this.run(() => this.prisma.aula.create({ data }));
    void this.notificacoes.publicarCriacao('nova-aula', registro.Titulo);
    return registro;
  }
}
