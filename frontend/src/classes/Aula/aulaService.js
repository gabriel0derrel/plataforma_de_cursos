import { EntityService } from '../shared/EntityService';
import { Aula } from './Aula';
export const aulaService = new EntityService('/aulas', Aula);
