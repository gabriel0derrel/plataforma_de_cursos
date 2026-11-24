import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificacoesService } from './notificacoes.service';

type RequestUser = { user: { userId: number } };

@ApiTags('notificacoes-mobile')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('me/notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoes: NotificacoesService) {}

  @Get() listar(@Req() req: RequestUser) { return this.notificacoes.listarParaUsuario(req.user.userId); }
  @Patch(':id/lida') marcarComoLida(@Req() req: RequestUser, @Param('id') id: string) { return this.notificacoes.marcarComoLida(req.user.userId, +id); }
}
