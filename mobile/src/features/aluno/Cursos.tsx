import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Curso } from '../cursos/Curso';
import { CursoCard } from '../cursos/CursoCard';
import { cursoService } from '../cursos/cursosApi';
import { alunoService, type Matricula } from './alunoApi';
import { cores } from '../../colors';

export function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const [catalogo, minhasMatriculas] = await Promise.all([cursoService.listar(), alunoService.matriculas()]);
      setCursos(catalogo);
      setMatriculas(minhasMatriculas);
      setErro('');
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar os cursos.'); }
    finally { setCarregando(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);
  const matriculados = new Set(matriculas.map((item) => item.ID_Curso));

  async function matricular(curso: Curso): Promise<void> {
    try {
      await alunoService.matricular(curso.ID_Curso);
      await carregar();
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível realizar a matrícula.'); }
  }

  return <>
    <Text style={styles.titulo}>Cursos</Text>
    <Text style={styles.subtitulo}>Conteúdos cadastrados no catálogo da plataforma.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {cursos.map((curso) => <View style={styles.curso} key={curso.ID_Curso}>
      <CursoCard curso={curso} />
      <TouchableOpacity disabled={matriculados.has(curso.ID_Curso)} style={[styles.botao, matriculados.has(curso.ID_Curso) && styles.botaoDesabilitado]} onPress={() => matricular(curso)}>
        <Text style={styles.botaoTexto}>{matriculados.has(curso.ID_Curso) ? 'MATRICULADO' : 'MATRICULAR-SE'}</Text>
      </TouchableOpacity>
    </View>)}
    <Text style={styles.secao}>Meus cursos</Text>
    {matriculas.map((matricula) => <View style={styles.matricula} key={matricula.ID_Matricula}>
      <Text style={styles.matriculaTitulo}>{matricula.Curso.Titulo}</Text>
      <Text style={styles.matriculaTexto}>{matricula.Curso.Nivel} · {matricula.DataConclusao ? 'Concluído' : 'Em andamento'}</Text>
    </View>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' },
  subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 },
  erro: { color: cores.erro, lineHeight: 20 },
  curso: { gap: 7 },
  botao: { height: 42, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria },
  botaoDesabilitado: { backgroundColor: cores.cinza },
  botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold', fontSize: 12 },
  secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  matricula: { padding: 14, borderRadius: 12, backgroundColor: cores.superficie, gap: 3 },
  matriculaTitulo: { color: cores.texto, fontWeight: 'bold' },
  matriculaTexto: { color: cores.textoSuave },
});
