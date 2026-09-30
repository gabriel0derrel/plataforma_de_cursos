import { useEffect, useState } from 'react';
import { BookOpenCheck, LockKeyhole, LogIn, Mail, X } from 'lucide-react';
import { useAuth } from './AuthContext';

export function Login({ onClose }) {
  const { entrar, cadastrar } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ Email: '', Senha: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'cadastro') {
        if (form.Senha !== form.ConfirmacaoSenha) throw new Error('As senhas precisam ser iguais.');
        if (form.Senha.length < 6) throw new Error('A senha deve ter ao menos 6 caracteres.');

        const loggedIn = await cadastrar({
          NomeCompleto: form.NomeCompleto,
          Email: form.Email,
          Senha: form.Senha,
        });

        if (loggedIn) {
          onClose();
        } else {
          setMode('login');
          setNotice('Cadastro criado. Entre com suas credenciais.');
        }
      } else {
        await entrar({ Email: form.Email, Senha: form.Senha });
        onClose();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  return (
    <div className="login-overlay" role="presentation" onMouseDown={onClose}>
      <section className="login-card" role="dialog" aria-modal="true" aria-labelledby="login-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="login-card-header">
          <div className="brand-mark small"><BookOpenCheck size={20} /></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar login" title="Fechar"><X size={18} /></button>
        </header>
        <form className="login-form" onSubmit={submit}>
          <div><p className="eyebrow">Trek HyperLessons</p><h2 id="login-title">{mode === 'login' ? 'Entre na plataforma' : 'Crie sua conta'}</h2></div>
          {error && <p className="form-error" role="alert">{error}</p>}
          {notice && <p className="success-message">{notice}</p>}
          {mode === 'cadastro' && <label className="field"><span>Nome completo</span><input type="text" value={form.NomeCompleto || ''} onChange={(event) => setForm({ ...form, NomeCompleto: event.target.value })} autoComplete="name" required /></label>}
          <label className="field"><span>E-mail</span><div className="input-with-icon"><Mail size={18} /><input type="email" value={form.Email} onChange={(event) => setForm({ ...form, Email: event.target.value })} autoComplete="email" required /></div></label>
          <label className="field"><span>Senha</span><div className="input-with-icon"><LockKeyhole size={18} /><input type="password" value={form.Senha} onChange={(event) => setForm({ ...form, Senha: event.target.value })} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></div></label>
          {mode === 'cadastro' && <label className="field"><span>Confirmar senha</span><div className="input-with-icon"><LockKeyhole size={18} /><input type="password" value={form.ConfirmacaoSenha || ''} onChange={(event) => setForm({ ...form, ConfirmacaoSenha: event.target.value })} autoComplete="new-password" required /></div></label>}
          <button className="button primary full-width" type="submit" disabled={loading}><LogIn size={18} />{loading ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
          <p className="auth-mode-switch">{mode === 'login' ? 'Ainda nao possui uma conta?' : 'Ja possui uma conta?'} <button type="button" onClick={() => changeMode(mode === 'login' ? 'cadastro' : 'login')}>{mode === 'login' ? 'Cadastre-se' : 'Entrar'}</button></p>
        </form>
      </section>
    </div>
  );
}
