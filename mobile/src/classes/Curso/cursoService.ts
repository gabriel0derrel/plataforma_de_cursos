import { request } from '../../services/http';
import type { Curso } from './Curso';

export const cursoService = {
  listar: () => request<Curso[]>('/cursos'),
};
