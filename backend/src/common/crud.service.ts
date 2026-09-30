import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Reutiliza o comportamento CRUD sem esconder os recursos em uma pasta genérica. */
@Injectable()
export class CrudService {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly delegateName: string,
    private readonly idField: string,
  ) {}

  private get delegate(): any {
    return (this.prisma as any)[this.delegateName];
  }

  async create(data: object) { return this.run(() => this.delegate.create({ data })); }
  async findAll() { return this.delegate.findMany(); }
  async findOne(id: number) {
    const item = await this.delegate.findUnique({ where: { [this.idField]: id } });
    if (!item) throw new NotFoundException('Registro não encontrado.');
    return item;
  }
  async update(id: number, data: object) {
    return this.run(() => this.delegate.update({ where: { [this.idField]: id }, data }));
  }
  async remove(id: number) {
    return this.run(() => this.delegate.delete({ where: { [this.idField]: id } }));
  }

  protected async run<T>(operation: () => Promise<T>): Promise<T> {
    try { return await operation(); }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException('Registro não encontrado.');
        if (error.code === 'P2002') throw new ConflictException('Já existe um registro com estes dados únicos.');
        if (error.code === 'P2003') throw new ConflictException('Há uma referência inválida para outro registro.');
      }
      throw error;
    }
  }
}
