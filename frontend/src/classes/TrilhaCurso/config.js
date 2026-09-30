import { GitBranch } from 'lucide-react';
import { TrilhaCurso } from './TrilhaCurso';
import { trilhaCursoService } from './trilhaCursoService';
export const trilhaCursoConfig = {
  key: 'trilha-cursos', route: '/trilha-cursos', singular: 'Curso da trilha', plural: 'Cursos em trilhas', icon: GitBranch, Model: TrilhaCurso, service: trilhaCursoService,
  columns: ['ID_Trilha', 'ID_Curso', 'Ordem'],
  fields: [{ name: 'ID_Trilha', label: 'Trilha', reference: 'trilhas', required: true }, { name: 'ID_Curso', label: 'Curso', reference: 'cursos', required: true }, { name: 'Ordem', label: 'Ordem', type: 'number', min: 1, required: true }],
};
