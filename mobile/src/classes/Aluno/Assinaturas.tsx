import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { planoService, type Plano } from '../Plano/planoService';
import { alunoService, type Assinatura } from './alunoService';
import { cores } from '../../styles/theme';

export function AssinaturasPage() {
  const [planos, setPlanos] = useState<Plano[]>([]); const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]); const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => { try { setCarregando(true); const [listaPlanos, listaAssinaturas] = await Promise.all([planoService.listar(), alunoService.assinaturas()]); setPlanos(listaPlanos); setAssinaturas(listaAssinaturas); setErro(''); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar assinaturas.'); } finally { setCarregando(false); } }, []);
  useEffect(() => { carregar(); }, [carregar]);
  async function assinar(plano: Plano): Promise<void> { try { await alunoService.assinar(plano.ID_Plano); await carregar(); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível assinar o plano.'); } }
  return <>
    <Text style={styles.titulo}>Assinaturas</Text><Text style={styles.subtitulo}>Escolha um plano disponível na plataforma.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}{carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    {planos.map((plano) => <View style={styles.plano} key={plano.ID_Plano}><Text style={styles.planoNome}>{plano.Nome}</Text><Text style={styles.planoDescricao}>{plano.Descricao || 'Sem descrição.'}</Text><Text style={styles.preco}>R$ {Number(plano.Preco).toFixed(2)} · {plano.DuracaoMeses} mês(es)</Text><TouchableOpacity style={styles.botao} onPress={() => assinar(plano)}><Text style={styles.botaoTexto}>ASSINAR</Text></TouchableOpacity></View>)}
    <Text style={styles.secao}>Minhas assinaturas</Text>
    {assinaturas.map((assinatura) => <View style={styles.item} key={assinatura.ID_Assinatura}><Text style={styles.itemTitulo}>{assinatura.Plano.Nome}</Text><Text style={styles.itemTexto}>R$ {Number(assinatura.Plano.Preco).toFixed(2)} · até {new Date(assinatura.DataFim).toLocaleDateString('pt-BR')}</Text></View>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 },
  plano: { padding: 16, gap: 6, borderRadius: 12, backgroundColor: cores.superficie, borderLeftWidth: 4, borderLeftColor: cores.primaria }, planoNome: { color: cores.texto, fontSize: 18, fontWeight: 'bold' }, planoDescricao: { color: cores.textoSuave }, preco: { color: cores.primaria, fontWeight: 'bold' },
  botao: { height: 42, marginTop: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: cores.primaria }, botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold' }, secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  item: { padding: 14, gap: 3, borderRadius: 12, backgroundColor: cores.superficie }, itemTitulo: { color: cores.texto, fontWeight: 'bold' }, itemTexto: { color: cores.textoSuave },
});
