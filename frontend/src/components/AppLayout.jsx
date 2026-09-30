import { BookOpenCheck, Home, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { classConfigs } from '../classes';
import { useAuth } from '../classes/Usuario/AuthContext';
import { Login } from '../classes/Usuario/Login';

export function AppLayout() {
  const { usuario, sair } = useAuth();
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const userName = usuario?.NomeCompleto || usuario?.nome || 'Usuario';
  const userEmail = usuario?.Email || usuario?.email || '';

  return (
    <div className="app-shell">
      <aside className={'sidebar' + (open ? ' open' : '')}>
        <div className="sidebar-brand"><span className="brand-mark small"><BookOpenCheck size={20} /></span><span>Trek HyperLessons</span></div>
        <nav aria-label="Navegacao principal">
          <NavLink end to="/" onClick={() => setOpen(false)}><Home size={18} /><span>Visao geral</span></NavLink>
          {classConfigs.filter((config) => usuario || config.public).map(({ route, plural, icon: Icon }) => <NavLink key={route} to={route} onClick={() => setOpen(false)}><Icon size={18} /><span>{plural}</span></NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          {usuario ? <><div className="user-data"><span>{userName.slice(0, 1).toUpperCase()}</span><div><strong>{userName}{usuario.IsAdmin && ' (Admin)'}</strong><small>{userEmail}</small></div></div><button className="logout-button" type="button" onClick={sair}><LogOut size={18} />Sair</button></> : <button className="login-button" type="button" onClick={() => { setOpen(false); setLoginOpen(true); }}><LogIn size={18} />Login</button>}
        </div>
      </aside>
      <div className="mobile-bar"><span>Trek HyperLessons</span><div>{!usuario && <button className="mobile-login-button" type="button" onClick={() => setLoginOpen(true)}>Login</button>}<button className="icon-button" type="button" onClick={() => setOpen((current) => !current)} aria-label="Alternar menu" title="Alternar menu">{open ? <X size={20} /> : <Menu size={20} />}</button></div></div>
      <main className="main-content"><Outlet /></main>
      {loginOpen && <Login onClose={() => setLoginOpen(false)} />}
    </div>
  );
}
