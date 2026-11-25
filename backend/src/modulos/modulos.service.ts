import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class ModulosService extends CrudService {
  constructor(prisma: PrismaService, private readonly notificacoes: NotificacoesService) {
    super(prisma, 'modulo', 'ID_Modulo');
  }

  async create(data: CreateModuloDto) {
    const registro = await this.run(() => this.prisma.modulo.create({ data }));
    void this.notificacoes.publicarCriacao('novo-modulo', registro.Titulo);
    return registro;
  }
}
