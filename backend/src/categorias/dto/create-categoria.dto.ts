import { IsOptional, IsString } from 'class-validator';
export class CreateCategoriaDto { @IsString() Nome!: string; @IsOptional() @IsString() Descricao?: string; }
