import { BadRequestException, Injectable } from '@nestjs/common';
import { CrudService } from '../common/crud.service';
import { Prisma } from '../generated/prisma/client';
import { NotificacoesService } from '../notificacoes/notificacoes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

const trilhasDoCurso = {
  orderBy: { ID_Trilha: 'asc' },
  select: { ID_Trilha: true, Trilha: { select: { ID_Categoria: true } } },
} as const;

function trilhaPrincipal(vinculos: { ID_Trilha: number; Trilha: { ID_Categoria: number | null } }[], categoria: number) {
  return (vinculos.find(({ Trilha }) => Trilha.ID_Categoria === categoria) ?? vinculos[0])?.ID_Trilha;
}

@Injectable()
export class CursosService extends CrudService {
  constructor(prisma: PrismaService, private readonly notificacoes: NotificacoesService) { super(prisma, 'curso', 'ID_Curso'); }

  async create({ ID_Trilha, ...data }: CreateCursoDto) {
    const curso = await this.run(() => this.prisma.$transaction(async (tx) => {
      const Ordem = await this.proximaPosicao(tx, ID_Trilha, data.ID_Categoria);
      const novo = await tx.curso.create({ data });
      await tx.trilhaCurso.create({ data: { ID_Trilha, ID_Curso: novo.ID_Curso, Ordem } });
      return { ...novo, ID_Trilha };
    }));
    void this.notificacoes.publicarCriacao('novo-curso', curso.Titulo);
    return curso;
  }

  async findOne(id: number) {
    const { Trilhas, ...curso } = await this.run(() => this.prisma.curso.findUniqueOrThrow({
      where: { ID_Curso: id }, include: { Trilhas: trilhasDoCurso },
    }));
    return { ...curso, ID_Trilha: trilhaPrincipal(Trilhas, curso.ID_Categoria) ?? null, TotalTrilhas: Trilhas.length };
  }

  async update(id: number, { ID_Trilha, ...data }: UpdateCursoDto) {
    return this.run(() => this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "ID_Curso" FROM "Curso" WHERE "ID_Curso" = ${id} FOR UPDATE`;
      const atual = await tx.curso.findUniqueOrThrow({ where: { ID_Curso: id }, include: { Trilhas: trilhasDoCurso } });
      const categoria = data.ID_Categoria ?? atual.ID_Categoria;
      const mudouCategoria = categoria !== atual.ID_Categoria;
      const trilhaAtual = trilhaPrincipal(atual.Trilhas, atual.ID_Categoria);

      if (mudouCategoria && trilhaAtual !== undefined && ID_Trilha === undefined) {
        throw new BadRequestException('Selecione uma trilha da nova categoria.');
      }

      if (ID_Trilha !== undefined && (ID_Trilha !== trilhaAtual || mudouCategoria)) {
        const Ordem = await this.proximaPosicao(tx, ID_Trilha, categoria);
        await tx.trilhaCurso.deleteMany({ where: { ID_Curso: id, ID_Trilha: { not: ID_Trilha } } });
        if (!atual.Trilhas.some((trilha) => trilha.ID_Trilha === ID_Trilha)) {
          await tx.trilhaCurso.create({ data: { ID_Trilha, ID_Curso: id, Ordem } });
        }
      }

      const curso = await tx.curso.update({ where: { ID_Curso: id }, data });
      return { ...curso, ID_Trilha: ID_Trilha ?? trilhaAtual ?? null };
    }));
  }

  private async proximaPosicao(tx: Prisma.TransactionClient, trilha: number, categoria: number) {
    // Serializa novos vínculos na mesma trilha para evitar posições repetidas.
    const [item] = await tx.$queryRaw<{ ID_Categoria: number | null }[]>`
      SELECT "ID_Categoria" FROM "Trilha" WHERE "ID_Trilha" = ${trilha} FOR UPDATE`;
    if (!item || item.ID_Categoria !== categoria) {
      throw new BadRequestException('Selecione uma trilha da categoria do curso.');
    }
    const { _max } = await tx.trilhaCurso.aggregate({ where: { ID_Trilha: trilha }, _max: { Ordem: true } });
    return (_max.Ordem ?? 0) + 1;
  }
}
