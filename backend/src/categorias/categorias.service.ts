import { Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService extends CrudService {
  constructor(prisma: PrismaService, private readonly notificacoes: NotificacoesService) {
    super(prisma, 'categoria', 'ID_Categoria');
  }

  async create(data: CreateCategoriaDto) {
    const registro = await this.run(() => this.prisma.categoria.create({ data }));
    void this.notificacoes.publicarCriacao('nova-categoria', registro.Nome);
    return registro;
  }
}
