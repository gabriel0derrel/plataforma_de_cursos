import { Controller, UseGuards, Post, Body, Patch, Param } from '@nestjs/common'; 
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 
import { AuthGuard } from '@nestjs/passport'; 
import { CrudController } from '../common/crud.controller'; 
import { MatriculasService } from './matriculas.service'; 
import { CreateMatriculaDto } from './dto/create-matricula.dto'; 
import { UpdateMatriculaDto } from './dto/update-matricula.dto'; 

@ApiTags('matriculas') 
@ApiBearerAuth('token') 
@UseGuards(AuthGuard('jwt')) 
@Controller('matriculas') 
export class MatriculasController extends CrudController<CreateMatriculaDto, UpdateMatriculaDto> { 
  constructor(service: MatriculasService) { 
    super(service); 
  } 

  // Sobrescrevemos o método de criação para forçar a tipagem do DTO
  @Post()
  async create(@Body() data: CreateMatriculaDto) {
    return super.create(data);
  }

  // É recomendável fazer o mesmo para o update, se você usar PATCH/PUT
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateMatriculaDto) {
    return super.update(id, data);
  }
}
