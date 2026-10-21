import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import type { ComponentProps, PropsWithChildren } from 'react';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';

export function Screen({ children, padded = true }: PropsWithChildren<{ padded?: boolean }>) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  return (
    <View style={styles.screen}>
      <View style={[styles.contentFrame, desktop && styles.contentFrameDesktop, padded && (desktop ? styles.paddedDesktop : styles.padded)]}>{children}</View>
    </View>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: object }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.brandMark, compact && styles.brandMarkCompact]}>
      <Text style={[styles.brandMarkText, compact && styles.brandMarkTextCompact]}>AF</Text>
    </View>
  );
}

export function Button({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
  icon,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  disabled?: boolean;
  icon?: string;
}) {
  const palette = {
    primary: { background: colors.primary, border: colors.primary, text: colors.white },
    secondary: { background: colors.primarySoft, border: colors.primarySoft, text: colors.primaryDark },
    ghost: { background: 'transparent', border: colors.borderStrong, text: colors.text },
    danger: { background: colors.dangerSoft, border: colors.dangerSoft, text: colors.danger },
    success: { background: colors.accentSoft, border: colors.accentSoft, text: colors.success },
  }[variant];

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background, borderColor: palette.border, opacity: pressed || disabled ? 0.7 : 1 },
        variant === 'primary' && shadow.floating,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.buttonInner}>
          {icon ? <Text style={[styles.buttonIcon, { color: palette.text }]}>{icon}</Text> : null}
          <Text style={[styles.buttonText, { color: palette.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Input({ label, error, leftIcon, ...props }: ComponentProps<typeof TextInput> & { label: string; error?: string; leftIcon?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && styles.inputWrapError]}>
        {leftIcon ? <Text style={styles.inputIcon}>{leftIcon}</Text> : null}
        <TextInput
          placeholderTextColor={colors.subtle}
          {...props}
          style={[styles.input, leftIcon && { paddingLeft: 0 }, props.multiline && styles.multiline]}
          selectionColor={colors.primary}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action, icon }: { title: string; action?: string; icon?: string }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionTitleWrap}>
        {icon ? <Text style={styles.sectionIcon}>{icon}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

export function Pill({ text, tone = 'blue', icon }: { text: string; tone?: 'blue' | 'green' | 'gray' | 'red' | 'orange'; icon?: string }) {
  const map = {
    blue: [colors.primarySoft, colors.primaryDark],
    green: [colors.accentSoft, colors.success],
    gray: ['#F3F4F7', colors.muted],
    red: [colors.dangerSoft, colors.danger],
    orange: [colors.warningSoft, colors.warning],
  } as const;
  return (
    <View style={[styles.pill, { backgroundColor: map[tone][0] }]}>
      {icon ? <Text style={{ color: map[tone][1], fontSize: 10, marginRight: 4 }}>{icon}</Text> : null}
      <Text style={{ color: map[tone][1], fontWeight: '800', fontSize: 10 }}>{text}</Text>
    </View>
  );
}

export function EmptyState({ icon = '◌', title, description }: { icon?: string; title: string; description?: string }) {
  return (
    <Card style={styles.emptyCard}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyText}>{description}</Text> : null}
    </Card>
  );
}

export function InfoBanner({ title, description, icon = 'i', tone = 'info' }: { title: string; description: string; icon?: string; tone?: 'info' | 'warning' | 'success' }) {
  const map = {
    info: { bg: colors.infoSoft, icon: colors.info, text: '#214575' },
    warning: { bg: colors.warningSoft, icon: colors.warning, text: '#7A4E0A' },
    success: { bg: colors.accentSoft, icon: colors.success, text: '#155E47' },
  } as const;
  const palette = map[tone];
  return (
    <View style={[styles.infoBanner, { backgroundColor: palette.bg }]}>
      <View style={[styles.infoIcon, { backgroundColor: `${palette.icon}18` }]}>
        <Text style={[styles.infoIconText, { color: palette.icon }]}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoTitle, { color: palette.text }]}>{title}</Text>
        <Text style={[styles.infoText, { color: palette.text }]}>{description}</Text>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  contentFrame: { flex: 1, width: '100%' },
  contentFrameDesktop: { maxWidth: 1180, alignSelf: 'center', width: '100%', paddingTop: 4 },
  padded: { paddingHorizontal: spacing.md },
  paddedDesktop: { paddingHorizontal: 36 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  brandMark: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadow.floating },
  brandMarkCompact: { width: 42, height: 42, borderRadius: 13 },
  brandMarkText: { color: colors.white, fontSize: 20, fontWeight: '900', letterSpacing: -1 },
  brandMarkTextCompact: { fontSize: 15 },
  button: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonIcon: { fontSize: 15 },
  buttonText: { fontSize: 14, fontWeight: '900', letterSpacing: 0.1 },
  field: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '800', color: colors.text, marginBottom: 7 },
  inputWrap: { minHeight: 52, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center' },
  inputWrapError: { borderColor: colors.danger },
  inputIcon: { fontSize: 15, color: colors.subtle, marginLeft: 14, marginRight: 9 },
  input: { flex: 1, color: colors.text, fontSize: 14, paddingHorizontal: spacing.md, minHeight: 50 },
  multiline: { minHeight: 92, paddingTop: 14, textAlignVertical: 'top' },
  error: { color: colors.danger, marginTop: 6, fontSize: 11, fontWeight: '600' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, marginTop: 4 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionIcon: { fontSize: 13, color: colors.primary },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  action: { color: colors.primaryDark, fontWeight: '800' },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill },
  emptyCard: { alignItems: 'center', padding: 30, marginTop: 8 },
  emptyIcon: { fontSize: 28, color: colors.primary },
  emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 15, marginTop: 10 },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 5, maxWidth: 280 },
  infoBanner: { flexDirection: 'row', gap: 11, padding: 13, borderRadius: radius.md, marginTop: 14 },
  infoIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoIconText: { fontSize: 14, fontWeight: '900' },
  infoTitle: { fontSize: 11, fontWeight: '900' },
  infoText: { fontSize: 11, lineHeight: 17, marginTop: 3 },
});
