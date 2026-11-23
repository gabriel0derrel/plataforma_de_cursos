import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { cores } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';
import { useUser } from './AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

interface FormRegistro { nome: string; email: string; senha: string; confirmar: string; }

export default function Register({ navigation }: Props) {
  const { cadastrar } = useUser();
  const [form, setForm] = useState<FormRegistro>({ nome: '', email: '', senha: '', confirmar: '' });

  function alterar(campo: keyof FormRegistro, valor: string): void {
    setForm({ ...form, [campo]: valor });
  }

  async function handleRegistrar(): Promise<void> {
    if (!form.nome.trim() || !form.email.trim() || !form.senha) {
      alert('Preencha todos os campos.');
      return;
    }
    if (form.senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (form.senha !== form.confirmar) {
      alert('As senhas não conferem.');
      return;
    }
    try {
      await cadastrar({ nome: form.nome.trim(), email: form.email.trim(), senha: form.senha });
      navigation.replace('Principal');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Não foi possível criar a conta.');
    }
  }

  return <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.tela}>
      {/* BLOCO 1: navegação e título fixos */}
      <View style={styles.cabecalho}>
        <TouchableOpacity style={styles.botaoSeta} onPress={() => navigation.goBack()} accessibilityLabel="Voltar para login"><Ionicons name="chevron-back" size={25} color={cores.primaria} /></TouchableOpacity>
        <Text style={styles.tituloBarra}>Criar conta</Text>
        <View style={styles.espacoSeta} />
      </View>

      {/* BLOCO 2: formulário rolável */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Sua jornada começa aqui</Text>
        <Text style={styles.subtitulo}>Cadastre uma conta de aluno para estudar pelo aplicativo.</Text>
        <TextInput style={styles.input} placeholder="Nome completo" placeholderTextColor={cores.textoSuave} value={form.nome} onChangeText={(valor) => alterar('nome', valor)} />
        <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={cores.textoSuave} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} value={form.email} onChangeText={(valor) => alterar('email', valor)} />
        <TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" placeholderTextColor={cores.textoSuave} secureTextEntry value={form.senha} onChangeText={(valor) => alterar('senha', valor)} />
        <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor={cores.textoSuave} secureTextEntry value={form.confirmar} onChangeText={(valor) => alterar('confirmar', valor)} />
        <TouchableOpacity style={styles.botao} onPress={handleRegistrar}><Text style={styles.botaoTexto}>CADASTRAR</Text></TouchableOpacity>
      </ScrollView>

      {/* BLOCO 3: rodapé fixo */}
      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>Já tem conta? </Text>
        <Text style={styles.link} onPress={() => navigation.goBack()}>Entrar</Text>
      </View>
    </View>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalho: { width: '100%', maxWidth: 720, height: 68, alignSelf: 'center', paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: cores.superficie, borderBottomWidth: 2, borderBottomColor: cores.primaria },
  botaoSeta: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  espacoSeta: { width: 44, height: 44 },
  tituloBarra: { color: cores.texto, fontSize: 18, fontWeight: 'bold' },
  scroll: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 12 },
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' },
  subtitulo: { color: cores.textoSuave, lineHeight: 21, marginBottom: 10 },
  input: { height: 50, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficie, color: cores.texto },
  botao: { height: 50, marginTop: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: cores.primaria },
  botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold', fontSize: 16 },
  rodape: { width: '100%', maxWidth: 720, height: 68, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: cores.superficie, borderTopWidth: 1, borderTopColor: cores.borda },
  rodapeTexto: { color: cores.textoSuave },
  link: { color: cores.primaria, fontWeight: 'bold' },
});
