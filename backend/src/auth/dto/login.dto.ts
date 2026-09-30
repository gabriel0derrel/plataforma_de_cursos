import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  Email!: string;

  @IsString()
  @IsNotEmpty()
  Senha!: string;
}
