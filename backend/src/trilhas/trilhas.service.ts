import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrilhaDto } from './dto/create-trilha.dto';

@Injectable()
export class TrilhasService extends CrudService {
  constructor(prisma: PrismaService, private readonly notificacoes: NotificacoesService) {
    super(prisma, 'trilha', 'ID_Trilha');
  }

  async create(data: CreateTrilhaDto) {
    const registro = await this.run(() => this.prisma.trilha.create({ data }));
    void this.notificacoes.publicarCriacao('nova-trilha', registro.Titulo);
    return registro;
  }
}
