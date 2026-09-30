import { Route } from 'lucide-react';
import { Trilha } from './Trilha';
import { trilhaService } from './trilhaService';
export const trilhaConfig = {
  key: 'trilhas', route: '/trilhas', singular: 'Trilha', plural: 'Trilhas', icon: Route, Model: Trilha, service: trilhaService,
  columns: ['ID_Trilha', 'Titulo', 'Descricao', 'ID_Categoria'],
  fields: [{ name: 'Titulo', label: 'Titulo', type: 'text', required: true }, { name: 'Descricao', label: 'Descricao', type: 'textarea', required: true }, { name: 'ID_Categoria', label: 'Categoria', reference: 'categorias' }],
};
