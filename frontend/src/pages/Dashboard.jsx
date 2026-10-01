import { BookOpen, CircleDollarSign, ClipboardCheck, GraduationCap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { request } from '../services/http';
import { formatCurrency } from '../utils/formatters';

export function Dashboard() {
  const [data, setData] = useState({ usuarios: 0, cursos: 0, matriculas: 0, receita: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try { setData(await request('/dashboard/resumo')); }
      catch { setError('Nao foi possivel carregar os indicadores.'); }
    }
    load();
  }, []);

  const metrics = [
    { label: 'Usuarios', value: data.usuarios, icon: Users, tone: 'mint' },
    { label: 'Cursos', value: data.cursos, icon: GraduationCap, tone: 'yellow' },
    { label: 'Matriculas', value: data.matriculas, icon: ClipboardCheck, tone: 'coral' },
    { label: 'Receita', value: formatCurrency(data.receita), icon: CircleDollarSign, tone: 'blue' },
  ];

  return (
    <section className="page">
      <header className="page-heading dashboard-heading"><div><p className="eyebrow">Trek HyperLessons</p><h1>Visao geral</h1></div><p>Acompanhe a atividade da plataforma.</p></header>
      {error && <p className="form-error">{error}</p>}
      <div className="metrics-grid">{metrics.map(({ label, value, icon: Icon, tone }) => <article key={label} className="metric"><div className={'metric-icon ' + tone}><Icon size={21} /></div><div><p>{label}</p><strong>{value}</strong></div></article>)}</div>
      <section className="dashboard-section"><div><p className="eyebrow">Catalogo</p><h2>Conteudo da plataforma</h2></div><div className="dashboard-callout"><BookOpen size={29} /><div><strong>{data.cursos} cursos disponiveis</strong><span>Os indicadores são carregados diretamente do backend.</span></div></div></section>
    </section>
  );
}
