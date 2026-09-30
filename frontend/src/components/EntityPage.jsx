import { ArrowLeft, Pencil, Plus, RefreshCw, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../classes/Usuario/AuthContext';
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
  const { usuario } = useAuth();
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

  async function toggleInstructor(item) {
    setError('');
    try {
      await config.service.atualizar(item.ID_Usuario, { IsInstrutor: !item.IsInstrutor });
      await load();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const canManage = Boolean(usuario?.IsAdmin) || usuario?.Email?.toLowerCase() === 'admin@admin.com';
  const canToggleInstructor = canManage && config.key === 'usuarios';
  const canEditContent = canManage && config.key !== 'usuarios';
  const visibleColumns = config.columns.filter((column) => !column.toLowerCase().startsWith('id_'));
  const entityId = (item) => Object.entries(item).find(([key]) => /^ID_[A-Za-z]+$/.test(key))?.[1];

  return (
    <section className="page">
      <header className="page-heading">
        <div><p className="eyebrow">Cadastro</p><h1>{config.plural}</h1></div>
        {canManage && <Link className="button primary" to={config.route + '/novo'}><Plus size={18} />Novo</Link>}
      </header>
      {location.state?.notice && <p className="success-message">{location.state.notice}</p>}
      <div className="panel table-panel">
        {loading && <p className="loading-text">Carregando dados...</p>}
        {!loading && error && <div className="empty-state"><Icon size={31} /><p>{error}</p><button className="icon-button" type="button" onClick={load} aria-label="Tentar novamente" title="Tentar novamente"><RefreshCw size={18} /></button></div>}
        {!loading && !error && items.length === 0 && <div className="empty-state"><Icon size={31} /><p>Nenhum registro cadastrado.</p></div>}
        {!loading && !error && items.length > 0 && <div className="table-scroll"><table><thead><tr>{visibleColumns.map((column) => <th key={column}>{formatLabel(column)}</th>)}{(canToggleInstructor || canEditContent) && <th>Acoes</th>}</tr></thead><tbody>{items.map((item, index) => <tr key={entityId(item) || index}>{visibleColumns.map((column) => <td key={column}>{formatValue(column, item[column])}</td>)}{(canToggleInstructor || canEditContent) && <td>{canEditContent && <Link className="button secondary" to={config.route + '/' + entityId(item) + '/editar'}><Pencil size={15} />Editar</Link>}{canToggleInstructor && <button className="button secondary" type="button" onClick={() => toggleInstructor(item)}>{item.IsInstrutor ? 'Remover instrutor' : 'Tornar instrutor'}</button>}</td>}</tr>)}</tbody></table></div>}
      </div>
    </section>
  );
}

export function EntityForm({ config, edit = false }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function changeField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  useEffect(() => {
    if (!edit) return;
    config.service.buscar(id).then((item) => {
      const values = Object.fromEntries(config.fields.map((field) => {
        const value = item[field.name];
        return [field.name, field.type === 'date' && value ? String(value).slice(0, 10) : value];
      }));
      setForm(values);
    }).catch((requestError) => setError(requestError.message));
  }, [config, edit, id]);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = new config.Model(form).toPayload();
      if (edit) await config.service.atualizar(id, payload);
      else await config.service.criar(form);
      navigate(config.route, { state: { notice: config.singular + (edit ? ' atualizado com sucesso.' : ' cadastrado com sucesso.') } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const canManage = Boolean(usuario?.IsAdmin) || usuario?.Email?.toLowerCase() === 'admin@admin.com';
  if (!canManage) return <Navigate to={config.route} replace />;

  return (
    <section className="page narrow-page">
      <header className="page-heading">
        <div><p className="eyebrow">{config.plural}</p><h1>{edit ? 'Editar ' : 'Novo '}{config.singular.toLowerCase()}</h1></div>
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
