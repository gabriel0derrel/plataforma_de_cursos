import { Tags } from 'lucide-react';
import { Categoria } from './Categoria';
import { categoriaService } from './categoriaService';
export const categoriaConfig = {
  key: 'categorias', route: '/categorias', singular: 'Categoria', plural: 'Categorias', public: true, icon: Tags, Model: Categoria, service: categoriaService,
  columns: ['ID_Categoria', 'Nome', 'Descricao'],
  fields: [{ name: 'Nome', label: 'Nome', type: 'text', required: true }, { name: 'Descricao', label: 'Descricao', type: 'textarea' }],
};
