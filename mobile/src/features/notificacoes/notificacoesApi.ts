import { request } from '../../api';

export interface NotificacaoMobile {
  ID_Notificacao: number;
  Tipo: string;
  Titulo: string;
  Mensagem: string;
  Lida: boolean;
  DataCriacao: string;
}

export const notificacoesApi = {
  listar: () => request<NotificacaoMobile[]>('/me/notificacoes'),
  marcarComoLida: (notificacaoId: number) => request<{ atualizada: boolean }>(`/me/notificacoes/${notificacaoId}/lida`, { method: 'PATCH' }),
};
