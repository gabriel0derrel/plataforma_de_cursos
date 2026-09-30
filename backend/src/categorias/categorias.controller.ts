import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@ApiTags('categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) create(@Body() dto: CreateCategoriaDto) { return this.service.create(dto); }
  @Patch(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) { return this.service.update(+id, dto); }
  @Delete(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) remove(@Param('id') id: string) { return this.service.remove(+id); }
}
