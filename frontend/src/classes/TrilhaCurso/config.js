import { GitBranch } from 'lucide-react';
import { TrilhaCurso } from './TrilhaCurso';
import { trilhaCursoService } from './trilhaCursoService';
export const trilhaCursoConfig = {
  key: 'trilha-cursos', route: '/trilha-cursos', singular: 'Curso da trilha', plural: 'Cursos em trilhas', icon: GitBranch, Model: TrilhaCurso, service: trilhaCursoService,
  columns: ['ID_Trilha', 'ID_Curso', 'Ordem'],
  fields: [{ name: 'ID_Trilha', label: 'ID da trilha', type: 'number', required: true }, { name: 'ID_Curso', label: 'ID do curso', type: 'number', required: true }, { name: 'Ordem', label: 'Ordem', type: 'number', min: 1, required: true }],
};
