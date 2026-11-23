import { request } from '../../services/http';

export interface Plano { ID_Plano: number; Nome: string; Descricao: string | null; Preco: number; DuracaoMeses: number; }

export const planoService = { listar: () => request<Plano[]>('/planos') };
