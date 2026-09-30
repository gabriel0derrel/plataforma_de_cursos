import { EntityService } from '../shared/EntityService';
import { Curso } from './Curso';
export const cursoService = new EntityService('/cursos', Curso);
