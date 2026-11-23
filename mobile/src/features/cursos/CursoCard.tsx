import { StyleSheet, Text, View } from 'react-native';
import type { Curso } from './Curso';
import { cores } from '../../colors';

export function CursoCard({ curso }: { curso: Curso }) {
  return <View style={styles.card}>
    <View style={[styles.capa, capas[curso.Nivel] || styles.capaPadrao]}><Text style={styles.capaTexto}>{curso.Titulo[0]}</Text></View>
    <View style={styles.informacoes}>
      <Text style={styles.titulo} numberOfLines={2}>{curso.Titulo}</Text>
      <Text style={styles.descricao} numberOfLines={2}>{curso.Descricao}</Text>
      <Text style={styles.meta}>{curso.TotalAulas} aulas · {curso.TotalHoras}h · {curso.Nivel}</Text>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 13, padding: 12, borderRadius: 14, borderLeftWidth: 5, borderLeftColor: cores.primaria, backgroundColor: cores.superficie },
  capa: { width: 70, height: 70, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  capaIniciante: { backgroundColor: cores.lilas }, capaIntermediario: { backgroundColor: cores.anakiwa }, capaAvancado: { backgroundColor: cores.hopbush }, capaPadrao: { backgroundColor: cores.laranja },
  capaTexto: { color: cores.preto, fontSize: 29, fontWeight: 'bold' },
  informacoes: { flex: 1, justifyContent: 'center', gap: 3 },
  titulo: { color: cores.texto, fontSize: 16, fontWeight: 'bold' },
  descricao: { color: cores.textoSuave, fontSize: 13 },
  meta: { color: cores.primaria, fontSize: 12 },
});

const capas: Record<string, object> = { Iniciante: styles.capaIniciante, Intermediario: styles.capaIntermediario, Avancado: styles.capaAvancado };
