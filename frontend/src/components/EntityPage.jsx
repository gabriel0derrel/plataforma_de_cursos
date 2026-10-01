import { ArrowLeft, Pencil, Plus, RefreshCw, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../classes/Usuario/AuthContext';
import { referenceId, referenceLabel, referenceServices } from '../classes/shared/references';
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

const studentManagedEntities = new Set(['matriculas', 'progresso', 'avaliacoes', 'assinaturas', 'pagamentos']);

const contextReferences = {
  aulas: ['categorias', 'cursos', 'modulos'],
  avaliacoes: ['categorias'],
  certificados: ['categorias'],
  cursos: ['categorias'],
  matriculas: ['categorias'],
  modulos: ['categorias', 'cursos'],
  progresso: ['categorias', 'cursos', 'modulos'],
  'trilha-cursos': ['categorias'],
};

function Field({ field, value, onChange, referenceItems = [] }) {
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
  if (field.type === 'select' || field.reference) {
    const options = field.reference ? referenceItems.map((item) => ({ value: referenceId(item), label: referenceLabel(field.reference, item) })) : field.options.map((option) => ({ value: option, label: option }));
    return <label className="field"><span>{field.label}</span><select {...common}><option value="">{field.required ? 'Selecione' : 'Não informado'}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
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
  const [filterData, setFilterData] = useState({ categorias: [], cursos: [], modulos: [] });
  const [filters, setFilters] = useState({ categoria: '', curso: '', modulo: '' });
  const [relationshipFilters, setRelationshipFilters] = useState({});
  const [relationshipOptions, setRelationshipOptions] = useState({});

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

  useEffect(() => {
    if (!['cursos', 'modulos', 'aulas'].includes(config.key)) return;
    Promise.all([
      referenceServices.categorias.listar(),
      referenceServices.cursos.listar(),
      referenceServices.modulos.listar(),
    ]).then(([categorias, cursos, modulos]) => setFilterData({ categorias, cursos, modulos })).catch((requestError) => setError(requestError.message));
  }, [config.key]);

  const directRelationships = config.fields.filter((field) => field.reference);
  useEffect(() => {
    const references = [...new Set([...directRelationships.map((field) => field.reference), ...(contextReferences[config.key] || [])])];
    if (!references.length) return;
    Promise.allSettled(references.map(async (reference) => [reference, await referenceServices[reference].listar()]))
      .then((results) => setRelationshipOptions(Object.fromEntries(results.filter((result) => result.status === 'fulfilled').map((result) => result.value))))
      .catch(() => {});
  }, [config.key]);

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
  const canEditContent = canManage && config.key !== 'usuarios' && !studentManagedEntities.has(config.key);
  const canCreateContent = canManage && !studentManagedEntities.has(config.key);
  const visibleColumns = config.columns.filter((column) => !column.toLowerCase().startsWith('id_'));
  const entityId = (item) => Object.entries(item).find(([key]) => /^ID_[A-Za-z]+$/.test(key))?.[1];
  const lookup = (reference, id) => (relationshipOptions[reference] || filterData[reference] || []).find((item) => String(referenceId(item)) === String(id));
  const directContext = (item) => directRelationships.map((field) => ({ label: field.label, value: referenceLabel(field.reference, lookup(field.reference, item[field.name])) })).filter((item) => item.value && item.value !== 'Registro');
  const extraContext = (item) => {
    const course = lookup('cursos', item.ID_Curso) || (config.key === 'cursos' ? item : null);
    const modulo = lookup('modulos', item.ID_Modulo) || (config.key === 'modulos' ? item : null);
    const courseFromModule = modulo && lookup('cursos', modulo.ID_Curso);
    const effectiveCourse = course || courseFromModule;
    const category = effectiveCourse && lookup('categorias', effectiveCourse.ID_Categoria);
    const values = [];
    if (['modulos', 'aulas', 'matriculas', 'avaliacoes', 'certificados', 'progresso', 'trilha-cursos'].includes(config.key) && effectiveCourse && !directRelationships.some((field) => field.reference === 'cursos')) values.push({ label: 'Curso', value: referenceLabel('cursos', effectiveCourse) });
    if (['aulas', 'progresso'].includes(config.key) && modulo && !directRelationships.some((field) => field.reference === 'modulos')) values.push({ label: 'Módulo', value: referenceLabel('modulos', modulo) });
    if (category && !directRelationships.some((field) => field.reference === 'categorias')) values.push({ label: 'Categoria', value: referenceLabel('categorias', category) });
    return values;
  };
  const contextualColumns = (item) => [...directContext(item), ...extraContext(item)];
  const cursosFiltrados = filterData.cursos.filter((curso) => !filters.categoria || String(curso.ID_Categoria) === filters.categoria);
  const modulosFiltrados = filterData.modulos.filter((modulo) => (!filters.curso || String(modulo.ID_Curso) === filters.curso) && (!filters.categoria || cursosFiltrados.some((curso) => curso.ID_Curso === modulo.ID_Curso)));
  const filteredItems = items.filter((item) => {
    if (config.key === 'cursos') return !filters.categoria || String(item.ID_Categoria) === filters.categoria;
    if (config.key === 'modulos') return (!filters.categoria || cursosFiltrados.some((curso) => curso.ID_Curso === item.ID_Curso)) && (!filters.curso || String(item.ID_Curso) === filters.curso);
    if (config.key === 'aulas') return (!filters.categoria || modulosFiltrados.some((modulo) => modulo.ID_Modulo === item.ID_Modulo)) && (!filters.curso || modulosFiltrados.some((modulo) => modulo.ID_Modulo === item.ID_Modulo)) && (!filters.modulo || String(item.ID_Modulo) === filters.modulo);
    return directRelationships.every((field) => !relationshipFilters[field.name] || String(item[field.name]) === relationshipFilters[field.name]);
  });
  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value, ...(name === 'categoria' ? { curso: '', modulo: '' } : {}), ...(name === 'curso' ? { modulo: '' } : {}) }));
  }
  function changeRelationshipFilter(name, value) {
    setRelationshipFilters((current) => {
      const next = { ...current, [name]: value };
      // Descarta seleções que deixam de existir quando outro filtro é alterado.
      directRelationships.forEach((field) => {
        if (field.name === name || !next[field.name]) return;
        const remainsAvailable = items.some((item) => String(item[field.name]) === next[field.name] && directRelationships.every((other) => other.name === field.name || !next[other.name] || String(item[other.name]) === next[other.name]));
        if (!remainsAvailable) next[field.name] = '';
      });
      return next;
    });
  }
  function optionsForRelationship(field) {
    return (relationshipOptions[field.reference] || []).filter(field.referenceFilter || (() => true)).filter((option) => {
      const optionId = String(referenceId(option));
      return items.some((item) => String(item[field.name]) === optionId && directRelationships.every((other) => other.name === field.name || !relationshipFilters[other.name] || String(item[other.name]) === relationshipFilters[other.name]));
    });
  }
  const showSpecificFilters = ['cursos', 'modulos', 'aulas'].includes(config.key);

  return (
    <section className="page">
      <header className="page-heading">
        <div><p className="eyebrow">Cadastro</p><h1>{config.plural}</h1></div>
        {canCreateContent && <Link className="button primary" to={config.route + '/novo'}><Plus size={18} />Novo</Link>}
      </header>
      {location.state?.notice && <p className="success-message">{location.state.notice}</p>}
      {showSpecificFilters && <div className="panel filter-bar">
        <label className="field"><span>Categoria</span><select value={filters.categoria} onChange={(event) => changeFilter('categoria', event.target.value)}><option value="">Todas</option>{filterData.categorias.map((categoria) => <option key={categoria.ID_Categoria} value={categoria.ID_Categoria}>{categoria.Nome}</option>)}</select></label>
        {['modulos', 'aulas'].includes(config.key) && <label className="field"><span>Curso</span><select value={filters.curso} onChange={(event) => changeFilter('curso', event.target.value)}><option value="">Todos</option>{cursosFiltrados.map((curso) => <option key={curso.ID_Curso} value={curso.ID_Curso}>{curso.Titulo}</option>)}</select></label>}
        {config.key === 'aulas' && <label className="field"><span>Módulo</span><select value={filters.modulo} onChange={(event) => changeFilter('modulo', event.target.value)}><option value="">Todos</option>{modulosFiltrados.map((modulo) => <option key={modulo.ID_Modulo} value={modulo.ID_Modulo}>{modulo.Titulo}</option>)}</select></label>}
      </div>}
      {!showSpecificFilters && directRelationships.length > 0 && <div className="panel filter-bar">
        {directRelationships.map((field) => <label className="field" key={field.name}><span>{field.label}</span><select value={relationshipFilters[field.name] || ''} onChange={(event) => changeRelationshipFilter(field.name, event.target.value)}><option value="">Todos</option>{optionsForRelationship(field).map((item) => <option key={referenceId(item)} value={referenceId(item)}>{referenceLabel(field.reference, item)}</option>)}</select></label>)}
      </div>}
      <div className="panel table-panel">
        {loading && <p className="loading-text">Carregando dados...</p>}
        {!loading && error && <div className="empty-state"><Icon size={31} /><p>{error}</p><button className="icon-button" type="button" onClick={load} aria-label="Tentar novamente" title="Tentar novamente"><RefreshCw size={18} /></button></div>}
        {!loading && !error && filteredItems.length === 0 && <div className="empty-state"><Icon size={31} /><p>Nenhum registro encontrado.</p></div>}
        {!loading && !error && filteredItems.length > 0 && <div className="table-scroll"><table><thead><tr>{visibleColumns.map((column) => <th key={column}>{formatLabel(column)}</th>)}{[...directRelationships, ...extraContext(filteredItems[0])].map((column) => <th key={column.label}>{column.label}</th>)}{(canToggleInstructor || canEditContent) && <th>Acoes</th>}</tr></thead><tbody>{filteredItems.map((item, index) => <tr key={entityId(item) || index}>{visibleColumns.map((column) => <td key={column}>{formatValue(column, item[column])}</td>)}{contextualColumns(item).map((column, contextIndex) => <td key={column.label + contextIndex}>{column.value}</td>)}{(canToggleInstructor || canEditContent) && <td>{canEditContent && <Link className="button secondary" to={config.route + '/' + entityId(item) + '/editar'}><Pencil size={15} />Editar</Link>}{canToggleInstructor && <button className="button secondary" type="button" onClick={() => toggleInstructor(item)}>{item.IsInstrutor ? 'Remover instrutor' : 'Tornar instrutor'}</button>}</td>}</tr>)}</tbody></table></div>}
      </div>
    </section>
  );
}

