import { CircleCheckBig } from 'lucide-react';
import { ProgressoAula } from './ProgressoAula';
import { progressoAulaService } from './progressoAulaService';
export const progressoAulaConfig = {
  key: 'progresso', route: '/progresso', singular: 'Progresso de aula', plural: 'Progresso', icon: CircleCheckBig, Model: ProgressoAula, service: progressoAulaService,
  columns: ['ID_Usuario', 'ID_Aula', 'Status', 'DataConclusao'],
  fields: [{ name: 'ID_Usuario', label: 'Usuario', reference: 'usuarios', required: true }, { name: 'ID_Aula', label: 'Aula', reference: 'aulas', required: true }, { name: 'Status', label: 'Status', type: 'select', required: true, options: ['Concluida', 'Em andamento'] }, { name: 'DataConclusao', label: 'Data de conclusao', type: 'date' }],
};
