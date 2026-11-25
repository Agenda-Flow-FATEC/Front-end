import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Pill, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { notify } from '@/src/lib/dialog';
import { createAppointment, getAvailableSlots, getService } from '@/src/services/api';
import type { Service, TimeSlot } from '@/src/types';

function datePlus(days: number) { const d = new Date(); d.setDate(d.getDate() + days); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`; }

export default function BookingScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState(datePlus(1));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selected, setSelected] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const dates = useMemo(() => Array.from({ length: 5 }, (_, i) => datePlus(i + 1)), []);

  useEffect(() => { getService(String(serviceId)).then(setService).catch(() => undefined); }, [serviceId]);
  useEffect(() => {
    setLoading(true); setLoadError('');
    getAvailableSlots(String(serviceId), date).then(setSlots).catch((e) => { setSlots([]); setLoadError(e instanceof Error ? e.message : 'Não foi possível carregar os horários.'); }).finally(() => setLoading(false));
    setSelected(null);
  }, [serviceId, date]);

  async function submit() {
    if (!user || !selected || submitting) return;
    setSubmitting(true);
    try { const appt = await createAppointment({ clienteId: user.id, serviceId: String(serviceId), slotId: selected.id, data: selected.data, hora: selected.hora }); router.replace({ pathname: '/appointment/[id]', params: { id: appt.id } }); }
    catch (e) { notify('Horário indisponível', e instanceof Error ? e.message : 'Não foi possível reservar.'); }
    finally { setSubmitting(false); }
  }

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backArrow}>‹</Text><Text style={styles.backLabel}>Voltar</Text></Pressable>
        <Text style={styles.kicker}>RESERVA</Text>
        <Text style={styles.title}>Escolha seu horário</Text>

        {service ? <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}><Text style={styles.serviceIconText}>✦</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.serviceName}>{service.nome}</Text><Text style={styles.serviceMeta}>{service.profissional} · {service.duracaoMinutos} min</Text><View style={{ marginTop: 8 }}><Pill text={service.local} tone="gray" icon="⌖" /></View></View>
        </View> : <View style={styles.serviceLoading}><ActivityIndicator color={colors.primary} /></View>}

        <Text style={styles.section}>1. Data</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dates.map((d) => <Pressable key={d} onPress={() => setDate(d)} style={[styles.dateCard, date === d && styles.dateActive]}>
            <Text style={[styles.dateDay, date === d && styles.dateTextActive]}>{new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</Text>
            <Text style={[styles.dateNum, date === d && styles.dateTextActive]}>{new Date(`${d}T12:00:00`).getDate()}</Text>
            <Text style={[styles.dateMonth, date === d && styles.dateTextActive]}>{new Date(`${d}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</Text>
          </Pressable>)}
        </ScrollView>

        <Text style={styles.section}>2. Horário</Text>
        {loading ? <View style={styles.slotLoading}><ActivityIndicator color={colors.primary} /><Text style={styles.muted}>Carregando horários...</Text></View> : slots.length === 0 ? <View style={styles.slotLoading}><Text style={styles.muted}>{loadError || 'Nenhum horário aberto para esta data.'}</Text></View> : <View style={styles.grid}>{slots.map((slot) => <Pressable disabled={!slot.disponivel} key={slot.id} onPress={() => setSelected(slot)} style={[styles.slot, !slot.disponivel && styles.slotDisabled, selected?.id === slot.id && styles.slotActive]}><Text style={[styles.slotText, selected?.id === slot.id && styles.slotTextActive]}>{slot.hora}</Text><Text style={[styles.slotCaption, selected?.id === slot.id && styles.slotTextActive]}>{slot.disponivel ? 'Livre' : 'Ocupado'}</Text></Pressable>)}</View>}

        <View style={styles.note}><Text style={styles.noteIcon}>✓</Text><View style={{ flex: 1 }}><Text style={styles.noteTitle}>Reserva protegida</Text><Text style={styles.noteText}>Se outra pessoa escolher o mesmo horário primeiro, o backend mantém a consistência da reserva.</Text></View></View>
        <Button title={selected ? `Confirmar ${selected.hora}` : 'Selecione um horário'} onPress={submit} loading={submitting} disabled={!selected} icon="→" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backArrow: { color: colors.primary, fontSize: 28, lineHeight: 28, marginRight: 4, fontWeight: '900', marginTop: -5 },
  backLabel: { color: colors.text, fontWeight: '900', fontSize: 12 },
  kicker: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  title: { fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 4, marginBottom: 18, letterSpacing: -0.5 },
  serviceLoading: { height: 82, backgroundColor: colors.surface, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  serviceCard: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, padding: 13, flexDirection: 'row', alignItems: 'center', ...shadow.card },
  serviceIcon: { width: 56, height: 56, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  serviceIconText: { color: colors.white, fontSize: 22, fontWeight: '900' },
  serviceName: { color: colors.text, fontSize: 15, fontWeight: '900' },
  serviceMeta: { color: colors.muted, fontSize: 10, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 24, marginBottom: 11 },
  dateRow: { paddingRight: 4 },
  dateCard: { width: 70, paddingVertical: 11, borderRadius: 17, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', marginRight: 8 },
  dateActive: { backgroundColor: colors.primary, borderColor: colors.primary, ...shadow.card },
  dateDay: { color: colors.muted, textTransform: 'uppercase', fontSize: 9, fontWeight: '900' },
  dateNum: { fontSize: 23, color: colors.text, fontWeight: '900', marginTop: 2 },
  dateMonth: { color: colors.muted, fontSize: 9, marginTop: 2, textTransform: 'uppercase' },
  dateTextActive: { color: colors.white },
  slotLoading: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 18, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', gap: 9, alignItems: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  slot: { width: '31%', minHeight: 62, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  slotActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  slotDisabled: { opacity: 0.38 },
  slotText: { color: colors.text, fontWeight: '900', fontSize: 12 },
  slotTextActive: { color: colors.primaryDark },
  slotCaption: { fontSize: 9, color: colors.muted, marginTop: 3 },
  note: { flexDirection: 'row', gap: 10, backgroundColor: colors.warningSoft, borderRadius: 15, padding: 12, marginTop: 16 },
  noteIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#FFFFFF99', color: colors.warning, textAlign: 'center', textAlignVertical: 'center', paddingTop: 6, fontWeight: '900' },
  noteTitle: { color: '#7A4E0A', fontSize: 11, fontWeight: '900' },
  noteText: { color: '#7A4E0A', fontSize: 10, lineHeight: 15, marginTop: 3 },
  muted: { color: colors.muted, fontSize: 11, flex: 1 },
});
