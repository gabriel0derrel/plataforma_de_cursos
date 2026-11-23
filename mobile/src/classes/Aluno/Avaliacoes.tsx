import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { alunoService, type Avaliacao, type Matricula } from './alunoService';
import { cores } from '../../styles/theme';

export function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [cursoId, setCursoId] = useState<number | null>(null);
  const [nota, setNota] = useState('5');
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => {
    try { setCarregando(true); const [itens, cursos] = await Promise.all([alunoService.avaliacoes(), alunoService.matriculas()]); setAvaliacoes(itens); setMatriculas(cursos.filter((curso) => curso.DataConclusao)); setErro(''); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar as avaliações.'); }
    finally { setCarregando(false); }
  }, []);
  useEffect(() => { carregar(); }, [carregar]);
  async function enviar(): Promise<void> {
    if (!cursoId) { setErro('Selecione um curso concluído.'); return; }
    const valorNota = Number(nota);
    if (!Number.isInteger(valorNota) || valorNota < 1 || valorNota > 5) { setErro('Informe uma nota entre 1 e 5.'); return; }
    try { await alunoService.avaliar({ ID_Curso: cursoId, Nota: valorNota, Comentario: comentario || undefined }); setComentario(''); await carregar(); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível enviar a avaliação.'); }
  }
  return <>
    <Text style={styles.titulo}>Avaliações</Text><Text style={styles.subtitulo}>Avalie cursos que você concluiu.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}{carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    <Text style={styles.rotulo}>CURSO CONCLUÍDO</Text>
    {matriculas.map((matricula) => <TouchableOpacity key={matricula.ID_Matricula} style={[styles.opcao, cursoId === matricula.ID_Curso && styles.opcaoAtiva]} onPress={() => setCursoId(matricula.ID_Curso)}><Text style={styles.opcaoTexto}>{matricula.Curso.Titulo}</Text></TouchableOpacity>)}
    {!carregando && matriculas.length === 0 ? <Text style={styles.vazio}>Conclua todas as aulas de um curso para avaliá-lo.</Text> : null}
    <TextInput style={styles.input} value={nota} onChangeText={setNota} keyboardType="number-pad" placeholder="Nota de 1 a 5" placeholderTextColor={cores.textoSuave} />
    <TextInput style={[styles.input, styles.comentario]} value={comentario} onChangeText={setComentario} multiline placeholder="Comentário (opcional)" placeholderTextColor={cores.textoSuave} />
    <TouchableOpacity style={styles.botao} onPress={enviar}><Text style={styles.botaoTexto}>ENVIAR AVALIAÇÃO</Text></TouchableOpacity>
    <Text style={styles.secao}>Minhas avaliações</Text>
    {avaliacoes.map((avaliacao) => <View style={styles.item} key={avaliacao.ID_Avaliacao}><Text style={styles.itemTitulo}>{avaliacao.Curso.Titulo} · {avaliacao.Nota}/5</Text><Text style={styles.itemTexto}>{avaliacao.Comentario || 'Sem comentário'}</Text></View>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, rotulo: { color: cores.primaria, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }, vazio: { color: cores.textoSuave },
  opcao: { padding: 13, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficie }, opcaoAtiva: { borderColor: cores.primaria, backgroundColor: cores.primaria }, opcaoTexto: { color: cores.texto },
  input: { minHeight: 50, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficie, color: cores.texto }, comentario: { paddingTop: 12, minHeight: 90, textAlignVertical: 'top' },
  botao: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: cores.primaria }, botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold' }, secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  item: { padding: 14, borderRadius: 12, backgroundColor: cores.superficie, gap: 4 }, itemTitulo: { color: cores.texto, fontWeight: 'bold' }, itemTexto: { color: cores.textoSuave },
});
