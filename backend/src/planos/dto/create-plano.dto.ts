import { Type } from 'class-transformer'; import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreatePlanoDto { @IsString() Nome!: string; @IsOptional() @IsString() Descricao?: string; @Type(() => Number) @IsNumber() @Min(0) Preco!: number; @Type(() => Number) @IsInt() @Min(1) DuracaoMeses!: number; }
