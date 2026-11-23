import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AssinaturasPage } from './features/aluno/Assinaturas';
import { AulasCursoPage } from './features/aluno/AulasCurso';
import { AvaliacoesPage } from './features/aluno/Avaliacoes';
import { CertificadosPage } from './features/aluno/Certificados';
import { ContaPage } from './features/aluno/Conta';
import { CursosPage } from './features/aluno/Cursos';
import { JornadaPage } from './features/aluno/Jornada';
import { PagamentosPage } from './features/aluno/Pagamentos';
import { PerfilPage } from './features/aluno/Perfil';
import type { PaginaAluno } from './features/aluno/Perfil';
import { useUser } from './features/autenticacao/AuthContext';
import type { RootStackParamList } from './navigation/navigationTypes';
import { Dashboard } from './Dashboard';
import { cores } from './colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Principal'>;
type PaginaMenu = 'Início' | 'Cursos' | 'Jornada' | 'Perfil';
type Pagina = PaginaMenu | PaginaAluno | 'Aulas do curso';
type Tela = { pagina: Pagina; curso?: string };
type IconName = ComponentProps<typeof Ionicons>['name'];

const icones: Record<PaginaMenu, IconName> = { Início: 'home', Cursos: 'book', Jornada: 'stats-chart', Perfil: 'person' };

export default function AppLayout({ navigation }: Props) {
  const { usuario, sair } = useUser();
  const [tela, setTela] = useState<Tela>({ pagina: 'Início' });
  const [historico, setHistorico] = useState<Tela[]>([]);

  function navegar(proxima: Tela): void {
    if (proxima.pagina === tela.pagina && proxima.curso === tela.curso) return;
    setHistorico((itens) => [...itens, tela]);
    setTela(proxima);
  }

  function voltar(): void {
    const anterior = historico[historico.length - 1];
    if (!anterior) return;
    setTela(anterior);
    setHistorico((itens) => itens.slice(0, -1));
  }

  function encerrarSessao(): void {
    sair();
    navigation.replace('Login');
  }

  function renderPagina() {
    if (tela.pagina === 'Cursos') return <CursosPage />;
    if (tela.pagina === 'Jornada') return <JornadaPage onSelecionarCurso={(curso) => navegar({ pagina: 'Aulas do curso', curso })} />;
    if (tela.pagina === 'Aulas do curso') return <AulasCursoPage curso={tela.curso || ''} />;
    if (tela.pagina === 'Avaliações') return <AvaliacoesPage />;
    if (tela.pagina === 'Certificados') return <CertificadosPage />;
    if (tela.pagina === 'Assinaturas') return <AssinaturasPage />;
    if (tela.pagina === 'Pagamentos') return <PagamentosPage />;
    if (tela.pagina === 'Minha conta') return <ContaPage />;
    if (tela.pagina === 'Perfil') return <PerfilPage usuario={usuario} onSair={encerrarSessao} onAbrir={(pagina) => navegar({ pagina })} />;
    return <Dashboard nome={usuario?.nome.split(' ')[0] || 'Aluno'} onContinuar={() => navegar({ pagina: 'Jornada' })} />;
  }

  return <View style={styles.tela}>
    {/* BLOCO 1: apenas a seta de retorno e o título da tela atual */}
    <View style={styles.cabecalho}>
      {historico.length > 0 ? <TouchableOpacity style={styles.botaoSeta} onPress={voltar} accessibilityLabel="Voltar"><Ionicons name="chevron-back" size={25} color={cores.primaria} /></TouchableOpacity> : <View style={styles.espacoSeta} />}
      <Text style={styles.titulo}>{tela.pagina === 'Aulas do curso' ? tela.curso : tela.pagina}</Text>
      <View style={styles.espacoSeta} />
    </View>

    {/* BLOCO 2: conteúdo rolável */}
    <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>{renderPagina()}</ScrollView>

    {/* BLOCO 3: menu fixo */}
    <View style={styles.menu}>
      {(['Início', 'Cursos', 'Jornada', 'Perfil'] as PaginaMenu[]).map((item) => <TouchableOpacity key={item} style={styles.menuItem} onPress={() => navegar({ pagina: item })}>
        <Ionicons name={tela.pagina === item ? icones[item] : `${icones[item]}-outline` as IconName} size={22} color={tela.pagina === item ? cores.primaria : cores.textoSuave} />
        <Text style={[styles.menuTexto, tela.pagina === item && styles.menuTextoAtivo]}>{item}</Text>
      </TouchableOpacity>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { width: '100%', maxWidth: 720, height: 68, alignSelf: 'center', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: cores.superficie, borderBottomWidth: 2, borderBottomColor: cores.primaria },
  botaoSeta: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, espacoSeta: { width: 44, height: 44 }, titulo: { flex: 1, color: cores.texto, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  scroll: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' }, conteudo: { padding: 20, paddingBottom: 28, gap: 14 },
  menu: { width: '100%', maxWidth: 720, height: 72, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: cores.borda, backgroundColor: cores.superficie }, menuItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 }, menuTexto: { color: cores.textoSuave, fontSize: 11 }, menuTextoAtivo: { color: cores.primaria, fontWeight: 'bold' },
});
