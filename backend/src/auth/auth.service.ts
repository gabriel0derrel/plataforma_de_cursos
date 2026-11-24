import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { NotificacoesService } from '../notificacoes/notificacoes.service';

@Injectable()
export class AuthService {
  constructor(private readonly usuarios: UsuariosService, private readonly jwt: JwtService, private readonly notificacoes: NotificacoesService) {}

  async register(dto: CreateUsuarioDto) {
    const usuario = await this.usuarios.create(dto);
    if (!usuario.IsAdmin) void this.notificacoes.publicar({ tipo: 'conta-criada', usuarioId: usuario.ID_Usuario, titulo: 'Conta criada', mensagem: `Bem-vindo à Trek HyperLessons, ${usuario.NomeCompleto}!` });
    return this.login({ Email: dto.Email, Senha: dto.Senha });
  }

  async login(dto: LoginDto) {
    const usuario = await this.usuarios.findByEmail(dto.Email);
    if (!usuario || !(await bcrypt.compare(dto.Senha, usuario.Senha))) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const accessToken = await this.jwt.signAsync({ sub: usuario.ID_Usuario, email: usuario.Email, isAdmin: usuario.IsAdmin });
    const safeUser = {
      ID_Usuario: usuario.ID_Usuario,
      NomeCompleto: usuario.NomeCompleto,
      Email: usuario.Email,
      IsInstrutor: usuario.IsInstrutor,
      IsAdmin: usuario.IsAdmin,
      DataCadastro: usuario.DataCadastro,
    };

    if (!safeUser.IsAdmin) void this.notificacoes.publicar({ tipo: 'login', usuarioId: safeUser.ID_Usuario, titulo: 'Login realizado', mensagem: 'Seu acesso à plataforma foi realizado com sucesso.' });
    // As duas chaves evitam adaptação no frontend já entregue.
    return { access_token: accessToken, accessToken, token: accessToken, usuario: safeUser };
  }
}
