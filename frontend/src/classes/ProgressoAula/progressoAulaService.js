import { EntityService } from '../shared/EntityService';
import { ProgressoAula } from './ProgressoAula';
export const progressoAulaService = new EntityService('/progresso-aulas', ProgressoAula);
