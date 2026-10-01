import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AlunoService } from './aluno.service';
import { AtualizarContaDto, AssinarDto, AvaliarDto, CertificadoDto, MatricularDto, PagamentoDto, ProgressoDto } from './dto/aluno.dto';

type RequestUser = { user: { userId: number } };

@ApiTags('minha-conta')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('me')
export class AlunoController {
  constructor(private readonly aluno: AlunoService) {}
  @Get('conta') conta(@Req() req: RequestUser) { return this.aluno.conta(req.user.userId); }
  @Patch('conta') atualizarConta(@Req() req: RequestUser, @Body() dto: AtualizarContaDto) { return this.aluno.atualizarConta(req.user.userId, dto); }
  @Get('matriculas') matriculas(@Req() req: RequestUser) { return this.aluno.matriculas(req.user.userId); }
  @Post('matriculas') matricular(@Req() req: RequestUser, @Body() dto: MatricularDto) { return this.aluno.matricular(req.user.userId, dto); }
  @Get('progresso') progresso(@Req() req: RequestUser) { return this.aluno.progresso(req.user.userId); }
  @Patch('progresso/:aulaId') marcarProgresso(@Req() req: RequestUser, @Param('aulaId') aulaId: string, @Body() dto: ProgressoDto) { return this.aluno.marcarProgresso(req.user.userId, +aulaId, dto); }
  @Get('avaliacoes') avaliacoes(@Req() req: RequestUser) { return this.aluno.avaliacoes(req.user.userId); }
  @Post('avaliacoes') avaliar(@Req() req: RequestUser, @Body() dto: AvaliarDto) { return this.aluno.avaliar(req.user.userId, dto); }
  @Get('certificados') certificados(@Req() req: RequestUser) { return this.aluno.certificados(req.user.userId); }
  @Post('certificados') certificado(@Req() req: RequestUser, @Body() dto: CertificadoDto) { return this.aluno.obterCertificado(req.user.userId, dto); }
  @Get('assinaturas') assinaturas(@Req() req: RequestUser) { return this.aluno.assinaturas(req.user.userId); }
  @Post('assinaturas') assinar(@Req() req: RequestUser, @Body() dto: AssinarDto) { return this.aluno.assinar(req.user.userId, dto); }
  @Get('pagamentos') pagamentos(@Req() req: RequestUser) { return this.aluno.pagamentos(req.user.userId); }
  @Post('pagamentos') pagar(@Req() req: RequestUser, @Body() dto: PagamentoDto) { return this.aluno.pagar(req.user.userId, dto); }
  @Patch('pagamentos/:pagamentoId') atualizarPagamento(@Req() req: RequestUser, @Param('pagamentoId') pagamentoId: string, @Body() dto: Partial<PagamentoDto>) { return this.aluno.atualizarPagamento(req.user.userId, +pagamentoId, dto); }
}
