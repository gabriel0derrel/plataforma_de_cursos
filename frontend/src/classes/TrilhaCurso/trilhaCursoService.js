import { EntityService } from '../shared/EntityService';
import { TrilhaCurso } from './TrilhaCurso';
export const trilhaCursoService = new EntityService('/trilha-cursos', TrilhaCurso);
