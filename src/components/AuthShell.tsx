import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BrandMark } from '@/src/components/ui';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import type { PropsWithChildren, ReactNode } from 'react';

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: PropsWithChildren<{ eyebrow: string; title: string; subtitle: string; footer?: ReactNode }>) {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={[styles.scroll, desktop && styles.scrollDesktop]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.shell, desktop && styles.shellDesktop]}>
            {desktop ? (
              <View style={styles.visual}>
                <View style={styles.visualOrbOne} />
                <View style={styles.visualOrbTwo} />
                <View style={styles.visualTop}>
                  <BrandMark />
                  <View style={styles.brandTextWrap}>
                    <Text style={[styles.brand, styles.visualBrand]}>AgendaFlow</Text>
                    <Text style={styles.brandCaption}>Seu tempo, do seu jeito.</Text>
                  </View>
                </View>
                <View style={styles.visualCopy}>
                  <Text style={styles.visualEyebrow}>{eyebrow}</Text>
                  <Text style={styles.visualTitle}>{title}</Text>
                  <Text style={styles.visualSubtitle}>{subtitle}</Text>
                  <View style={styles.featureList}>
                    <Feature icon="01" text="Encontre serviços em poucos toques." />
                    <Feature icon="02" text="Reserve horários com mais praticidade." />
                    <Feature icon="03" text="Acompanhe tudo em um só lugar." />
                  </View>
                </View>
                <View style={styles.visualFooter}><Text style={styles.visualFooterText}>AGENDAFLOW</Text><Text style={styles.visualFooterDot}>•</Text><Text style={styles.visualFooterText}>SIMPLES · RÁPIDO · ORGANIZADO</Text></View>
              </View>
            ) : null}

            <View style={[styles.formSide, desktop && styles.formSideDesktop]}>
              {!desktop ? (
                <View style={styles.mobileBrandRow}>
                  <BrandMark compact />
                  <View style={styles.brandTextWrap}>
                    <Text style={styles.brand}>AgendaFlow</Text>
                    <Text style={styles.brandCaption}>Seu tempo, do seu jeito.</Text>
                  </View>
                </View>
              ) : null}

              <View style={[styles.formCard, desktop && styles.formCardDesktop]}>
                {!desktop ? <Text style={styles.mobileEyebrow}>{eyebrow}</Text> : null}
                <Text style={styles.formTitle}>{desktop ? (eyebrow === 'CRIAR CONTA' ? 'Criar sua conta' : 'Entrar') : title}</Text>
                <Text style={styles.formHint}>{desktop ? subtitle : 'Preencha só o essencial para continuar.'}</Text>
                {children}
                {footer}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Feature({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}><Text style={styles.featureIconText}>{icon}</Text></View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: 18, justifyContent: 'center' },
  scrollDesktop: { paddingVertical: 42 },
  shell: { width: '100%', maxWidth: 640, alignSelf: 'center' },
  shellDesktop: { maxWidth: 1120, flexDirection: 'row', minHeight: 610, borderRadius: 30, overflow: 'hidden', ...shadow.floating },
  visual: { flex: 1.02, backgroundColor: '#fefeff', padding: 38, justifyContent: 'space-between', overflow: 'hidden', borderRightWidth: 1, borderRightColor: colors.border },
  visualOrbOne: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: '#E7E5FF', right: -90, top: -80 },
  visualOrbTwo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: '#E3F3EE', left: -70, bottom: 80 },
  visualTop: { flexDirection: 'row', alignItems: 'center' },
  brandTextWrap: { marginLeft: 12 },
  brand: { color: colors.text, fontSize: 20, fontWeight: '900', letterSpacing: -0.2 },
  brandCaption: { color: colors.muted, fontSize: 11, marginTop: 2 },
  visualCopy: { maxWidth: 420 },
  visualEyebrow: { color: colors.primaryDark, fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  visualTitle: { color: '#1E1B4B', fontSize: 36, lineHeight: 43, fontWeight: '900', letterSpacing: -1.2, marginTop: 9 },
  visualSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 12, maxWidth: 390 },
  featureList: { marginTop: 26, gap: 10 },
  feature: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: '#DCDDE7', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  featureIconText: { color: colors.primaryDark, fontSize: 9, fontWeight: '900' },
  featureText: { color: '#374151', fontSize: 11, fontWeight: '700' },
  visualFooter: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  visualFooterText: { color: colors.subtle, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  visualFooterDot: { color: colors.primary, fontSize: 9 },
  formSide: { width: '100%' },
  formSideDesktop: { width: 460, backgroundColor: colors.surface, justifyContent: 'center' },
  mobileBrandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  formCard: { backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: radius.xl, padding: 20, borderWidth: 1, borderColor: colors.border, ...shadow.floating },
  formCardDesktop: { borderWidth: 0, borderRadius: 0, shadowOpacity: 0, paddingHorizontal: 48, paddingVertical: 46, backgroundColor: 'transparent' },
  mobileEyebrow: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.3, marginBottom: 6 },
  formTitle: { color: colors.text, fontSize: 25, lineHeight: 30, fontWeight: '900', letterSpacing: -0.4 },
  formHint: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 4, marginBottom: 18 },
  visualBrand: { color: '#1E1B4B' }
});
