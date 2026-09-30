import { EntityService } from '../shared/EntityService';
import { Categoria } from './Categoria';
export const categoriaService = new EntityService('/categorias', Categoria);
