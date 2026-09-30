import { ArrowLeft, Plus, RefreshCw, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';

function formatLabel(name) {
  return name.replaceAll('_', ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
}

function formatValue(name, value) {
  if (value === undefined || value === null || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Sim' : 'Nao';
  if (name.startsWith('Data')) return formatDate(value);
  if (name === 'Preco' || name === 'ValorPago') return formatCurrency(value);
  return String(value);
}

function Field({ field, value, onChange }) {
  if (field.type === 'checkbox') {
    return <label className="check-field"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(field.name, event.target.checked)} /><span>{field.label}</span></label>;
  }

  const common = {
    value: value || '',
    required: field.required,
    min: field.min,
    max: field.max,
    step: field.step,
    onChange: (event) => onChange(field.name, event.target.value),
  };

  if (field.type === 'textarea') {
    return <label className="field field-full"><span>{field.label}</span><textarea rows="4" {...common} /></label>;
  }
  if (field.type === 'select') {
    return <label className="field"><span>{field.label}</span><select {...common}><option value="">Selecione</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
  }
  return <label className="field"><span>{field.label}</span><input type={field.type} {...common} /></label>;
}

export function EntityList({ config }) {
  const location = useLocation();
  const Icon = config.icon;
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await config.service.listar());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => { load(); }, [load]);

  return (
    <section className="page">
      <header className="page-heading">
        <div><p className="eyebrow">Cadastro</p><h1>{config.plural}</h1></div>
        <Link className="button primary" to={config.route + '/novo'}><Plus size={18} />Novo</Link>
      </header>
      {location.state?.notice && <p className="success-message">{location.state.notice}</p>}
      <div className="panel table-panel">
        {loading && <p className="loading-text">Carregando dados...</p>}
        {!loading && error && <div className="empty-state"><Icon size={31} /><p>{error}</p><button className="icon-button" type="button" onClick={load} aria-label="Tentar novamente" title="Tentar novamente"><RefreshCw size={18} /></button></div>}
        {!loading && !error && items.length === 0 && <div className="empty-state"><Icon size={31} /><p>Nenhum registro cadastrado.</p></div>}
        {!loading && !error && items.length > 0 && <div className="table-scroll"><table><thead><tr>{config.columns.map((column) => <th key={column}>{formatLabel(column)}</th>)}</tr></thead><tbody>{items.map((item, index) => <tr key={item.ID || item[config.columns[0]] || index}>{config.columns.map((column) => <td key={column}>{formatValue(column, item[column])}</td>)}</tr>)}</tbody></table></div>}
      </div>
    </section>
  );
}

export function EntityForm({ config }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function changeField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await config.service.criar(form);
      navigate(config.route, { state: { notice: config.singular + ' cadastrado com sucesso.' } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page narrow-page">
      <header className="page-heading">
        <div><p className="eyebrow">{config.plural}</p><h1>Novo {config.singular.toLowerCase()}</h1></div>
        <Link className="button secondary" to={config.route}><ArrowLeft size={18} />Voltar</Link>
      </header>
      <form className="panel form-panel" onSubmit={submit}>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-grid">{config.fields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={changeField} />)}</div>
        <div className="form-actions"><button className="button primary" type="submit" disabled={loading}><Save size={18} />{loading ? 'Salvando...' : 'Salvar'}</button></div>
      </form>
    </section>
  );
}
