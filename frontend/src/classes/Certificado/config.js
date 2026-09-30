import { Award } from 'lucide-react';
import { Certificado } from './Certificado';
import { certificadoService } from './certificadoService';
export const certificadoConfig = {
  key: 'certificados', route: '/certificados', singular: 'Certificado', plural: 'Certificados', icon: Award, Model: Certificado, service: certificadoService,
  columns: ['ID_Certificado', 'ID_Usuario', 'ID_Curso', 'CodigoVerificacao', 'DataEmissao'],
  fields: [{ name: 'ID_Usuario', label: 'ID do usuario', type: 'number', required: true }, { name: 'ID_Curso', label: 'ID do curso', type: 'number', required: true }, { name: 'ID_Trilha', label: 'ID da trilha', type: 'number' }, { name: 'CodigoVerificacao', label: 'Codigo de verificacao', type: 'text', required: true }, { name: 'DataEmissao', label: 'Data de emissao', type: 'date', required: true }],
};
