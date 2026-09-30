import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const selectSafe = { ID_Usuario: true, NomeCompleto: true, Email: true, IsInstrutor: true, IsAdmin: true, DataCadastro: true } as const;

@Injectable()
export class UsuariosService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria o administrador apenas se ele ainda não existir; nunca sobrescreve sua senha. */
  async onModuleInit() {
    const Senha = await bcrypt.hash('STARTREK', await bcrypt.genSalt());
    await this.prisma.usuario.upsert({
      where: { Email: 'admin@admin.com' },
      create: { NomeCompleto: 'Admin', Email: 'admin@admin.com', Senha, IsAdmin: true },
      update: { NomeCompleto: 'Admin', IsAdmin: true },
    });
  }

  async create(dto: CreateUsuarioDto) {
    const exists = await this.prisma.usuario.findUnique({ where: { Email: dto.Email } });
    if (exists) throw new ConflictException('E-mail já cadastrado.');
    const Senha = await bcrypt.hash(dto.Senha, await bcrypt.genSalt());
    return this.prisma.usuario.create({ data: { ...dto, Senha }, select: selectSafe });
  }

  findAll() { return this.prisma.usuario.findMany({ select: selectSafe }); }

  async findOne(id: number) {
    const user = await this.prisma.usuario.findUnique({ where: { ID_Usuario: id }, select: selectSafe });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  findByEmail(Email: string) { return this.prisma.usuario.findUnique({ where: { Email } }); }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.Senha) data.Senha = await bcrypt.hash(dto.Senha, await bcrypt.genSalt());
    return this.prisma.usuario.update({ where: { ID_Usuario: id }, data, select: selectSafe });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({ where: { ID_Usuario: id }, select: selectSafe });
  }
}
