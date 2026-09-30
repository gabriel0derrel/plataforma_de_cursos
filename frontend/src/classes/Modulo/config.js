import { PanelsTopLeft } from 'lucide-react';
import { Modulo } from './Modulo';
import { moduloService } from './moduloService';
export const moduloConfig = {
  key: 'modulos', route: '/modulos', singular: 'Modulo', plural: 'Modulos', icon: PanelsTopLeft, Model: Modulo, service: moduloService,
  columns: ['ID_Modulo', 'Titulo', 'ID_Curso', 'Ordem'],
  fields: [{ name: 'Titulo', label: 'Titulo', type: 'text', required: true }, { name: 'ID_Curso', label: 'ID do curso', type: 'number', required: true }, { name: 'Ordem', label: 'Ordem', type: 'number', min: 1, required: true }],
};
