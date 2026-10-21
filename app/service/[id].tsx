import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Pill, Screen } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { getService } from '@/src/services/api';
import type { Service } from '@/src/types';
import { formatBRL } from '@/src/lib/format';

export default function ServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  useEffect(() => { getService(String(id)).then(setService).catch(() => undefined); }, [id]);
  if (!service) return <Screen><ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} /></Screen>;

  return (
    <Screen padded={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backArrow}>‹</Text><Text style={styles.backLabel}>Voltar</Text></Pressable>
        <View style={styles.hero}>
          <View style={styles.heroOrb}><Text style={styles.heroIcon}>✦</Text></View>
          <View style={{ flex: 1 }}>
            <Pill text={service.categoria} tone="blue" />
            <Text style={styles.heroTitle}>{service.nome}</Text>
            <Text style={styles.heroSub}>{service.profissional}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.meta}><Text style={styles.metaIcon}>◷</Text><Text style={styles.metaTitle}>{service.duracaoMinutos} min</Text><Text style={styles.metaLabel}>Duração</Text></View>
          <View style={styles.meta}><Text style={styles.metaIcon}>⌖</Text><Text style={styles.metaTitle} numberOfLines={1}>{service.local}</Text><Text style={styles.metaLabel}>Local</Text></View>
          <View style={styles.meta}><Text style={styles.metaIcon}>R$</Text><Text style={styles.metaTitle}>{service.preco != null ? formatBRL(service.preco) : 'A consultar'}</Text><Text style={styles.metaLabel}>Valor</Text></View>
        </View>

        <View style={styles.sectionBlock}><Text style={styles.section}>Sobre o serviço</Text><Text style={styles.description}>{service.descricao}</Text></View>
        <View style={styles.note}><Text style={styles.noteIcon}>✓</Text><View style={{ flex: 1 }}><Text style={styles.noteTitle}>Reserva segura</Text><Text style={styles.noteText}>Seu pedido é processado de forma assíncrona antes da confirmação.</Text></View></View>
        <Button title="Escolher data e horário" onPress={() => router.push({ pathname: '/booking', params: { serviceId: service.id } })} icon="→" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  back: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  backArrow: { color: colors.primary, fontSize: 28, lineHeight: 28, marginRight: 4 },
  backLabel: { color: colors.text, fontWeight: '900', fontSize: 12 },
  hero: { minHeight: 210, borderRadius: radius.xl, backgroundColor: colors.dark, padding: 20, justifyContent: 'flex-end', overflow: 'hidden', ...shadow.floating },
  heroOrb: { position: 'absolute', top: 20, right: 20, width: 58, height: 58, borderRadius: 19, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '5deg' }] },
  heroIcon: { color: colors.white, fontSize: 23, fontWeight: '900' },
  heroTitle: { color: colors.white, fontSize: 27, lineHeight: 32, fontWeight: '900', marginTop: 10, maxWidth: 280 },
  heroSub: { color: '#C5C8D5', fontSize: 11, marginTop: 5 },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  meta: { flex: 1, minHeight: 82, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 11 },
  metaIcon: { color: colors.primary, fontSize: 14, fontWeight: '900' },
  metaTitle: { color: colors.text, fontSize: 11, fontWeight: '900', marginTop: 8 },
  metaLabel: { color: colors.muted, fontSize: 9, marginTop: 2 },
  sectionBlock: { marginTop: 24 },
  section: { fontSize: 17, fontWeight: '900', color: colors.text, marginBottom: 7 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 20 },
  note: { flexDirection: 'row', gap: 10, backgroundColor: colors.infoSoft, borderRadius: 15, padding: 13, marginTop: 18 },
  noteIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#FFFFFF99', color: colors.info, textAlign: 'center', textAlignVertical: 'center', paddingTop: 6, fontWeight: '900' },
  noteTitle: { color: '#214575', fontSize: 11, fontWeight: '900' },
  noteText: { color: '#294A78', fontSize: 10, lineHeight: 15, marginTop: 3 },
});
