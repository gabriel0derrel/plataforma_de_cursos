import { Body, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CrudService } from './crud.service';

/** Base de endpoints; cada recurso declara seu controller, rota e DTO próprios. */
export abstract class CrudController<TCreate extends object, TUpdate extends object> {
  protected constructor(protected readonly service: CrudService) {}
  @Post() create(@Body() dto: TCreate) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(Number(id)); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: TUpdate) { return this.service.update(Number(id), dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(Number(id)); }
}
