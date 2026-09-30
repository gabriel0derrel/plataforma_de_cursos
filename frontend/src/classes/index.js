import { aulaConfig } from './Aula/config';
import { assinaturaConfig } from './Assinatura/config';
import { avaliacaoConfig } from './Avaliacao/config';
import { categoriaConfig } from './Categoria/config';
import { certificadoConfig } from './Certificado/config';
import { cursoConfig } from './Curso/config';
import { matriculaConfig } from './Matricula/config';
import { moduloConfig } from './Modulo/config';
import { pagamentoConfig } from './Pagamento/config';
import { planoConfig } from './Plano/config';
import { progressoAulaConfig } from './ProgressoAula/config';
import { trilhaConfig } from './Trilha/config';
import { trilhaCursoConfig } from './TrilhaCurso/config';
import { usuarioConfig } from './Usuario/config';

export const classConfigs = [
  usuarioConfig, categoriaConfig, cursoConfig, moduloConfig, aulaConfig, matriculaConfig,
  progressoAulaConfig, avaliacaoConfig, trilhaConfig, trilhaCursoConfig, certificadoConfig,
  planoConfig, assinaturaConfig, pagamentoConfig,
];

export const configByRoute = Object.fromEntries(classConfigs.map((config) => [config.route, config]));
