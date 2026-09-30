import { ClipboardCheck } from 'lucide-react';
import { Matricula } from './Matricula';
import { matriculaService } from './matriculaService';
export const matriculaConfig = {
  key: 'matriculas', route: '/matriculas', singular: 'Matricula', plural: 'Matriculas', icon: ClipboardCheck, Model: Matricula, service: matriculaService,
  columns: ['ID_Matricula', 'ID_Usuario', 'ID_Curso', 'DataMatricula', 'DataConclusao'],
  fields: [{ name: 'ID_Usuario', label: 'Usuario', reference: 'usuarios', required: true }, { name: 'ID_Curso', label: 'Curso', reference: 'cursos', required: true }, { name: 'DataMatricula', label: 'Data da matricula', type: 'date', required: true }],
};
