import { useState } from 'react';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { AuthShell } from '@/src/components/AuthShell';
import { Button, Input } from '@/src/components/ui';
import { colors } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { notify } from '@/src/lib/dialog';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!nome || !email || senha.length < 6) return notify('Dados inválidos', 'Informe nome, e-mail e senha de no mínimo 6 caracteres.');
    setLoading(true);
    try { await signUp(nome, email, senha); }
    catch (e) { notify('Cadastro não realizado', e instanceof Error ? e.message : 'Não foi possível cadastrar.'); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell
      eyebrow="CRIAR CONTA"
      title="Comece a organizar seus horários."
      subtitle="Crie sua conta e tenha seus serviços, reservas e agenda reunidos em um só lugar."
      footer={<Link href="/(auth)/login" style={styles.link}>Já tenho uma conta</Link>}
    >
      <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" leftIcon="○" />
      <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="voce@email.com" leftIcon="@" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Mínimo 6 caracteres" leftIcon="•" />
      <Button title="Criar conta" onPress={submit} loading={loading} icon="✓" />
    </AuthShell>
  );
}

const styles = StyleSheet.create({ link: { color: colors.primaryDark, fontWeight: '900', textAlign: 'center', marginTop: 16, fontSize: 12 } });