import 'dotenv/config';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AdminGuard } from './admin.guard';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET não definida.');

@Global()
@Module({
  imports: [UsuariosModule, PassportModule, JwtModule.register({ secret, signOptions: { expiresIn: '1h' } })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AdminGuard],
  exports: [AdminGuard],
})
export class AuthModule {}
