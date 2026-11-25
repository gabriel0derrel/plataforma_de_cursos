import { request } from '../../api';

export interface Matricula { ID_Matricula: number; ID_Curso: number; DataMatricula: string; DataConclusao: string | null; Curso: { Titulo: string; Nivel: string }; }
export interface Progresso { ID_Aula: number; ID_Modulo: number; ID_Curso: number; Curso: string; Modulo: string; Aula: string; Status: 'Concluida' | 'Em andamento'; DataConclusao: string | null; }
export interface Avaliacao { ID_Avaliacao: number; ID_Curso: number; Nota: number; Comentario: string | null; DataAvaliacao: string; Curso: { Titulo: string }; }
export interface Certificado { ID_Certificado: number; ID_Curso: number; CodigoVerificacao: string; DataEmissao: string; Curso: { Titulo: string }; }
export interface Assinatura { ID_Assinatura: number; ID_Plano: number; DataInicio: string; DataFim: string; Plano: { Nome: string; Preco: number }; }
export interface Pagamento { ID_Pagamento: number; ValorPago: number; MetodoPagamento: string; DataPagamento: string; Assinatura: { Plano: { Nome: string } }; }
export interface Conta { ID_Usuario: number; NomeCompleto: string; Email: string; }
export interface Categoria { ID_Categoria: number; Nome: string; Descricao: string | null; }
export interface Modulo { ID_Modulo: number; ID_Curso: number; Titulo: string; Ordem: number; }

export const alunoService = {
  conta: () => request<Conta>('/me/conta'),
  atualizarConta: (data: { NomeCompleto?: string; Senha?: string }) => request<Conta>('/me/conta', { method: 'PATCH', body: data }),
  matriculas: () => request<Matricula[]>('/me/matriculas'),
  matricular: (ID_Curso: number) => request('/me/matriculas', { method: 'POST', body: { ID_Curso } }),
  categorias: () => request<Categoria[]>('/categorias'),
  modulos: () => request<Modulo[]>('/modulos'),
  progresso: () => request<Progresso[]>('/me/progresso'),
  marcarProgresso: (ID_Aula: number, Status: Progresso['Status']) => request('/me/progresso/' + ID_Aula, { method: 'PATCH', body: { Status } }),
  avaliacoes: () => request<Avaliacao[]>('/me/avaliacoes'),
  avaliar: (data: { ID_Curso: number; Nota: number; Comentario?: string }) => request('/me/avaliacoes', { method: 'POST', body: data }),
  certificados: () => request<Certificado[]>('/me/certificados'),
  obterCertificado: (ID_Curso: number) => request('/me/certificados', { method: 'POST', body: { ID_Curso } }),
  assinaturas: () => request<Assinatura[]>('/me/assinaturas'),
  assinar: (ID_Plano: number) => request('/me/assinaturas', { method: 'POST', body: { ID_Plano } }),
  pagamentos: () => request<Pagamento[]>('/me/pagamentos'),
  pagar: (data: { ID_Assinatura: number; ValorPago: number; MetodoPagamento: string }) => request('/me/pagamentos', { method: 'POST', body: data }),
};
