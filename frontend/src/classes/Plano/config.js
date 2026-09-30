import { BadgeDollarSign } from 'lucide-react';
import { Plano } from './Plano';
import { planoService } from './planoService';
export const planoConfig = {
  key: 'planos', route: '/planos', singular: 'Plano', plural: 'Planos', icon: BadgeDollarSign, Model: Plano, service: planoService,
  columns: ['ID_Plano', 'Nome', 'Descricao', 'Preco', 'DuracaoMeses'],
  fields: [{ name: 'Nome', label: 'Nome', type: 'text', required: true }, { name: 'Descricao', label: 'Descricao', type: 'textarea' }, { name: 'Preco', label: 'Preco', type: 'number', min: 0, step: '0.01', required: true }, { name: 'DuracaoMeses', label: 'Duracao em meses', type: 'number', min: 1, required: true }],
};
