import { request } from '../../services/http';

export const alunoService = {
  conta: () => request('/me/conta'),
  atualizarConta: (data) => request('/me/conta', { method: 'PATCH', body: data }),
  matriculas: () => request('/me/matriculas'),
  matricular: (ID_Curso) => request('/me/matriculas', { method: 'POST', body: { ID_Curso: Number(ID_Curso) } }),
  progresso: () => request('/me/progresso'),
  marcarProgresso: (ID_Aula, Status) => request('/me/progresso/' + ID_Aula, { method: 'PATCH', body: { Status } }),
  avaliacoes: () => request('/me/avaliacoes'),
  avaliar: (data) => request('/me/avaliacoes', { method: 'POST', body: { ...data, ID_Curso: Number(data.ID_Curso), Nota: Number(data.Nota) } }),
  certificados: () => request('/me/certificados'),
  obterCertificado: (ID_Curso) => request('/me/certificados', { method: 'POST', body: { ID_Curso: Number(ID_Curso) } }),
  assinaturas: () => request('/me/assinaturas'),
  assinar: (ID_Plano) => request('/me/assinaturas', { method: 'POST', body: { ID_Plano: Number(ID_Plano) } }),
  pagamentos: () => request('/me/pagamentos'),
  pagar: (data) => request('/me/pagamentos', { method: 'POST', body: { ...data, ID_Assinatura: Number(data.ID_Assinatura), ValorPago: Number(data.ValorPago) } }),
  atualizarPagamento: (id, data) => request('/me/pagamentos/' + id, { method: 'PATCH', body: data }),
};
