import { createContext, useContext, useMemo, useState } from 'react';
import { configureAccessToken, request } from '../../services/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const value = useMemo(() => ({
    usuario,
    autenticado: Boolean(usuario),
    async entrar(credentials) {
      const response = await request('/auth/login', { method: 'POST', body: credentials });
      const data = response?.data || response;
      configureAccessToken(data?.token || data?.accessToken);
      setUsuario(data?.usuario || data?.user || { Email: credentials.Email });
    },
    async cadastrar(data) {
      const response = await request('/auth/register', { method: 'POST', body: data });
      const session = response?.data || response;
      const token = session?.token || session?.accessToken;

      if (token) {
        configureAccessToken(token);
        setUsuario(session?.usuario || session?.user || { Email: data.Email, NomeCompleto: data.NomeCompleto });
      }

      return Boolean(token);
    },
    sair() {
      configureAccessToken(null);
      setUsuario(null);
    },
  }), [usuario]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
