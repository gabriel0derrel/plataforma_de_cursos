import { EntityService } from '../shared/EntityService';
import { Trilha } from './Trilha';
export const trilhaService = new EntityService('/trilhas', Trilha);
