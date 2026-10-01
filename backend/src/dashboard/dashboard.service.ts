import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /** Indicadores públicos sem expor dados individuais de usuários ou pagamentos. */
  async resumo() {
    const [usuarios, cursos, matriculas, pagamentos] = await Promise.all([
      this.prisma.usuario.count(),
      this.prisma.curso.count(),
      this.prisma.matricula.count(),
      this.prisma.pagamento.aggregate({ _sum: { ValorPago: true } }),
    ]);
    return { usuarios, cursos, matriculas, receita: Number(pagamentos._sum.ValorPago ?? 0) };
  }
}
