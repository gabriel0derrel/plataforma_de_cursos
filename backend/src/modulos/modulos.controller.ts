import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@ApiTags('modulos')
@Controller('modulos')
export class ModulosController {
  constructor(private readonly service: ModulosService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) create(@Body() dto: CreateModuloDto) { return this.service.create(dto); }
  @Patch(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) update(@Param('id') id: string, @Body() dto: UpdateModuloDto) { return this.service.update(+id, dto); }
  @Delete(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) remove(@Param('id') id: string) { return this.service.remove(+id); }
}
