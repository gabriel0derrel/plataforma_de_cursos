import { request } from '../../api';
import type { Curso } from './Curso';

export const cursoService = {
  listar: () => request<Curso[]>('/cursos'),
};
