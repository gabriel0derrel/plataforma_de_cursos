import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator'; import { Transform } from 'class-transformer';
export class CreateUsuarioDto { @IsString() NomeCompleto!: string; @IsEmail() Email!: string; @IsString() @MinLength(6) Senha!: string; @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() IsInstrutor?: boolean; }
