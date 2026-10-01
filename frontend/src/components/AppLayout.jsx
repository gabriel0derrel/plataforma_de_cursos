import { Award, BookOpenCheck, CheckCircle2, CreditCard, Home, LogIn, LogOut, Star, UserRound } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { classConfigs } from '../classes';
import { useAuth } from '../classes/Usuario/AuthContext';
import { Login } from '../classes/Usuario/Login';
import trekLogo from '../../img/trek.png';

export function AppLayout() {
  const { usuario, sair } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const userName = usuario?.NomeCompleto || usuario?.nome || 'Usuario';
  const userEmail = usuario?.Email || usuario?.email || '';
  const alunoMenus = [
    { route: '/minhas-matriculas', label: 'Meus cursos', icon: BookOpenCheck }, { route: '/meu-progresso', label: 'Progresso', icon: CheckCircle2 },
    { route: '/minhas-avaliacoes', label: 'Avaliações', icon: Star }, { route: '/meus-certificados', label: 'Certificados', icon: Award },
    { route: '/minhas-assinaturas', label: 'Assinaturas', icon: CreditCard }, { route: '/meus-pagamentos', label: 'Pagamentos', icon: CreditCard }, { route: '/minha-conta', label: 'Minha conta', icon: UserRound },
  ];

  return (
    <div className="app-shell">
      <header className="sidebar">
        <NavLink className="sidebar-brand" end to="/"><img className="brand-logo" src={trekLogo} alt="Logo Trek HyperLessons" /><span>Trek HyperLessons</span></NavLink>
        <nav aria-label="Navegacao principal">
          <NavLink end to="/"><Home size={18} /><span>Visao geral</span></NavLink>
          {classConfigs.filter((config) => config.public || usuario?.IsAdmin).map(({ route, plural, icon: Icon }) => <NavLink key={route} to={route}><Icon size={18} /><span>{plural}</span></NavLink>)}
          {usuario && !usuario.IsAdmin && alunoMenus.map(({ route, label, icon: Icon }) => <NavLink key={route} to={route}><Icon size={18} /><span>{label}</span></NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          {usuario ? <><div className="user-data"><span>{userName.slice(0, 1).toUpperCase()}</span><div><strong>{userName}{usuario.IsAdmin && ' (Admin)'}</strong><small>{userEmail}</small></div></div><button className="logout-button" type="button" onClick={sair}><LogOut size={18} />Sair</button></> : <button className="login-button" type="button" onClick={() => setLoginOpen(true)}><LogIn size={18} />Login</button>}
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      {loginOpen && <Login onClose={() => setLoginOpen(false)} />}
    </div>
  );
}
