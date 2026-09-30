import { EntityService } from '../shared/EntityService';
import { Avaliacao } from './Avaliacao';
export const avaliacaoService = new EntityService('/avaliacoes', Avaliacao);
