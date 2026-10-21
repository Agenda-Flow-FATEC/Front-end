import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { EmptyState, Pill, Screen, SectionTitle } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { listAppointments } from '@/src/services/api';
import type { Appointment } from '@/src/types';

export default function AgendaScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try { setItems(await listAppointments(user.id)); }
    finally { setLoading(false); }
  }, [user]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <Screen padded={false}>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        contentContainerStyle={[styles.content, desktop && styles.contentDesktop]}
        ListHeaderComponent={
          <>
            <View style={[styles.header, desktop && styles.headerDesktop]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.kicker}>SEUS HORÁRIOS</Text>
                <Text style={styles.title}>Minha agenda</Text>
                <Text style={styles.subtitle}>Tudo o que você reservou, em um só lugar.</Text>
              </View>
              <View style={[styles.headerIcon, desktop && styles.headerIconDesktop]}><Text style={styles.headerIconText}>◷</Text></View>
            </View>
            {loading ? <View style={styles.loading}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Atualizando agenda...</Text></View> : null}
            <SectionTitle title="Agendamentos" />
          </>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: item.id } })} style={({ pressed }) => [styles.card, desktop && styles.cardDesktop, { opacity: pressed ? 0.94 : 1 }]}>
            <View style={styles.dateBlock}>
              <Text style={styles.month}>{new Date(`${item.data}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</Text>
              <Text style={styles.day}>{new Date(`${item.data}T12:00:00`).getDate()}</Text>
              <Text style={styles.time}>{item.hora}</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.serviceRow}>
                <Text style={styles.service} numberOfLines={1}>{item.serviceName}</Text>
                <Pill text={item.status} tone={item.status === 'CONFIRMADO' ? 'green' : item.status === 'CANCELADO' || item.status === 'REJEITADO' ? 'red' : 'orange'} />
              </View>
              <Text style={styles.detail}>● {item.profissional}</Text>
              <Text style={styles.detail}>⌖ {item.local}</Text>
              <View style={styles.openRow}><Text style={styles.open}>Ver detalhes</Text><Text style={styles.arrow}>→</Text></View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={!loading ? <EmptyState icon="◷" title="Nenhum agendamento ainda" description="Escolha um serviço e reserve seu próximo horário." /> : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 22, paddingBottom: 110 },
  contentDesktop: { paddingBottom: 42, paddingTop: 28 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  headerDesktop: { marginBottom: 28 },
  kicker: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: 4, letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 5, maxWidth: 285 },
  headerIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  headerIconDesktop: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#F2F1FF' },
  headerIconText: { color: colors.primaryDark, fontSize: 22, fontWeight: '900' },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 13 },
  loadingText: { color: colors.muted, fontSize: 11 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 10, flexDirection: 'row', marginBottom: 10, ...shadow.card },
  cardDesktop: { minHeight: 132, borderRadius: 16, padding: 11, marginBottom: 12, shadowOpacity: 0.03 },
  dateBlock: { width: 68, minHeight: 112, borderRadius: 15, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  month: { color: '#B8BBC8', fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  day: { color: colors.white, fontSize: 29, fontWeight: '900', marginTop: 2 },
  time: { color: '#D7D9E1', fontSize: 10, fontWeight: '800', marginTop: 3 },
  body: { flex: 1, paddingLeft: 12, paddingRight: 2, paddingVertical: 2 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  service: { color: colors.text, fontSize: 14, fontWeight: '900', flex: 1 },
  detail: { color: colors.muted, fontSize: 10, marginTop: 6 },
  openRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 9 },
  open: { color: colors.primaryDark, fontSize: 10, fontWeight: '900' },
  arrow: { color: colors.primary, fontSize: 15, fontWeight: '900' },
});
