import { EntityService } from '../shared/EntityService';
import { Usuario } from './Usuario';

export const usuarioService = new EntityService('/usuarios', Usuario);
