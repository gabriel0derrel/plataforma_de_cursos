import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { alunoService, type Matricula, type Progresso } from './features/aluno/alunoApi';
import { cores } from './colors';

export function Dashboard({ nome, onContinuar }: { nome: string; onContinuar: () => void }) {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [progresso, setProgresso] = useState<Progresso[]>([]);
  const [certificados, setCertificados] = useState(0);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const [minhasMatriculas, minhasAulas, meusCertificados] = await Promise.all([alunoService.matriculas(), alunoService.progresso(), alunoService.certificados()]);
      setMatriculas(minhasMatriculas); setProgresso(minhasAulas); setCertificados(meusCertificados.length); setErro('');
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar o resumo.'); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);
  const concluidas = progresso.filter((aula) => aula.Status === 'Concluida').length;
  const cursoEmAndamento = matriculas.find((matricula) => !matricula.DataConclusao);

  return <>
    <Text style={styles.saudacao}>Olá, {nome}!</Text>
    <Text style={styles.subtitulo}>Acompanhe os dados reais da sua jornada de aprendizado.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    <View style={styles.indicadores}>
      <Indicador valor={String(matriculas.filter((matricula) => !matricula.DataConclusao).length)} legenda="Em andamento" />
      <Indicador valor={`${concluidas}/${progresso.length}`} legenda="Aulas vistas" />
      <Indicador valor={String(certificados)} legenda="Certificados" />
    </View>
    {cursoEmAndamento ? <View style={styles.destaque}>
      <Text style={styles.rotulo}>CONTINUE SUA JORNADA</Text>
      <Text style={styles.tituloDestaque}>{cursoEmAndamento.Curso.Titulo}</Text>
      <Text style={styles.textoDestaque}>{cursoEmAndamento.Curso.Nivel} · matrícula em {formatarData(cursoEmAndamento.DataMatricula)}</Text>
      <TouchableOpacity style={styles.botaoEscuro} onPress={onContinuar}><Text style={styles.botaoEscuroTexto}>VER AULAS</Text></TouchableOpacity>
    </View> : <View style={styles.vazio}><Text style={styles.vazioTexto}>Você ainda não possui cursos em andamento.</Text></View>}
  </>;
}

function Indicador({ valor, legenda }: { valor: string; legenda: string }) { return <View style={styles.indicador}><Text style={styles.valor}>{valor}</Text><Text style={styles.legenda}>{legenda}</Text></View>; }
function formatarData(data: string): string { return new Date(data).toLocaleDateString('pt-BR'); }

const styles = StyleSheet.create({
  saudacao: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 },
  indicadores: { flexDirection: 'row', gap: 10 }, indicador: { flex: 1, minHeight: 80, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: cores.superficie, borderBottomWidth: 3, borderBottomColor: cores.primaria },
  valor: { color: cores.primaria, fontSize: 20, fontWeight: 'bold' }, legenda: { color: cores.textoSuave, fontSize: 11, textAlign: 'center' },
  destaque: { padding: 20, borderRadius: 16, gap: 8, backgroundColor: cores.primaria }, rotulo: { color: cores.cinza, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }, tituloDestaque: { color: cores.sobrePrimaria, fontSize: 20, fontWeight: 'bold' }, textoDestaque: { color: cores.sobrePrimaria },
  botaoEscuro: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: cores.preto }, botaoEscuroTexto: { color: cores.primaria, fontSize: 12, fontWeight: 'bold' },
  vazio: { padding: 20, borderRadius: 12, backgroundColor: cores.superficie }, vazioTexto: { color: cores.textoSuave, textAlign: 'center' },
});
