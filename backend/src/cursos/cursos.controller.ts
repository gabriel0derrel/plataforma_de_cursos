import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@ApiTags('cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly service: CursosService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) create(@Body() dto: CreateCursoDto) { return this.service.create(dto); }
  @Patch(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) update(@Param('id') id: string, @Body() dto: UpdateCursoDto) { return this.service.update(+id, dto); }
  @Delete(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) remove(@Param('id') id: string) { return this.service.remove(+id); }
}
