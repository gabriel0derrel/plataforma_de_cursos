import { BookOpen, CircleDollarSign, ClipboardCheck, GraduationCap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cursoService } from '../classes/Curso/cursoService';
import { matriculaService } from '../classes/Matricula/matriculaService';
import { pagamentoService } from '../classes/Pagamento/pagamentoService';
import { usuarioService } from '../classes/Usuario/usuarioService';
import { formatCurrency } from '../utils/formatters';

export function Dashboard() {
  const [data, setData] = useState({ usuarios: [], cursos: [], matriculas: [], pagamentos: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const result = await Promise.allSettled([usuarioService.listar(), cursoService.listar(), matriculaService.listar(), pagamentoService.listar()]);
      const [usuarios, cursos, matriculas, pagamentos] = result;
      setData({
        usuarios: usuarios.status === 'fulfilled' ? usuarios.value : [],
        cursos: cursos.status === 'fulfilled' ? cursos.value : [],
        matriculas: matriculas.status === 'fulfilled' ? matriculas.value : [],
        pagamentos: pagamentos.status === 'fulfilled' ? pagamentos.value : [],
      });
      if (result.every((item) => item.status === 'rejected')) setError('Nao foi possivel carregar os indicadores.');
    }
    load();
  }, []);

  const receita = data.pagamentos.reduce((total, item) => total + Number(item.ValorPago || 0), 0);
  const metrics = [
    { label: 'Usuarios', value: data.usuarios.length, icon: Users, tone: 'mint' },
    { label: 'Cursos', value: data.cursos.length, icon: GraduationCap, tone: 'yellow' },
    { label: 'Matriculas', value: data.matriculas.length, icon: ClipboardCheck, tone: 'coral' },
    { label: 'Receita', value: formatCurrency(receita), icon: CircleDollarSign, tone: 'blue' },
  ];

  return (
    <section className="page">
      <header className="page-heading dashboard-heading"><div><p className="eyebrow">Trek HyperLessons</p><h1>Visao geral</h1></div><p>Acompanhe a atividade da plataforma.</p></header>
      {error && <p className="form-error">{error}</p>}
      <div className="metrics-grid">{metrics.map(({ label, value, icon: Icon, tone }) => <article key={label} className="metric"><div className={'metric-icon ' + tone}><Icon size={21} /></div><div><p>{label}</p><strong>{value}</strong></div></article>)}</div>
      <section className="dashboard-section"><div><p className="eyebrow">Catalogo</p><h2>Conteudo da plataforma</h2></div><div className="dashboard-callout"><BookOpen size={29} /><div><strong>{data.cursos.length} cursos disponiveis</strong><span>Os dados sao carregados diretamente do backend.</span></div></div></section>
    </section>
  );
}
