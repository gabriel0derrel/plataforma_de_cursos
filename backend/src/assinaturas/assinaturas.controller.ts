import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard';
import { AssinaturasService } from './assinaturas.service';

@ApiTags('assinaturas')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('assinaturas')
export class AssinaturasController {
  constructor(private readonly service: AssinaturasService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }
}
