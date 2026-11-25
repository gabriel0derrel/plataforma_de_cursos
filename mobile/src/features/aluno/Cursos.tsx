import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Curso } from '../cursos/Curso';
import { CursoCard } from '../cursos/CursoCard';
import { cursoService } from '../cursos/cursosApi';
import { alunoService, type Categoria } from './alunoApi';
import { cores } from '../../colors';

export function CursosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [matriculados, setMatriculados] = useState<Set<number>>(new Set());
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

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

  const categoria = useMemo(() => categorias.find((item) => item.ID_Categoria === categoriaSelecionada), [categorias, categoriaSelecionada]);
  const cursosDaCategoria = useMemo(() => cursos.filter((curso) => curso.ID_Categoria === categoriaSelecionada), [cursos, categoriaSelecionada]);

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

  if (categoria) {
    return <>
      <TouchableOpacity style={styles.voltar} onPress={() => setCategoriaSelecionada(null)} accessibilityLabel="Voltar para as categorias">
        <Ionicons name="chevron-back" size={20} color={cores.primaria} />
        <Text style={styles.voltarTexto}>Todas as categorias</Text>
      </TouchableOpacity>
      <Text style={styles.titulo}>{categoria.Nome}</Text>
      {categoria.Descricao ? <Text style={styles.subtitulo}>{categoria.Descricao}</Text> : <Text style={styles.subtitulo}>Escolha um curso para se matricular.</Text>}
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      {cursosDaCategoria.length === 0 ? <Text style={styles.vazio}>Esta categoria ainda não possui cursos cadastrados.</Text> : null}
      {cursosDaCategoria.map(renderCurso)}
    </>;
  }

  const cursosSemCategoria = cursos.filter((curso) => !categorias.some((item) => item.ID_Categoria === curso.ID_Categoria));
  return <>
    <Text style={styles.titulo}>Categorias</Text>
    <Text style={styles.subtitulo}>Escolha uma categoria e depois o curso em que deseja se matricular.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {!carregando && !erro && categorias.length === 0 ? <Text style={styles.vazio}>Ainda não há categorias cadastradas.</Text> : null}
    {categorias.map((item) => {
      const totalCursos = cursos.filter((curso) => curso.ID_Categoria === item.ID_Categoria).length;
      return <TouchableOpacity key={item.ID_Categoria} style={styles.categoria} onPress={() => setCategoriaSelecionada(item.ID_Categoria)} accessibilityLabel={`Abrir categoria ${item.Nome}`}>
        <View style={styles.categoriaTexto}><Text style={styles.categoriaTitulo}>{item.Nome}</Text>{item.Descricao ? <Text style={styles.categoriaDescricao}>{item.Descricao}</Text> : null}<Text style={styles.categoriaMeta}>{totalCursos} {totalCursos === 1 ? 'curso' : 'cursos'}</Text></View>
        <Ionicons name="chevron-forward" size={22} color={cores.primaria} />
      </TouchableOpacity>;
    })}
    {cursosSemCategoria.length > 0 ? <Text style={styles.secao}>Cursos sem categoria</Text> : null}
    {cursosSemCategoria.map(renderCurso)}
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
  secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold', marginTop: 8 },
});
