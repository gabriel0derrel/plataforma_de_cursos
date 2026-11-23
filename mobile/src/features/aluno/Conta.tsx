import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { alunoService } from './alunoApi';
import { cores } from '../../colors';

export function ContaPage() {
  const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [senha, setSenha] = useState(''); const [erro, setErro] = useState(''); const [aviso, setAviso] = useState(''); const [carregando, setCarregando] = useState(true);
  const carregar = useCallback(async () => { try { setCarregando(true); const conta = await alunoService.conta(); setNome(conta.NomeCompleto); setEmail(conta.Email); setErro(''); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar sua conta.'); } finally { setCarregando(false); } }, []);
  useEffect(() => { carregar(); }, [carregar]);
  async function salvar(): Promise<void> { try { await alunoService.atualizarConta({ NomeCompleto: nome, Senha: senha || undefined }); setSenha(''); setAviso('Dados atualizados com sucesso.'); setErro(''); } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível atualizar a conta.'); } }
  return <>
    <Text style={styles.titulo}>Minha conta</Text><Text style={styles.subtitulo}>Atualize os seus dados pessoais.</Text>
    {erro ? <Text style={styles.erro}>{erro}</Text> : null}{aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}{carregando ? <ActivityIndicator color={cores.primaria} /> : null}
    <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" placeholderTextColor={cores.textoSuave} />
    <TextInput style={[styles.input, styles.inputBloqueado]} value={email} editable={false} placeholder="E-mail" placeholderTextColor={cores.textoSuave} />
    <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Nova senha (opcional)" placeholderTextColor={cores.textoSuave} />
    <TouchableOpacity style={styles.botao} onPress={salvar}><Text style={styles.botaoTexto}>SALVAR DADOS</Text></TouchableOpacity>
  </>;
}

const styles = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 25, fontWeight: 'bold' }, subtitulo: { color: cores.textoSuave, lineHeight: 21 }, erro: { color: cores.erro, lineHeight: 20 }, aviso: { color: cores.primaria, lineHeight: 20 },
  input: { height: 50, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.superficie, color: cores.texto }, inputBloqueado: { color: cores.textoSuave },
  botao: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: cores.primaria }, botaoTexto: { color: cores.sobrePrimaria, fontWeight: 'bold' },
});
