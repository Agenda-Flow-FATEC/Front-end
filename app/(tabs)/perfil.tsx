import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Button, Card, Pill, Screen, SectionTitle } from '@/src/components/ui';
import { colors, radius, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { confirmar } from '@/src/lib/dialog';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  return (
    <Screen>
      <ScrollView contentContainerStyle={[styles.content, desktop && styles.contentDesktop]}>
        <View style={styles.heading}>
          <Text style={styles.kicker}>CONTA</Text>
          <Text style={styles.title}>Meu perfil</Text>
        </View>

        <Card style={[styles.profileCard, desktop && styles.profileCardDesktop]}>
          <View style={[styles.profileTop, desktop && styles.profileTopDesktop]}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{user?.nome?.slice(0, 1).toUpperCase() || 'A'}</Text></View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.name}>{user?.nome}</Text>
              <Text style={styles.email}>{user?.email}</Text>
              <Pill text={user?.role || 'COMUM'} tone={user?.role === 'ADMIN' ? 'blue' : 'gray'} />
            </View>
          </View>
          <View style={[styles.divider, desktop && styles.dividerDesktop]} />
          <View style={[styles.accountLine, desktop && styles.accountLineDesktop]}>
            <View><Text style={styles.metaLabel}>Status</Text><Text style={styles.metaValue}>Ativo</Text></View>
            <View><Text style={styles.metaLabel}>Acesso</Text><Text style={styles.metaValue}>24/7</Text></View>
          </View>
        </Card>

        <SectionTitle title="Sobre o AgendaFlow" />
        <View style={[styles.infoCard, desktop && styles.infoCardDesktop]}>
          <View style={styles.infoIcon}><Text style={styles.infoIconText}>✦</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Uma agenda simples por dentro</Text>
            <Text style={styles.infoText}>O app envia sua solicitação ao backend e acompanha a confirmação de forma assíncrona.</Text>
          </View>
        </View>

        {desktop ? (
          <View style={styles.actionBoxDesktop}>
            <Button title="Encerrar sessão" variant="danger" onPress={() => confirmar('Sair', 'Deseja encerrar a sessão?', () => void signOut(), 'Sair')} />
          </View>
        ) : (
          <Button title="Encerrar sessão" variant="danger" onPress={() => confirmar('Sair', 'Deseja encerrar a sessão?', () => void signOut(), 'Sair')} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 110 },
  contentDesktop: { paddingBottom: 42, paddingTop: 8 },
  heading: { marginBottom: 20 },
  kicker: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 29, fontWeight: '900', color: colors.text, marginTop: 4, letterSpacing: -0.5 },
  profileCard: { padding: 18, borderRadius: radius.xl },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  profileTopDesktop: { minHeight: 102 },
  avatar: { width: 64, height: 64, borderRadius: 21, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: '900' },
  name: { color: colors.text, fontWeight: '900', fontSize: 18 },
  email: { color: colors.muted, marginTop: 3, marginBottom: 8, fontSize: 11 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 17 },
  dividerDesktop: { marginVertical: 20 },
  accountLine: { flexDirection: 'row', gap: 46 },
  accountLineDesktop: { gap: 70 },
  metaLabel: { color: colors.subtle, fontSize: 10 },
  metaValue: { color: colors.text, fontSize: 13, fontWeight: '900', marginTop: 3 },
  infoCard: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 15 },
  profileCardDesktop: { borderRadius: 18, padding: 20 },
  infoCardDesktop: { padding: 16, borderRadius: 16 },
  actionBoxDesktop: { width: 210, alignSelf: 'flex-start' },
  infoIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  infoIconText: { color: colors.primaryDark, fontSize: 16, fontWeight: '900' },
  infoTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  infoText: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 4 },
});
