import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppointmentTimeline } from '@/src/components/AppointmentTimeline';
import { Button, Pill, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { cancelAppointment, getAppointment } from '@/src/services/api';
import { confirmar, notify } from '@/src/lib/dialog';
import { formatBRL } from '@/src/lib/format';
import type { Appointment } from '@/src/types';

export default function AppointmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => { try { setAppointment(await getAppointment(String(id))); } catch {} }, [id]);
  useEffect(() => { load(); }, [load]);
  const aguardando = !appointment || appointment.status === 'PROCESSANDO';
  useEffect(() => { if (!aguardando) return; const timer = setInterval(load, 2000); return () => clearInterval(timer); }, [load, aguardando]);

  function cancelar() {
    if (!appointment) return;
    confirmar('Cancelar agendamento', 'O horário voltará a ficar disponível para outras pessoas.', async () => {
      setBusy(true);
      try { setAppointment(await cancelAppointment(appointment.id)); }
      catch (e) { notify('Não foi possível cancelar', e instanceof Error ? e.message : 'Tente novamente.'); }
      finally { setBusy(false); }
    }, 'Cancelar agendamento');
  }

  if (!appointment) return <Screen><ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /></Screen>;
  const isConfirmed = appointment.status === 'CONFIRMADO';
  const isCancelled = appointment.status === 'CANCELADO' || appointment.status === 'REJEITADO';

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}><Text style={styles.kicker}>ACOMPANHAMENTO</Text><Text style={styles.title}>Seu agendamento</Text></View>
          <Pill text={appointment.status} tone={isConfirmed ? 'green' : isCancelled ? 'red' : 'orange'} />
        </View>

        <View style={styles.mainCard}>
          <View style={styles.iconBlock}><Text style={styles.icon}>✦</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.service}>{appointment.serviceName}</Text>
            <Text style={styles.id}>#{appointment.id}{appointment.valor != null ? ` · ${formatBRL(appointment.valor)}` : ''}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detail}><View style={styles.detailIcon}><Text>◷</Text></View><View style={{ flex: 1 }}><Text style={styles.detailLabel}>Data e horário</Text><Text style={styles.detailValue}>{new Date(`${appointment.data}T12:00:00`).toLocaleDateString('pt-BR')} às {appointment.hora}</Text></View></View>
          <View style={styles.detail}><View style={styles.detailIcon}><Text>○</Text></View><View style={{ flex: 1 }}><Text style={styles.detailLabel}>Profissional</Text><Text style={styles.detailValue}>{appointment.profissional}</Text></View></View>
          <View style={styles.detail}><View style={styles.detailIcon}><Text>⌖</Text></View><View style={{ flex: 1 }}><Text style={styles.detailLabel}>Local</Text><Text style={styles.detailValue}>{appointment.local}</Text></View></View>
        </View>

        <AppointmentTimeline status={appointment.status} motivo={appointment.motivo} />
        {!isCancelled ? <View style={{ marginBottom: 4 }}><Button title="Cancelar agendamento" variant="danger" loading={busy} onPress={cancelar} /></View> : null}
        <Button title="Voltar para serviços" variant="secondary" onPress={() => router.replace('/(tabs)')} icon="←" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 20, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 10 },
  kicker: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 4, letterSpacing: -0.5 },
  mainCard: { backgroundColor: colors.dark, borderRadius: radius.xl, padding: 16, flexDirection: 'row', alignItems: 'center', ...shadow.floating },
  iconBlock: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  icon: { color: colors.white, fontSize: 22, fontWeight: '900' },
  service: { color: colors.white, fontSize: 17, fontWeight: '900' },
  id: { color: '#AEB2C1', fontSize: 10, marginTop: 3 },
  detailCard: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, marginVertical: 11 },
  detail: { flexDirection: 'row', gap: 11, alignItems: 'center', paddingVertical: 6 },
  detailIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  detailIconText: { color: colors.primaryDark },
  detailLabel: { color: colors.muted, fontSize: 9 },
  detailValue: { color: colors.text, fontSize: 12, fontWeight: '800', marginTop: 2 },
});
