import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { configureAccessToken, request } from '../../services/http';

export interface Usuario { id: number; nome: string; email: string; }

interface RespostaAuth {
  accessToken?: string;
  token?: string;
  access_token?: string;
  usuario?: { ID_Usuario: number; NomeCompleto: string; Email: string; IsAdmin?: boolean };
}

interface UserContextData {
  usuario: Usuario | null;
  cadastrar: (novo: { nome: string; email: string; senha: string }) => Promise<void>;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

function normalizarResposta(data: RespostaAuth): { token: string; usuario: Usuario } {
  const token = data.accessToken || data.token || data.access_token;
  const usuario = data.usuario;
  if (!token || !usuario) throw new Error('A API retornou uma sessão inválida.');
  if (usuario.IsAdmin) throw new Error('Contas administrativas devem acessar a plataforma pela versão web.');
  return { token, usuario: { id: usuario.ID_Usuario, nome: usuario.NomeCompleto, email: usuario.Email } };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const value = useMemo<UserContextData>(() => ({
    usuario,
    async cadastrar(novo) {
      const data = await request<RespostaAuth>('/auth/register', { method: 'POST', body: { NomeCompleto: novo.nome, Email: novo.email, Senha: novo.senha } });
      const sessao = normalizarResposta(data);
      configureAccessToken(sessao.token);
      setUsuario(sessao.usuario);
    },
    async entrar(email, senha) {
      const data = await request<RespostaAuth>('/auth/login', { method: 'POST', body: { Email: email, Senha: senha } });
      const sessao = normalizarResposta(data);
      configureAccessToken(sessao.token);
      setUsuario(sessao.usuario);
    },
    sair() {
      configureAccessToken(null);
      setUsuario(null);
    },
  }), [usuario]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextData {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser deve ser usado dentro de <UserProvider>.');
  return ctx;
}
