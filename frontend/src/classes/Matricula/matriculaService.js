import { EntityService } from '../shared/EntityService';
import { Matricula } from './Matricula';
export const matriculaService = new EntityService('/matriculas', Matricula);
