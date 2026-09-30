import { EntityService } from '../shared/EntityService';
import { Assinatura } from './Assinatura';
export const assinaturaService = new EntityService('/assinaturas', Assinatura);
