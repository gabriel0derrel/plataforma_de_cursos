import { UserRound } from 'lucide-react';
import { Usuario } from './Usuario';
import { usuarioService } from './usuarioService';

export const usuarioConfig = {
  key: 'usuarios', route: '/usuarios', singular: 'Usuario', plural: 'Usuarios', endpoint: '/usuarios',
  icon: UserRound, Model: Usuario, service: usuarioService,
  columns: ['ID_Usuario', 'NomeCompleto', 'Email', 'IsInstrutor', 'DataCadastro'],
  fields: [
    { name: 'NomeCompleto', label: 'Nome completo', type: 'text', required: true },
    { name: 'Email', label: 'E-mail', type: 'email', required: true },
    { name: 'Senha', label: 'Senha', type: 'password', required: true },
    { name: 'IsInstrutor', label: 'Instrutor', type: 'checkbox' },
  ],
};
