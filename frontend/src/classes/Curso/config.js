import { GraduationCap } from 'lucide-react';
import { Curso } from './Curso';
import { cursoService } from './cursoService';
export const cursoConfig = {
  key: 'cursos', route: '/cursos', singular: 'Curso', plural: 'Cursos', public: true, icon: GraduationCap, Model: Curso, service: cursoService,
  columns: ['ID_Curso', 'Titulo', 'Nivel', 'ID_Instrutor', 'ID_Categoria', 'DataPublicacao'],
  fields: [
    { name: 'Titulo', label: 'Titulo', type: 'text', required: true }, { name: 'Descricao', label: 'Descricao', type: 'textarea', required: true },
    { name: 'ID_Instrutor', label: 'Instrutor', reference: 'usuarios', referenceFilter: (user) => user.IsInstrutor, required: true }, { name: 'ID_Categoria', label: 'Categoria', reference: 'categorias', required: true },
    { name: 'Nivel', label: 'Nivel', type: 'select', required: true, options: ['Iniciante', 'Intermediario', 'Avancado'] }, { name: 'DataPublicacao', label: 'Data de publicacao', type: 'date', required: true },
    { name: 'TotalAulas', label: 'Total de aulas', type: 'number', min: 0 }, { name: 'TotalHoras', label: 'Total de horas', type: 'number', min: 0 },
  ],
};
