import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuarios: UsuariosService, private readonly jwt: JwtService) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarios.findByEmail(dto.Email);
    if (!usuario || !(await bcrypt.compare(dto.Senha, usuario.Senha))) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const accessToken = await this.jwt.signAsync({ sub: usuario.ID_Usuario, email: usuario.Email });
    const safeUser = {
      ID_Usuario: usuario.ID_Usuario,
      NomeCompleto: usuario.NomeCompleto,
      Email: usuario.Email,
      IsInstrutor: usuario.IsInstrutor,
      DataCadastro: usuario.DataCadastro,
    };

    // As duas chaves evitam adaptação no frontend já entregue.
    return { access_token: accessToken, accessToken, token: accessToken, usuario: safeUser };
  }
}
