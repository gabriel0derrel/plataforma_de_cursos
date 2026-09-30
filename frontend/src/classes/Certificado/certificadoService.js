import { EntityService } from '../shared/EntityService';
import { Certificado } from './Certificado';
export const certificadoService = new EntityService('/certificados', Certificado);
