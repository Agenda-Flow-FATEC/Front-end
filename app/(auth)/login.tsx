import { useState } from 'react';
import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { AuthShell } from '@/src/components/AuthShell';
import { Button, Input } from '@/src/components/ui';
import { colors, radius } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { notify } from '@/src/lib/dialog';
import { MOCK_MODE } from '@/src/services/api';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email || !senha) return notify('Preencha os campos', 'Informe e-mail e senha.');
    setLoading(true);
    try { await signIn(email, senha); }
    catch (e) { notify('Login não realizado', e instanceof Error ? e.message : 'Não foi possível entrar.'); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell
      eyebrow="BEM-VINDO DE VOLTA"
      title="Agende sem complicação."
      subtitle="Escolha um serviço, reserve seu horário e acompanhe tudo pelo app."
      footer={<Link href="/(auth)/register" style={styles.link}>Ainda não tenho conta</Link>}
    >
      <Input label="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="voce@email.com" leftIcon="@" />
      <Input label="Senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Sua senha" leftIcon="•" />
      <Button title="Entrar" onPress={submit} loading={loading} icon="→" />
      {MOCK_MODE ? <View style={styles.demo}><Text style={styles.demoTitle}>Modo demonstração</Text><Text style={styles.demoText}>Use qualquer e-mail e senha. Para testar a área admin, use um e-mail que contenha “admin”.</Text></View> : null}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.primaryDark, fontWeight: '900', textAlign: 'center', marginTop: 16, fontSize: 12 },
  demo: { marginTop: 14, backgroundColor: colors.infoSoft, borderRadius: radius.md, padding: 12 },
  demoTitle: { color: colors.info, fontWeight: '900', fontSize: 11 },
  demoText: { color: '#294A78', fontSize: 10, lineHeight: 16, marginTop: 3 },
});