export function EntityForm({ config, edit = false }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [references, setReferences] = useState({});
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

  useEffect(() => {
    const keys = [...new Set(config.fields.map((field) => field.reference).filter(Boolean))];
    if (!keys.length) return;
    Promise.all(keys.map(async (key) => [key, await referenceServices[key].listar()])).then((entries) => {
      setReferences(Object.fromEntries(entries));
    }).catch((requestError) => setError(requestError.message));
  }, [config]);

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
  if (!canManage || studentManagedEntities.has(config.key)) return <Navigate to={config.route} replace />;

  return (
    <section className="page narrow-page">
      <header className="page-heading">
        <div><p className="eyebrow">{config.plural}</p><h1>{edit ? 'Editar ' : 'Novo '}{config.singular.toLowerCase()}</h1></div>
        <Link className="button secondary" to={config.route}><ArrowLeft size={18} />Voltar</Link>
      </header>
      <form className="panel form-panel" onSubmit={submit}>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-grid">{config.fields.map((field) => <Field key={field.name} field={field} value={form[field.name]} onChange={changeField} referenceItems={(references[field.reference] || []).filter(field.referenceFilter || (() => true))} />)}</div>
        <div className="form-actions"><button className="button primary" type="submit" disabled={loading}><Save size={18} />{loading ? 'Salvando...' : 'Salvar'}</button></div>
      </form>
    </section>
  );
}
