import { Type } from 'class-transformer'; import { IsInt, IsOptional, IsString } from 'class-validator';
export class CreateTrilhaDto { @IsString() Titulo!: string; @IsString() Descricao!: string; @IsOptional() @Type(() => Number) @IsInt() ID_Categoria?: number | null; }
