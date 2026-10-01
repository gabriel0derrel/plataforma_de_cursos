import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarContaDto, AssinarDto, AvaliarDto, CertificadoDto, MatricularDto, PagamentoDto, ProgressoDto } from './dto/aluno.dto';

@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) {}

  conta(userId: number) { return this.prisma.usuario.findUniqueOrThrow({ where: { ID_Usuario: userId }, select: { ID_Usuario: true, NomeCompleto: true, Email: true, IsInstrutor: true, DataCadastro: true } }); }
  async atualizarConta(userId: number, dto: AtualizarContaDto) {
    const data: Record<string, unknown> = { ...dto };
    if (dto.Senha) data.Senha = await bcrypt.hash(dto.Senha, await bcrypt.genSalt());
    return this.prisma.usuario.update({ where: { ID_Usuario: userId }, data, select: { ID_Usuario: true, NomeCompleto: true, Email: true, IsInstrutor: true, DataCadastro: true } });
  }

  matriculas(userId: number) { return this.prisma.matricula.findMany({ where: { ID_Usuario: userId }, include: { Curso: { select: { Titulo: true, Nivel: true } } }, orderBy: { DataMatricula: 'desc' } }); }
  async matricular(userId: number, dto: MatricularDto) {
    const curso = await this.prisma.curso.findUnique({ where: { ID_Curso: dto.ID_Curso } });
    if (!curso) throw new NotFoundException('Curso não encontrado.');
    try { return await this.prisma.matricula.create({ data: { ID_Usuario: userId, ID_Curso: dto.ID_Curso, DataMatricula: new Date() } }); }
    catch { throw new ConflictException('Você já está matriculado neste curso.'); }
  }

  async progresso(userId: number) {
    const matriculas = await this.prisma.matricula.findMany({ where: { ID_Usuario: userId }, select: { ID_Curso: true } });
    const aulas = await this.prisma.aula.findMany({ where: { Modulo: { ID_Curso: { in: matriculas.map((m) => m.ID_Curso) } } }, include: { Modulo: { include: { Curso: { select: { Titulo: true } } } } }, orderBy: [{ ID_Modulo: 'asc' }, { Ordem: 'asc' }] });
    const registros = await this.prisma.progressoAula.findMany({ where: { ID_Usuario: userId } });
    const porAula = new Map(registros.map((registro) => [registro.ID_Aula, registro]));
    return aulas.map((aula) => ({ ID_Aula: aula.ID_Aula, Curso: aula.Modulo.Curso.Titulo, Modulo: aula.Modulo.Titulo, Aula: aula.Titulo, Status: porAula.get(aula.ID_Aula)?.Status || 'Em andamento', DataConclusao: porAula.get(aula.ID_Aula)?.DataConclusao || null }));
  }

  async marcarProgresso(userId: number, aulaId: number, dto: ProgressoDto) {
    const aula = await this.prisma.aula.findUnique({ where: { ID_Aula: aulaId }, include: { Modulo: true } });
    if (!aula) throw new NotFoundException('Aula não encontrada.');
    const matricula = await this.prisma.matricula.findUnique({ where: { ID_Usuario_ID_Curso: { ID_Usuario: userId, ID_Curso: aula.Modulo.ID_Curso } } });
    if (!matricula) throw new ForbiddenException('Você não está matriculado neste curso.');
    await this.prisma.progressoAula.upsert({ where: { ID_Usuario_ID_Aula: { ID_Usuario: userId, ID_Aula: aulaId } }, create: { ID_Usuario: userId, ID_Aula: aulaId, Status: dto.Status, DataConclusao: dto.Status === 'Concluida' ? new Date() : null }, update: { Status: dto.Status, DataConclusao: dto.Status === 'Concluida' ? new Date() : null } });
    await this.atualizarConclusao(userId, aula.Modulo.ID_Curso);
    return { mensagem: 'Progresso atualizado.' };
  }

  private async atualizarConclusao(userId: number, cursoId: number) {
    const total = await this.prisma.aula.count({ where: { Modulo: { ID_Curso: cursoId } } });
    const concluidas = await this.prisma.progressoAula.count({ where: { ID_Usuario: userId, Status: 'Concluida', Aula: { Modulo: { ID_Curso: cursoId } } } });
    await this.prisma.matricula.update({ where: { ID_Usuario_ID_Curso: { ID_Usuario: userId, ID_Curso: cursoId } }, data: { DataConclusao: total > 0 && total === concluidas ? new Date() : null } });
  }

  private async exigirConclusao(userId: number, cursoId: number) {
    const matricula = await this.prisma.matricula.findUnique({ where: { ID_Usuario_ID_Curso: { ID_Usuario: userId, ID_Curso: cursoId } } });
    if (!matricula?.DataConclusao) throw new BadRequestException('Este curso só pode ser avaliado ou certificado após todas as aulas serem vistas.');
  }

  avaliacoes(userId: number) { return this.prisma.avaliacao.findMany({ where: { ID_Usuario: userId }, include: { Curso: { select: { Titulo: true } } }, orderBy: { DataAvaliacao: 'desc' } }); }
  async avaliar(userId: number, dto: AvaliarDto) { await this.exigirConclusao(userId, dto.ID_Curso); return this.prisma.avaliacao.upsert({ where: { ID_Usuario_ID_Curso: { ID_Usuario: userId, ID_Curso: dto.ID_Curso } }, create: { ...dto, ID_Usuario: userId, DataAvaliacao: new Date() }, update: { Nota: dto.Nota, Comentario: dto.Comentario, DataAvaliacao: new Date() } }); }

  certificados(userId: number) { return this.prisma.certificado.findMany({ where: { ID_Usuario: userId }, include: { Curso: { select: { Titulo: true } } }, orderBy: { DataEmissao: 'desc' } }); }
  async obterCertificado(userId: number, dto: CertificadoDto) { await this.exigirConclusao(userId, dto.ID_Curso); const existente = await this.prisma.certificado.findFirst({ where: { ID_Usuario: userId, ID_Curso: dto.ID_Curso } }); if (existente) return existente; return this.prisma.certificado.create({ data: { ID_Usuario: userId, ID_Curso: dto.ID_Curso, ID_Trilha: dto.ID_Trilha, CodigoVerificacao: randomUUID(), DataEmissao: new Date() } }); }

  assinaturas(userId: number) { return this.prisma.assinatura.findMany({ where: { ID_Usuario: userId }, include: { Plano: { select: { Nome: true, Preco: true } } }, orderBy: { DataInicio: 'desc' } }); }
  async assinar(userId: number, dto: AssinarDto) { const plano = await this.prisma.plano.findUnique({ where: { ID_Plano: dto.ID_Plano } }); if (!plano) throw new NotFoundException('Plano não encontrado.'); const DataInicio = new Date(); const DataFim = new Date(DataInicio); DataFim.setMonth(DataFim.getMonth() + plano.DuracaoMeses); return this.prisma.assinatura.create({ data: { ID_Usuario: userId, ID_Plano: dto.ID_Plano, DataInicio, DataFim } }); }

  pagamentos(userId: number) { return this.prisma.pagamento.findMany({ where: { Assinatura: { ID_Usuario: userId } }, include: { Assinatura: { include: { Plano: { select: { Nome: true } } } } }, orderBy: { DataPagamento: 'desc' } }); }
  async pagar(userId: number, dto: PagamentoDto) { await this.exigirAssinatura(userId, dto.ID_Assinatura); return this.prisma.pagamento.create({ data: { ...dto, DataPagamento: new Date() } }); }
  async atualizarPagamento(userId: number, pagamentoId: number, dto: Partial<PagamentoDto>) { const pagamento = await this.prisma.pagamento.findUnique({ where: { ID_Pagamento: pagamentoId } }); if (!pagamento) throw new NotFoundException('Pagamento não encontrado.'); await this.exigirAssinatura(userId, pagamento.ID_Assinatura); const { ID_Assinatura, ...data } = dto; return this.prisma.pagamento.update({ where: { ID_Pagamento: pagamentoId }, data }); }
  private async exigirAssinatura(userId: number, assinaturaId: number) { const assinatura = await this.prisma.assinatura.findFirst({ where: { ID_Assinatura: assinaturaId, ID_Usuario: userId } }); if (!assinatura) throw new ForbiddenException('Esta assinatura não pertence ao usuário autenticado.'); }
}
