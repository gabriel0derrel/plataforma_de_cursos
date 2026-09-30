import { PlaySquare } from 'lucide-react';
import { Aula } from './Aula';
import { aulaService } from './aulaService';
export const aulaConfig = {
  key: 'aulas', route: '/aulas', singular: 'Aula', plural: 'Aulas', icon: PlaySquare, Model: Aula, service: aulaService,
  columns: ['ID_Aula', 'Titulo', 'TipoConteudo', 'ID_Modulo', 'DuracaoMinutos', 'Ordem'],
  fields: [
    { name: 'Titulo', label: 'Titulo', type: 'text', required: true }, { name: 'ID_Modulo', label: 'Modulo', reference: 'modulos', required: true },
    { name: 'TipoConteudo', label: 'Tipo de conteudo', type: 'select', required: true, options: ['Video', 'Texto', 'Documento', 'Link'] },
    { name: 'URL_Conteudo', label: 'URL do conteudo', type: 'url' }, { name: 'DuracaoMinutos', label: 'Duracao em minutos', type: 'number', min: 1, required: true }, { name: 'Ordem', label: 'Ordem', type: 'number', min: 1, required: true },
  ],
};
