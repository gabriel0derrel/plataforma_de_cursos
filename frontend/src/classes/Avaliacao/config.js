import { Star } from 'lucide-react';
import { Avaliacao } from './Avaliacao';
import { avaliacaoService } from './avaliacaoService';
export const avaliacaoConfig = {
  key: 'avaliacoes', route: '/avaliacoes', singular: 'Avaliacao', plural: 'Avaliacoes', icon: Star, Model: Avaliacao, service: avaliacaoService,
  columns: ['ID_Avaliacao', 'ID_Usuario', 'ID_Curso', 'Nota', 'Comentario', 'DataAvaliacao'],
  fields: [{ name: 'ID_Usuario', label: 'Usuario', reference: 'usuarios', required: true }, { name: 'ID_Curso', label: 'Curso', reference: 'cursos', required: true }, { name: 'Nota', label: 'Nota', type: 'number', min: 1, max: 5, required: true }, { name: 'Comentario', label: 'Comentario', type: 'textarea' }, { name: 'DataAvaliacao', label: 'Data da avaliacao', type: 'date', required: true }],
};
