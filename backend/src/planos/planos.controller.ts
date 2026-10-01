import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@ApiTags('planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly service: PlanosService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) create(@Body() dto: CreatePlanoDto) { return this.service.create(dto); }
  @Patch(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) update(@Param('id') id: string, @Body() dto: UpdatePlanoDto) { return this.service.update(+id, dto); }
  @Delete(':id') @ApiBearerAuth('token') @UseGuards(AuthGuard('jwt'), AdminGuard) remove(@Param('id') id: string) { return this.service.remove(+id); }
}
