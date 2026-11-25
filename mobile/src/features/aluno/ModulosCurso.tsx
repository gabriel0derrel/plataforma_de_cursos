import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { alunoService, type Modulo, type Progresso } from './alunoApi';
import { cores } from '../../colors';

export function ModulosCursoPage({ cursoId, onSelecionarModulo }: { cursoId: number; onSelecionarModulo: (modulo: Modulo) => void }) {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [aulas, setAulas] = useState<Progresso[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const [modulosCadastrados, progresso] = await Promise.all([alunoService.modulos(), alunoService.progresso()]);
      setModulos(modulosCadastrados.filter((modulo) => modulo.ID_Curso === cursoId).sort((a, b) => a.Ordem - b.Ordem));
      setAulas(progresso.filter((aula) => aula.ID_Curso === cursoId));
      setErro('');
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar os módulos.'); }
    finally { setCarregando(false); }
  }, [cursoId]);
  useEffect(() => { void carregar(); }, [carregar]);

  return <>
    <Text style={styles.titulo}>Módulos</Text>
    <Text style={styles.subtitulo}>Escolha um módulo para acessar suas aulas.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {!carregando && modulos.length === 0 ? <Text style={styles.vazio}>Este curso ainda não possui módulos ou aulas cadastradas.</Text> : null}
    {modulos.map((modulo, indice) => {
      const aulasDoModulo = aulas.filter((aula) => aula.ID_Modulo === modulo.ID_Modulo);
      const concluidas = aulasDoModulo.filter((aula) => aula.Status === 'Concluida').length;
      return <TouchableOpacity key={modulo.ID_Modulo} style={styles.modulo} onPress={() => onSelecionarModulo(modulo)} accessibilityLabel={`Abrir aulas do módulo ${modulo.Titulo}`}>
        <Text style={styles.ordem}>{indice + 1}</Text><View style={styles.moduloTexto}><Text style={styles.moduloTitulo}>{modulo.Titulo}</Text><Text style={styles.moduloMeta}>{concluidas}/{aulasDoModulo.length} aulas concluídas</Text></View><Text style={styles.abrir}>Ver aulas</Text>
      </TouchableOpacity>;
    })}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 22, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, fontSize: 15, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, vazio: { color: cores.textoSuave, textAlign: 'center', paddingVertical: 20 },
  modulo: { minHeight: 72, padding: 14, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: cores.superficie, borderLeftWidth: 4, borderLeftColor: cores.primaria }, ordem: { width: 26, height: 26, borderRadius: 13, overflow: 'hidden', color: cores.sobrePrimaria, backgroundColor: cores.primaria, textAlign: 'center', lineHeight: 26, fontSize: 12, fontWeight: 'bold' }, moduloTexto: { flex: 1, gap: 3 }, moduloTitulo: { color: cores.texto, fontSize: 16, fontWeight: 'bold' }, moduloMeta: { color: cores.textoSuave, fontSize: 13 }, abrir: { color: cores.primaria, fontSize: 12, fontWeight: 'bold' },
});
