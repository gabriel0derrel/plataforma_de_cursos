import { EntityService } from '../shared/EntityService';
import { Modulo } from './Modulo';
export const moduloService = new EntityService('/modulos', Modulo);
