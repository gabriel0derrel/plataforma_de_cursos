import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { alunoService, type Certificado, type Matricula } from './alunoService';
import { cores } from '../../styles/theme';

export function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => { try { setCarregando(true); const [itens, cursos] = await Promise.all([alunoService.certificados(), alunoService.matriculas()]); setCertificados(itens); setMatriculas(cursos.filter((curso) => curso.DataConclusao)); setErro(''); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar os certificados.'); } finally { setCarregando(false); } }, []);
  useEffect(() => { carregar(); }, [carregar]);
  const emitidos = new Set(certificados.map((certificado) => certificado.ID_Curso));
  async function emitir(cursoId: number): Promise<void> { try { await alunoService.obterCertificado(cursoId); await carregar(); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível emitir o certificado.'); } }
  return <>
    <Text style={styles.titulo}>Certificados</Text><Text style={styles.subtitulo}>Emita certificados para os cursos concluídos.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}{carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {matriculas.filter((curso) => !emitidos.has(curso.ID_Curso)).map((curso) => <TouchableOpacity key={curso.ID_Matricula} style={styles.botao} onPress={() => emitir(curso.ID_Curso)}><Text style={styles.botaoTexto}>OBTER: {curso.Curso.Titulo}</Text></TouchableOpacity>)}
    {!carregando && matriculas.length === 0 ? <Text style={styles.vazio}>Nenhum curso concluído ainda.</Text> : null}
    <Text style={styles.secao}>Emitidos</Text>
    {certificados.map((certificado) => <View style={styles.item} key={certificado.ID_Certificado}><Text style={styles.itemTitulo}>{certificado.Curso.Titulo}</Text><Text style={styles.codigo}>{certificado.CodigoVerificacao}</Text><Text style={styles.data}>Emissão: {new Date(certificado.DataEmissao).toLocaleDateString('pt-BR')}</Text></View>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, vazio: { color: cores.textoSuave },
  botao: { minHeight: 48, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: cores.primaria }, botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold', textAlign: 'center' }, secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  item: { padding: 14, borderRadius: 12, gap: 4, backgroundColor: cores.superficie }, itemTitulo: { color: cores.texto, fontWeight: 'bold' }, codigo: { color: cores.primaria, fontSize: 12 }, data: { color: cores.textoSuave, fontSize: 12 },
});
