import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Curso } from '../cursos/Curso';
import { CursoCard } from '../cursos/CursoCard';
import { cursoService } from '../cursos/cursosApi';
import { alunoService, type Categoria, type Trilha, type TrilhaCurso } from './alunoApi';
import { cores } from '../../colors';

export function CursosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [matriculados, setMatriculados] = useState<Set<number>>(new Set());
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [trilhaCursos, setTrilhaCursos] = useState<TrilhaCurso[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [trilhaId, setTrilhaId] = useState<number | 'sem-trilha' | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erroTrilhas, setErroTrilhas] = useState('');
  const [carregandoTrilhas, setCarregandoTrilhas] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const [categoriasCadastradas, cursosCadastrados, minhasMatriculas] = await Promise.all([
        alunoService.categorias(), cursoService.listar(), alunoService.matriculas(),
      ]);
      setCategorias(categoriasCadastradas);
      setCursos(cursosCadastrados);
      setMatriculados(new Set(minhasMatriculas.map((matricula) => matricula.ID_Curso)));
      setErro('');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar o catálogo.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { void carregar(); }, [carregar]);

  const carregarTrilhas = useCallback(async () => {
    setCarregandoTrilhas(true);
    setErroTrilhas('');
    try {
      const [trilhasCadastradas, vinculos] = await Promise.all([alunoService.trilhas(), alunoService.trilhaCursos()]);
      setTrilhas(trilhasCadastradas);
      setTrilhaCursos(vinculos);
    } catch (error) {
      setErroTrilhas(error instanceof Error ? error.message : 'Não foi possível carregar as trilhas.');
    } finally {
      setCarregandoTrilhas(false);
    }
  }, []);

  useEffect(() => { void carregarTrilhas(); }, [carregarTrilhas]);

  const categoria = categorias.find((item) => item.ID_Categoria === categoriaId);
  const grupos = useMemo(() => {
    if (categoriaId === null) return [];
    const cursosPorId = new Map(cursos.map((curso) => [curso.ID_Curso, curso]));
    const cursosPorTrilha = new Map<number, Curso[]>();
    for (const vinculo of [...trilhaCursos].sort((a, b) => a.Ordem - b.Ordem)) {
      const curso = cursosPorId.get(vinculo.ID_Curso);
      if (!curso) continue;
      const lista = cursosPorTrilha.get(vinculo.ID_Trilha) ?? [];
      lista.push(curso);
      cursosPorTrilha.set(vinculo.ID_Trilha, lista);
    }
    const daCategoria = trilhas.flatMap(({ ID_Trilha, ID_Categoria, Titulo, Descricao }) => {
      const vinculados = cursosPorTrilha.get(ID_Trilha) ?? [];
      if (ID_Categoria === categoriaId) return [{ id: ID_Trilha, titulo: Titulo, descricao: Descricao, cursos: vinculados }];
      if (ID_Categoria !== null) return [];
      // Trilhas antigas sem categoria são encontradas pela categoria de seus cursos.
      const cursosDaCategoria = vinculados.filter((curso) => curso.ID_Categoria === categoriaId);
      return cursosDaCategoria.length ? [{ id: ID_Trilha, titulo: Titulo, descricao: Descricao, cursos: cursosDaCategoria }] : [];
    });
    const idsVinculados = new Set(trilhaCursos.map((vinculo) => vinculo.ID_Curso));
    const semTrilha = cursos.filter((curso) => curso.ID_Categoria === categoriaId && !idsVinculados.has(curso.ID_Curso));
    return semTrilha.length ? [...daCategoria, { id: 'sem-trilha' as const, titulo: 'Sem trilha', descricao: '', cursos: semTrilha }] : daCategoria;
  }, [categoriaId, cursos, trilhas, trilhaCursos]);
  const grupo = grupos.find((item) => item.id === trilhaId);

  async function matricular(curso: Curso): Promise<void> {
    try {
      await alunoService.matricular(curso.ID_Curso);
      setMatriculados((itens) => new Set([...itens, curso.ID_Curso]));
      setErro('');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível realizar a matrícula.');
    }
  }

  function renderCurso(curso: Curso) {
    const matriculado = matriculados.has(curso.ID_Curso);
    return <View style={styles.curso} key={curso.ID_Curso}>
      <CursoCard curso={curso} />
      <TouchableOpacity disabled={matriculado} style={[styles.botao, matriculado && styles.botaoDesabilitado]} onPress={() => { void matricular(curso); }}>
        <Text style={styles.botaoTexto}>{matriculado ? 'MATRICULADO' : 'MATRICULAR-SE'}</Text>
      </TouchableOpacity>
    </View>;
  }

  if (grupo) {
    return <>
      <TouchableOpacity style={styles.voltar} onPress={() => setTrilhaId(null)}>
        <Ionicons name="chevron-back" size={20} color={cores.primaria} />
        <Text style={styles.voltarTexto}>Voltar para {categoria?.Nome ?? 'trilhas'}</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>{grupo.titulo}</Text>
      <Text style={styles.subtitulo}>{grupo.descricao || 'Escolha um curso para se matricular.'}</Text>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      {grupo.cursos.length === 0 ? <Text style={styles.vazio}>Esta trilha ainda não possui cursos cadastrados.</Text> : null}
      {grupo.cursos.map(renderCurso)}
    </>;
  }

  if (categoria) {
    const carregandoGrupos = carregando || carregandoTrilhas;
    return <>
      <TouchableOpacity style={styles.voltar} onPress={() => { setTrilhaId(null); setCategoriaId(null); }}>
        <Ionicons name="chevron-back" size={20} color={cores.primaria} />
        <Text style={styles.voltarTexto}>Todas as categorias</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>{categoria.Nome}</Text>
      <Text style={styles.subtitulo}>Escolha uma trilha para ver seus cursos.</Text>
      {erroTrilhas ? <>
        <Text style={styles.erro}>{erroTrilhas}</Text>
        <TouchableOpacity style={styles.voltar} onPress={() => { void carregarTrilhas(); }}><Text style={styles.voltarTexto}>Tentar novamente</Text></TouchableOpacity>
      </> : null}
      {carregandoGrupos ? <ActivityIndicator color={cores.primaria} /> : null}
      {!carregandoGrupos && !erroTrilhas && grupos.length === 0 ? <Text style={styles.vazio}>Esta categoria ainda não possui trilhas.</Text> : null}
      {!carregandoGrupos && !erroTrilhas && grupos.map((item) => (
        <TouchableOpacity key={item.id} style={styles.categoria} onPress={() => setTrilhaId(item.id)} accessibilityLabel={`Abrir ${item.titulo}`}>
          <View style={styles.categoriaTexto}>
            <Text style={styles.categoriaTitulo}>{item.titulo}</Text>
            {item.descricao ? <Text style={styles.categoriaDescricao}>{item.descricao}</Text> : null}
            <Text style={styles.categoriaMeta}>{item.cursos.length} {item.cursos.length === 1 ? 'curso' : 'cursos'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={cores.primaria} />
        </TouchableOpacity>
      ))}
    </>;
  }

  return <>
    <Text style={styles.titulo}>Categorias</Text>
    <Text style={styles.subtitulo}>Escolha uma categoria para ver suas trilhas.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {!carregando && !erro && categorias.length === 0 ? <Text style={styles.vazio}>Ainda não há categorias cadastradas.</Text> : null}
    {categorias.map((item) => (
      <TouchableOpacity key={item.ID_Categoria} style={styles.categoria} onPress={() => setCategoriaId(item.ID_Categoria)} accessibilityLabel={`Abrir categoria ${item.Nome}`}>
        <View style={styles.categoriaTexto}>
          <Text style={styles.categoriaTitulo}>{item.Nome}</Text>
          {item.Descricao ? <Text style={styles.categoriaDescricao}>{item.Descricao}</Text> : null}
        </View>
        <Ionicons name="chevron-forward" size={22} color={cores.primaria} />
      </TouchableOpacity>
    ))}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' },
  subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 },
  erro: { color: cores.erro, lineHeight: 20 },
  vazio: { color: cores.textoSuave, textAlign: 'center', paddingVertical: 20 },
  voltar: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 2 },
  voltarTexto: { color: cores.primaria, fontWeight: 'bold', fontSize: 13 },
  categoria: { minHeight: 88, padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.superficie, borderLeftWidth: 4, borderLeftColor: cores.primaria },
  categoriaTexto: { flex: 1, gap: 4 },
  categoriaTitulo: { color: cores.texto, fontSize: 17, fontWeight: 'bold' },
  categoriaDescricao: { color: cores.textoSuave, fontSize: 13, lineHeight: 18 },
  categoriaMeta: { color: cores.primaria, fontSize: 12, fontWeight: 'bold' },
  curso: { gap: 7 },
  botao: { height: 42, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria },
  botaoDesabilitado: { backgroundColor: cores.cinza },
  botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold', fontSize: 12 },
});
