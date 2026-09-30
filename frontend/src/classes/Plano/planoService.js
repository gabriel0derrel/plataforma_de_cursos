import { EntityService } from '../shared/EntityService';
import { Plano } from './Plano';
export const planoService = new EntityService('/planos', Plano);
