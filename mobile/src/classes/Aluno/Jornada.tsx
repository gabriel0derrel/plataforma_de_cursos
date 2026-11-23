import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { alunoService, type Progresso } from './alunoService';
import { cores } from '../../styles/theme';

export function JornadaPage() {
  const [aulas, setAulas] = useState<Progresso[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try { setCarregando(true); setAulas(await alunoService.progresso()); setErro(''); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar o progresso.'); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  async function alternar(aula: Progresso): Promise<void> {
    try { await alunoService.marcarProgresso(aula.ID_Aula, aula.Status === 'Concluida' ? 'Em andamento' : 'Concluida'); await carregar(); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível atualizar o progresso.'); }
  }

  return <>
    <Text style={styles.titulo}>Progresso das aulas</Text>
    <Text style={styles.subtitulo}>Marque cada aula assistida para atualizar a sua jornada.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {!carregando && aulas.length === 0 ? <Text style={styles.vazio}>Matricule-se em um curso para ver suas aulas.</Text> : null}
    {aulas.map((aula) => <TouchableOpacity style={styles.item} key={aula.ID_Aula} onPress={() => alternar(aula)}>
      <Ionicons name={aula.Status === 'Concluida' ? 'checkmark-circle' : 'ellipse-outline'} size={25} color={aula.Status === 'Concluida' ? cores.primaria : cores.textoSuave} />
      <View style={styles.itemTexto}><Text style={styles.curso}>{aula.Curso}</Text><Text style={styles.modulo}>{aula.Modulo}</Text><Text style={[styles.aula, aula.Status === 'Concluida' && styles.aulaConcluida]}>{aula.Aula}</Text></View>
    </TouchableOpacity>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 },
  erro: { color: cores.erro, lineHeight: 20 }, vazio: { color: cores.textoSuave, textAlign: 'center', paddingVertical: 20 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, borderRadius: 12, backgroundColor: cores.superficie },
  itemTexto: { flex: 1, gap: 2 }, curso: { color: cores.primaria, fontSize: 12, fontWeight: 'bold' }, modulo: { color: cores.textoSuave, fontSize: 12 }, aula: { color: cores.texto, fontSize: 15 }, aulaConcluida: { color: cores.textoSuave, textDecorationLine: 'line-through' },
});
