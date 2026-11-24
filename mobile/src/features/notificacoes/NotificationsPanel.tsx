import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NotificacaoMobile } from './notificacoesApi';
import { cores } from '../../colors';

export function NotificationsPanel({ visible, notificacoes, onClose, onAbrir }: { visible: boolean; notificacoes: NotificacaoMobile[]; onClose: () => void; onAbrir: (notificacao: NotificacaoMobile) => void }) {
  return <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
    <Pressable style={styles.fundo} onPress={onClose}>
      <Pressable style={styles.painel} onPress={() => undefined}>
        <View style={styles.cabecalho}><Text style={styles.titulo}>Notificações</Text><TouchableOpacity style={styles.fechar} onPress={onClose} accessibilityLabel="Fechar notificações"><Ionicons name="close" size={24} color={cores.primaria} /></TouchableOpacity></View>
        <ScrollView contentContainerStyle={styles.lista} showsVerticalScrollIndicator={false}>
          {notificacoes.length === 0 ? <Text style={styles.vazio}>Você não possui notificações.</Text> : null}
          {notificacoes.map((notificacao) => <TouchableOpacity key={notificacao.ID_Notificacao} style={[styles.item, !notificacao.Lida && styles.itemNaoLida]} onPress={() => onAbrir(notificacao)}>
            <View style={styles.icone}><Ionicons name={iconePorTipo[notificacao.Tipo] || 'notifications-outline'} size={20} color={cores.sobrePrimaria} /></View>
            <View style={styles.textos}><Text style={styles.itemTitulo}>{notificacao.Titulo}</Text><Text style={styles.mensagem}>{notificacao.Mensagem}</Text><Text style={styles.data}>{new Date(notificacao.DataCriacao).toLocaleString('pt-BR')}</Text></View>
          </TouchableOpacity>)}
        </ScrollView>
      </Pressable>
    </Pressable>
  </Modal>;
}

const iconePorTipo: Record<string, keyof typeof Ionicons.glyphMap> = {
  'conta-criada': 'person-add-outline', login: 'log-in-outline', 'aula-concluida': 'checkmark-circle-outline', 'curso-concluido': 'ribbon-outline', 'novo-curso': 'book-outline',
};

const styles = StyleSheet.create({
  fundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.65)' },
  painel: { maxHeight: '80%', paddingTop: 16, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: cores.fundo },
  cabecalho: { minHeight: 52, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: cores.borda },
  titulo: { color: cores.texto, fontSize: 20, fontWeight: 'bold' }, fechar: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: 16, gap: 10 }, vazio: { color: cores.textoSuave, textAlign: 'center', paddingVertical: 30 },
  item: { flexDirection: 'row', gap: 11, padding: 13, borderRadius: 12, backgroundColor: cores.superficie }, itemNaoLida: { borderLeftWidth: 4, borderLeftColor: cores.primaria },
  icone: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria }, textos: { flex: 1, gap: 3 }, itemTitulo: { color: cores.texto, fontWeight: 'bold' }, mensagem: { color: cores.textoSuave, lineHeight: 19 }, data: { color: cores.primaria, fontSize: 11 },
});
