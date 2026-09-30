import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService, private readonly usuarios: UsuariosService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  login(@Body() dto: LoginDto) { return this.auth.login(dto); }

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar usuário' })
  async register(@Body() dto: CreateUsuarioDto) {
    await this.usuarios.create(dto);
    return this.auth.login({ Email: dto.Email, Senha: dto.Senha });
  }
}
