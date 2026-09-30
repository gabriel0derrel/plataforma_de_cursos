import { Injectable } from '@nestjs/common'; import { CrudService } from '../common/crud.service'; import { PrismaService } from '../prisma/prisma.service';
@Injectable() export class CategoriasService extends CrudService { constructor(prisma: PrismaService) { super(prisma, 'categoria', 'ID_Categoria'); } }
