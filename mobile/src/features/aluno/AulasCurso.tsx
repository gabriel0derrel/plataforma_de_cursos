import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { alunoService, type Progresso } from './alunoApi';
import { cores } from '../../colors';

export function AulasCursoPage({ cursoId, moduloId }: { cursoId: number; moduloId: number }) {
  const [aulas, setAulas] = useState<Progresso[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try { setCarregando(true); const progresso = await alunoService.progresso(); setAulas(progresso.filter((aula) => aula.ID_Curso === cursoId && aula.ID_Modulo === moduloId)); setErro(''); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar as aulas.'); }
    finally { setCarregando(false); }
  }, [cursoId, moduloId]);
  useEffect(() => { carregar(); }, [carregar]);

  async function concluir(aula: Progresso): Promise<void> {
    try { await alunoService.marcarProgresso(aula.ID_Aula, 'Concluida'); await carregar(); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível concluir a aula.'); }
  }

  return <>
    <Text style={styles.titulo}>Aulas do módulo</Text>
    <Text style={styles.subtitulo}>Toque em “Marcar como vista” ao terminar uma aula. A conclusão não pode ser desfeita pelo aplicativo.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {!carregando && aulas.length === 0 ? <Text style={styles.vazio}>Este curso ainda não possui aulas cadastradas.</Text> : null}
    {aulas.map((aula) => <View style={styles.item} key={aula.ID_Aula}>
      <Ionicons name={aula.Status === 'Concluida' ? 'checkmark-circle' : 'ellipse-outline'} size={25} color={aula.Status === 'Concluida' ? cores.primaria : cores.textoSuave} />
      <View style={styles.itemTexto}><Text style={[styles.aula, aula.Status === 'Concluida' && styles.aulaConcluida]}>{aula.Aula}</Text>{aula.Status === 'Concluida' ? <Text style={styles.concluida}>Concluída</Text> : null}</View>
      {aula.Status !== 'Concluida' ? <TouchableOpacity style={styles.botao} onPress={() => concluir(aula)}><Text style={styles.botaoTexto}>MARCAR COMO VISTA</Text></TouchableOpacity> : null}
    </View>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 22, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, vazio: { color: cores.textoSuave, textAlign: 'center', paddingVertical: 20 },
  item: { padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: cores.superficie }, itemTexto: { flex: 1, gap: 2 }, aula: { color: cores.texto, fontSize: 15 }, aulaConcluida: { color: cores.textoSuave, textDecorationLine: 'line-through' }, concluida: { color: cores.primaria, fontSize: 12, fontWeight: 'bold' },
  botao: { maxWidth: 108, paddingHorizontal: 8, paddingVertical: 8, borderRadius: 8, backgroundColor: cores.primaria }, botaoTexto: { color: cores.sobrePrimaria, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
});
