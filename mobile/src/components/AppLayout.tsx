import { useState } from 'react';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AssinaturasPage, AvaliacoesPage, CertificadosPage, ContaPage, CursosPage, JornadaPage, PagamentosPage, PerfilPage } from '../classes/Aluno/AreaAluno';
import type { PaginaAluno } from '../classes/Aluno/Perfil';
import { useUser } from '../classes/Usuario/AuthContext';
import type { RootStackParamList } from '../navigation/types';
import { Dashboard } from '../pages/Dashboard';
import { cores } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Principal'>;
type Pagina = 'Início' | 'Cursos' | 'Jornada' | 'Perfil' | PaginaAluno;
type IconName = ComponentProps<typeof Ionicons>['name'];
type PaginaMenu = 'Início' | 'Cursos' | 'Jornada' | 'Perfil';

const paginas: Pagina[] = ['Início', 'Cursos', 'Jornada', 'Perfil', 'Avaliações', 'Certificados', 'Assinaturas', 'Pagamentos', 'Minha conta'];
const icones: Record<PaginaMenu, IconName> = { Início: 'home', Cursos: 'book', Jornada: 'stats-chart', Perfil: 'person' };

export default function AppLayout({ navigation }: Props) {
  const { usuario, sair } = useUser();
  const [pagina, setPagina] = useState<Pagina>('Início');

  function mudarPagina(passos: number): void {
    const atual = paginas.indexOf(pagina);
    setPagina(paginas[(atual + passos + paginas.length) % paginas.length]);
  }

  function encerrarSessao(): void {
    sair();
    navigation.replace('Login');
  }

  function renderPagina() {
    if (pagina === 'Cursos') return <CursosPage />;
    if (pagina === 'Jornada') return <JornadaPage />;
    if (pagina === 'Avaliações') return <AvaliacoesPage />;
    if (pagina === 'Certificados') return <CertificadosPage />;
    if (pagina === 'Assinaturas') return <AssinaturasPage />;
    if (pagina === 'Pagamentos') return <PagamentosPage />;
    if (pagina === 'Minha conta') return <ContaPage />;
    if (pagina === 'Perfil') return <PerfilPage usuario={usuario} onSair={encerrarSessao} onAbrir={setPagina} />;
    return <Dashboard nome={usuario?.nome.split(' ')[0] || 'Aluno'} onContinuar={() => setPagina('Jornada')} />;
  }

  return <View style={styles.tela}>
    {/* BLOCO 1: navegação e título, com largura máxima e altura fixa */}
    <View style={styles.cabecalho}>
      <TouchableOpacity style={styles.botaoSeta} onPress={() => mudarPagina(-1)} accessibilityLabel="Página anterior"><Ionicons name="chevron-back" size={25} color={cores.primaria} /></TouchableOpacity>
      <Text style={styles.titulo}>{pagina}</Text>
      <TouchableOpacity style={styles.botaoSeta} onPress={() => mudarPagina(1)} accessibilityLabel="Próxima página"><Ionicons name="chevron-forward" size={25} color={cores.primaria} /></TouchableOpacity>
    </View>

    {/* BLOCO 2: conteúdo rolável */}
    <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>{renderPagina()}</ScrollView>

    {/* BLOCO 3: menu fixo do aplicativo, com largura máxima e altura fixa */}
    <View style={styles.menu}>
      {(['Início', 'Cursos', 'Jornada', 'Perfil'] as PaginaMenu[]).map((item) => <TouchableOpacity key={item} style={styles.menuItem} onPress={() => setPagina(item)}>
        <Ionicons name={pagina === item ? icones[item] : `${icones[item]}-outline` as IconName} size={22} color={pagina === item ? cores.primaria : cores.textoSuave} />
        <Text style={[styles.menuTexto, pagina === item && styles.menuTextoAtivo]}>{item}</Text>
      </TouchableOpacity>)}
    </View>
  </View>;
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { width: '100%', maxWidth: 720, height: 68, alignSelf: 'center', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: cores.superficie, borderBottomWidth: 2, borderBottomColor: cores.primaria },
  botaoSeta: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: cores.texto, fontSize: 18, fontWeight: 'bold' },
  scroll: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  conteudo: { padding: 20, paddingBottom: 28, gap: 14 },
  menu: { width: '100%', maxWidth: 720, height: 72, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: cores.borda, backgroundColor: cores.superficie },
  menuItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  menuTexto: { color: cores.textoSuave, fontSize: 11 },
  menuTextoAtivo: { color: cores.primaria, fontWeight: 'bold' },
});
