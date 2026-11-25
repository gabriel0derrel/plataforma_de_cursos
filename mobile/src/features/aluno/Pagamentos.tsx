import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { alunoService, type Assinatura, type Pagamento } from './alunoApi';
import { cores } from '../../colors';

const metodos = ['Pix', 'Cartao de credito', 'Boleto'];

export function PagamentosPage() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]); const [pagamentos, setPagamentos] = useState<Pagamento[]>([]); const [assinaturaId, setAssinaturaId] = useState<number | null>(null); const [valor, setValor] = useState(''); const [metodo, setMetodo] = useState(metodos[0]); const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => { try { setCarregando(true); const [listaPagamentos, listaAssinaturas] = await Promise.all([alunoService.pagamentos(), alunoService.assinaturas()]); setPagamentos(listaPagamentos); setAssinaturas(listaAssinaturas); setErro(''); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar pagamentos.'); } finally { setCarregando(false); } }, []);
  useEffect(() => { carregar(); }, [carregar]);
  async function pagar(): Promise<void> {
    if (!assinaturaId || !valor) { setErro('Selecione uma assinatura e preencha o valor.'); return; }
    try { await alunoService.pagar({ ID_Assinatura: assinaturaId, ValorPago: Number(valor.replace(',', '.')), MetodoPagamento: metodo }); setValor(''); await carregar(); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível registrar o pagamento.'); }
  }
  return <>
    <Text style={styles.titulo}>Pagamentos</Text><Text style={styles.subtitulo}>Registre o pagamento de uma assinatura.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}{carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    <Text style={styles.rotulo}>ASSINATURA</Text>
    {assinaturas.map((assinatura) => <TouchableOpacity key={assinatura.ID_Assinatura} style={[styles.opcao, assinaturaId === assinatura.ID_Assinatura && styles.opcaoAtiva]} onPress={() => setAssinaturaId(assinatura.ID_Assinatura)}><Text style={styles.opcaoTexto}>{assinatura.Plano.Nome}</Text></TouchableOpacity>)}
    <TextInput style={styles.input} value={valor} onChangeText={setValor} keyboardType="decimal-pad" placeholder="Valor pago" placeholderTextColor={cores.textoSuave} />
    <View style={styles.metodos}>{metodos.map((item) => <TouchableOpacity key={item} style={[styles.metodo, metodo === item && styles.metodoAtivo]} onPress={() => setMetodo(item)}><Text style={[styles.metodoTexto, metodo === item && styles.metodoTextoAtivo]}>{item}</Text></TouchableOpacity>)}</View>
    <TouchableOpacity style={styles.botao} onPress={pagar}><Text style={styles.botaoTexto}>REGISTRAR PAGAMENTO</Text></TouchableOpacity>
    <Text style={styles.secao}>Histórico</Text>
    {pagamentos.map((pagamento) => <View style={styles.item} key={pagamento.ID_Pagamento}><Text style={styles.itemTitulo}>{pagamento.Assinatura.Plano.Nome} · R$ {Number(pagamento.ValorPago).toFixed(2)}</Text><Text style={styles.itemTexto}>{pagamento.MetodoPagamento} · {new Date(pagamento.DataPagamento).toLocaleDateString('pt-BR')}</Text></View>)}
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, rotulo: { color: cores.primaria, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  opcao: { padding: 13, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficie }, opcaoAtiva: { borderColor: cores.primaria, backgroundColor: cores.primaria }, opcaoTexto: { color: cores.texto },
  input: { height: 50, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficie, color: cores.texto },
  metodos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, metodo: { paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: cores.borda, borderRadius: 18 }, metodoAtivo: { borderColor: cores.primaria, backgroundColor: cores.primaria }, metodoTexto: { color: cores.texto, fontSize: 12 }, metodoTextoAtivo: { color: cores.sobrePrimaria, fontWeight: 'bold' },
  botao: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: cores.primaria }, botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold' }, secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  item: { padding: 14, gap: 3, borderRadius: 12, backgroundColor: cores.superficie }, itemTitulo: { color: cores.texto, fontWeight: 'bold' }, itemTexto: { color: cores.textoSuave },
});
