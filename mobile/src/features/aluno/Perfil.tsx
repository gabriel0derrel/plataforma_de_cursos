import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Usuario } from '../autenticacao/AuthContext';
import { cores } from '../../colors';

export type PaginaAluno = 'Avaliações' | 'Certificados' | 'Assinaturas' | 'Pagamentos' | 'Minha conta';

export function PerfilPage({ usuario, onSair, onAbrir }: { usuario: Usuario | null; onSair: () => void; onAbrir: (pagina: PaginaAluno) => void }) {
  const iniciais = usuario?.nome.split(' ').filter(Boolean).slice(0, 2).map((nome) => nome[0]).join('').toUpperCase() || 'A';
  const opcoes: { pagina: PaginaAluno; icone: keyof typeof Ionicons.glyphMap }[] = [
    { pagina: 'Avaliações', icone: 'star-outline' }, { pagina: 'Certificados', icone: 'ribbon-outline' }, { pagina: 'Assinaturas', icone: 'card-outline' }, { pagina: 'Pagamentos', icone: 'cash-outline' }, { pagina: 'Minha conta', icone: 'person-outline' },
  ];
  return <>
    <View style={styles.cabecalho}><View style={styles.avatar}><Text style={styles.avatarTexto}>{iniciais}</Text></View><Text style={styles.nome}>{usuario?.nome}</Text><Text style={styles.email}>{usuario?.email}</Text></View>
    <Text style={styles.secao}>Minha área</Text>
    {opcoes.map((opcao) => <TouchableOpacity key={opcao.pagina} style={styles.opcao} onPress={() => onAbrir(opcao.pagina)}><Ionicons name={opcao.icone} size={22} color={cores.primaria} /><Text style={styles.opcaoTexto}>{opcao.pagina}</Text><Ionicons name="chevron-forward" size={20} color={cores.textoSuave} /></TouchableOpacity>)}
    
    <TouchableOpacity style={styles.botaoSair} onPress={onSair}><Ionicons name="log-out-outline" size={20} color={cores.branco} /><Text style={styles.botaoSairTexto}>SAIR DA CONTA</Text></TouchableOpacity>
  </>;
}

const styles = StyleSheet.create({
  cabecalho: { alignItems: 'center', paddingVertical: 14, gap: 5 }, avatar: { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria }, avatarTexto: { color: cores.sobrePrimaria, fontSize: 28, fontWeight: 'bold' }, nome: { color: cores.texto, fontSize: 22, fontWeight: 'bold' }, email: { color: cores.textoSuave },
  secao: { color: cores.texto, fontSize: 18, fontWeight: 'bold' }, opcao: { height: 53, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 10, backgroundColor: cores.superficie }, opcaoTexto: { flex: 1, color: cores.texto, fontWeight: 'bold' },
  infoCard: { padding: 18, gap: 6, borderRadius: 14, backgroundColor: cores.superficie }, infoRotulo: { color: cores.primaria, fontSize: 11, fontWeight: 'bold', letterSpacing: 1 }, infoValor: { color: cores.texto, fontSize: 18, fontWeight: 'bold' }, infoDescricao: { color: cores.textoSuave, lineHeight: 20 },
  botaoSair: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, backgroundColor: cores.erro }, botaoSairTexto: { color: cores.branco, fontWeight: 'bold' },
});
