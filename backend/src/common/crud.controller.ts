import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { CrudService } from './crud.service';

/** Base de endpoints; cada recurso declara seu controller, rota e DTO próprios. */
export abstract class CrudController<TCreate extends object, TUpdate extends object> {
  protected constructor(protected readonly service: CrudService) {}
  @Post() @UseGuards(AuthGuard('jwt'), AdminGuard) create(@Body() dto: TCreate) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Patch(':id') @UseGuards(AuthGuard('jwt'), AdminGuard) update(@Param('id') id: string, @Body() dto: TUpdate) { return this.service.update(Number(id), dto); }
  @Delete(':id') @UseGuards(AuthGuard('jwt'), AdminGuard) remove(@Param('id') id: string) { return this.service.remove(Number(id)); }
}
