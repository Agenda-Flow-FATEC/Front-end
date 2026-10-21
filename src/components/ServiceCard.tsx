import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import type { Service } from '@/src/types';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { Pill } from '@/src/components/ui';
import { formatBRL } from '@/src/lib/format';

export function ServiceCard({ service, onPress }: { service: Service; onPress: () => void }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, desktop && styles.cardDesktop, { opacity: pressed ? 0.94 : 1, transform: [{ translateY: pressed ? 1 : 0 }] }]}>
      <View style={[styles.iconBox, desktop && styles.iconBoxDesktop]}>
        <View style={[styles.iconCircle, desktop && styles.iconCircleDesktop]}><Text style={[styles.icon, desktop && styles.iconDesktop]}>✦</Text></View>
      </View>
      <View style={[styles.body, desktop && styles.bodyDesktop]}>
        <View style={styles.topLine}>
          <Pill text={service.categoria} />
          {service.preco != null ? <Text style={styles.price}>{formatBRL(service.preco)}</Text> : null}
        </View>
        <Text style={[styles.name, desktop && styles.nameDesktop]} numberOfLines={1}>{service.nome}</Text>
        <Text style={[styles.description, desktop && styles.descriptionDesktop]} numberOfLines={2}>{service.descricao}</Text>
        <View style={[styles.metaRow, desktop && styles.metaRowDesktop]}>
          <Text style={styles.meta}>◷ {service.duracaoMinutos} min</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.meta} numberOfLines={1}>{service.profissional}</Text>
        </View>
        <View style={[styles.footer, desktop && styles.footerDesktop]}>
          <Text style={styles.footerText}>Ver horários</Text>
          <View style={[styles.arrowCircle, desktop && styles.arrowCircleDesktop]}><Text style={styles.arrow}>→</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 11, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  cardDesktop: { minHeight: 224, flexDirection: 'column', padding: 12, borderRadius: 16, shadowOpacity: 0.03 },
  iconBox: { width: 72, minHeight: 142, borderRadius: 16, backgroundColor: '#F0EEFF', alignItems: 'center', justifyContent: 'center' },
  iconBoxDesktop: { width: '100%', minHeight: 64, borderRadius: 12, backgroundColor: '#F7F7FA' },
  iconCircle: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  icon: { color: colors.white, fontSize: 22, fontWeight: '900' },
  iconCircleDesktop: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#E7E4FF' },
  iconDesktop: { color: colors.primaryDark, fontSize: 18 },
  body: { flex: 1, paddingLeft: 13, paddingRight: 2, paddingVertical: 1 },
  bodyDesktop: { width: '100%', paddingLeft: 0, paddingTop: 11 },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  price: { color: colors.text, fontSize: 12, fontWeight: '900' },
  name: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 8 },
  nameDesktop: { fontSize: 15, marginTop: 7 },
  description: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  descriptionDesktop: { fontSize: 10, lineHeight: 15 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  metaRowDesktop: { marginTop: 9 },
  meta: { color: colors.muted, fontSize: 10, fontWeight: '700', flexShrink: 1 },
  dot: { color: colors.subtle },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 },
  footerDesktop: { marginTop: 10 },
  footerText: { color: colors.primaryDark, fontSize: 11, fontWeight: '900' },
  arrowCircle: { width: 28, height: 28, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  arrowCircleDesktop: { width: 27, height: 27, borderRadius: 9, backgroundColor: '#F0EEFF' },
  arrow: { color: colors.primaryDark, fontSize: 15, fontWeight: '900' },
});
