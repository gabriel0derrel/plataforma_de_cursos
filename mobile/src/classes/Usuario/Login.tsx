import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';
import { useUser } from './AuthContext';

// Props recebidas automaticamente: navigation e route, já tipadas para a tela "Login"
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const { entrar } = useUser();
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

  async function handleLogin(): Promise<void> {
    try {
      await entrar(email, senha);
      navigation.replace('Principal');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível entrar.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.tela}>
        {/* BLOCO 1: cabeçalho fixo */}
        <View style={styles.cabecalho}>
          <TouchableOpacity disabled style={styles.setaDesabilitada}>
            <Ionicons name="chevron-back" size={24} color={cores.textoSuave} />
          </TouchableOpacity>
          <Text style={styles.tituloBarra}>Trek HyperLessons</Text>
          <TouchableOpacity disabled style={styles.setaDesabilitada}>
            <Ionicons name="chevron-forward" size={24} color={cores.textoSuave} />
          </TouchableOpacity>
        </View>

        {/* BLOCO 2: conteúdo rolável */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo}>
            <Text style={styles.logoTexto}>TH</Text>
          </View>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.subtitulo}>Entre para continuar seus estudos.</Text>
          <View style={styles.formulario}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={cores.textoSuave}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={cores.textoSuave}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
              <Text style={styles.botaoTexto}>ENTRAR</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* BLOCO 3: rodapé fixo */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Não tem conta? </Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Registro')}>
            Cadastre-se
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    width: '100%',
    maxWidth: 720,
    height: 68,
    alignSelf: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.superficie,
    borderBottomWidth: 2,
    borderBottomColor: cores.primaria,
  },
  setaDesabilitada: { width: 40, alignItems: 'center' },
  tituloBarra: { color: cores.primaria, fontSize: 15, fontWeight: 'bold' },
  scroll: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTexto: { color: cores.sobrePrimaria, fontSize: 26, fontWeight: 'bold' },
  titulo: { fontSize: 26, fontWeight: 'bold', color: cores.texto },
  subtitulo: { color: cores.textoSuave, textAlign: 'center', marginBottom: 16 },
  formulario: {
    width: '100%',
    gap: 12,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    color: cores.texto,
  },
  botao: {
    height: 50,
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold', fontSize: 16 },
  rodape: {
    width: '100%',
    maxWidth: 720,
    height: 68,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: cores.superficie,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  rodapeTexto: { color: cores.textoSuave },
  link: { color: cores.primaria, fontWeight: 'bold' },
});
