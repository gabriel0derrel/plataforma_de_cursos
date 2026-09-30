import { CalendarClock } from 'lucide-react';
import { Assinatura } from './Assinatura';
import { assinaturaService } from './assinaturaService';
export const assinaturaConfig = {
  key: 'assinaturas', route: '/assinaturas', singular: 'Assinatura', plural: 'Assinaturas', icon: CalendarClock, Model: Assinatura, service: assinaturaService,
  columns: ['ID_Assinatura', 'ID_Usuario', 'ID_Plano', 'DataInicio', 'DataFim'],
  fields: [{ name: 'ID_Usuario', label: 'Usuario', reference: 'usuarios', required: true }, { name: 'ID_Plano', label: 'Plano', reference: 'planos', required: true }, { name: 'DataInicio', label: 'Data de inicio', type: 'date', required: true }, { name: 'DataFim', label: 'Data de termino', type: 'date', required: true }],
};
