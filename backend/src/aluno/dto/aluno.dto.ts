import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class MatricularDto { @Type(() => Number) @IsInt() ID_Curso!: number; }
export class ProgressoDto { @IsIn(['Concluida', 'Em andamento']) Status!: string; }
export class AvaliarDto { @Type(() => Number) @IsInt() ID_Curso!: number; @Type(() => Number) @IsInt() @Min(1) @Max(5) Nota!: number; @IsOptional() @IsString() Comentario?: string; }
export class CertificadoDto { @Type(() => Number) @IsInt() ID_Curso!: number; @IsOptional() @Type(() => Number) @IsInt() ID_Trilha?: number; }
export class AssinarDto { @Type(() => Number) @IsInt() ID_Plano!: number; }
export class PagamentoDto { @Type(() => Number) @IsInt() ID_Assinatura!: number; @Type(() => Number) @IsNumber() @Min(0) ValorPago!: number; @IsIn(['Cartao de credito', 'Pix', 'Boleto']) MetodoPagamento!: string; @IsString() Id_Transacao_Gateway!: string; }
export class AtualizarContaDto { @IsOptional() @IsString() NomeCompleto?: string; @IsOptional() @IsString() @MinLength(6) Senha?: string; }
