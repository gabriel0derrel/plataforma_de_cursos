import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { alunoService, type Matricula, type Progresso } from './alunoService';
import { cores } from '../../styles/theme';

export function JornadaPage({ onSelecionarCurso }: { onSelecionarCurso: (curso: string) => void }) {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [progresso, setProgresso] = useState<Progresso[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const [meusCursos, minhasAulas] = await Promise.all([alunoService.matriculas(), alunoService.progresso()]);
      setMatriculas(meusCursos); setProgresso(minhasAulas); setErro('');
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar sua jornada.'); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  return <>
    <Text style={styles.titulo}>Minha jornada</Text>
    <Text style={styles.subtitulo}>Escolha um dos seus cursos para visualizar as respectivas aulas.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {!carregando && matriculas.length === 0 ? <Text style={styles.vazio}>Matricule-se em um curso para iniciar sua jornada.</Text> : null}
    {matriculas.map((matricula) => {
      const aulasDoCurso = progresso.filter((aula) => aula.Curso === matricula.Curso.Titulo);
      const concluidas = aulasDoCurso.filter((aula) => aula.Status === 'Concluida').length;
      return <TouchableOpacity style={styles.curso} key={matricula.ID_Matricula} onPress={() => onSelecionarCurso(matricula.Curso.Titulo)}>
        <View style={styles.cursoTexto}><Text style={styles.cursoTitulo}>{matricula.Curso.Titulo}</Text><Text style={styles.cursoMeta}>{matricula.Curso.Nivel} · {concluidas}/{aulasDoCurso.length} aulas concluídas</Text></View>
        <Text style={styles.abrir}>Ver aulas</Text>
      </TouchableOpacity>;
    })}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, vazio: { color: cores.textoSuave, textAlign: 'center', paddingVertical: 20 },
  curso: { minHeight: 82, padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: cores.superficie, borderLeftWidth: 4, borderLeftColor: cores.primaria }, cursoTexto: { flex: 1, gap: 4 }, cursoTitulo: { color: cores.texto, fontSize: 16, fontWeight: 'bold' }, cursoMeta: { color: cores.textoSuave, fontSize: 13 }, abrir: { color: cores.primaria, fontSize: 12, fontWeight: 'bold' },
});
