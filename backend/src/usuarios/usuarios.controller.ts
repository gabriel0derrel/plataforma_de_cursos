import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('usuarios')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}
  @Post() @UseGuards(AdminGuard) create(@Body() dto: CreateUsuarioDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Patch(':id') @UseGuards(AdminGuard) update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) { return this.service.update(+id, dto); }
  @Delete(':id') @UseGuards(AdminGuard) remove(@Param('id') id: string) { return this.service.remove(+id); }
}
