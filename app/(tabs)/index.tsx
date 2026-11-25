import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { EmptyState, Screen, SectionTitle } from '@/src/components/ui';
import { ServiceCard } from '@/src/components/ServiceCard';
import { colors, radius, shadow, spacing } from '@/src/constants/theme';
import { getServices } from '@/src/services/api';
import type { Service } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';

export default function ServicesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(services.map((s) => s.categoria)))], [services]);
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const columns = desktop ? 3 : 1;

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    try { setServices(await getServices()); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  const visible = category === 'Todos' ? services : services.filter((s) => s.categoria === category);

  const header = (
    <View>
      <View style={[styles.topRow, desktop && styles.topRowDesktop]}>
        <View style={styles.identity}>
          <Text style={styles.kicker}>AGENDAFLOW</Text>
          <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0] || 'cliente'}.</Text>
        </View>
        <View style={styles.profileMini}>
          <Text style={styles.profileMiniText}>{user?.nome?.slice(0, 1).toUpperCase() || 'A'}</Text>
        </View>
      </View>

      <View style={[styles.hero, desktop && styles.heroDesktop]}>
        <View style={[styles.heroAccent, desktop && styles.heroAccentDesktop]} />
        <View style={[styles.heroContent, desktop && styles.heroContentDesktop]}>
          <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>AGENDA EM TEMPO REAL</Text></View>
          <Text style={styles.heroTitle}>Seu próximo horário começa aqui.</Text>
          <Text style={styles.heroText}>Escolha um serviço e encontre um horário que encaixe no seu dia.</Text>
        </View>
        <View style={[styles.heroOrb, desktop && styles.heroOrbDesktop]}><Text style={styles.heroOrbText}>✦</Text></View>
      </View>

      <SectionTitle title="Categorias" />
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        keyExtractor={(x) => x}
        renderItem={({ item }) => (
          <Pressable onPress={() => setCategory(item)} style={[styles.cat, category === item && styles.catActive]}>
            <Text style={[styles.catText, category === item && styles.catTextActive]}>{item}</Text>
          </Pressable>
        )}
      />

      <SectionTitle title="Serviços disponíveis" />
      {loading ? <View style={styles.loader}><ActivityIndicator color={colors.primary} /><Text style={styles.loaderText}>Carregando serviços...</Text></View> : null}
    </View>
  );

  return (
    <Screen padded={false}>
      <FlatList
        key={`services-${columns}`}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        data={visible}
        keyExtractor={(x) => x.id}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
        contentContainerStyle={[styles.content, desktop && styles.contentDesktop]}
        ListHeaderComponent={header}
        renderItem={({ item }) => <View style={desktop ? styles.desktopItem : undefined}><ServiceCard service={item} onPress={() => router.push({ pathname: '/service/[id]', params: { id: item.id } })} /></View>}
        ListEmptyComponent={!loading ? <EmptyState icon="✦" title="Nenhum serviço encontrado" description="Tente outra categoria ou atualize a lista." /> : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: 18, paddingBottom: 110 },
  columnWrapper: { gap: 12 },
  desktopItem: { flex: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  topRowDesktop: { marginBottom: 22 },
  contentDesktop: { paddingBottom: 42 },
  identity: { flex: 1 },
  kicker: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1.4 },
  greeting: { color: colors.text, fontSize: 25, fontWeight: '900', marginTop: 3, letterSpacing: -0.4 },
  profileMini: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, ...shadow.card },
  profileMiniText: { color: colors.primaryDark, fontSize: 15, fontWeight: '900' },
  hero: { minHeight: 170, backgroundColor: colors.dark, borderRadius: radius.xl, overflow: 'hidden', marginBottom: 24, ...shadow.floating },
  heroAccent: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#34374A', right: -38, top: -38 },
  heroContent: { padding: 20, paddingRight: 96 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: colors.accent },
  liveText: { color: '#C8F2E3', fontSize: 8, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { color: colors.white, fontSize: 24, lineHeight: 29, fontWeight: '900', marginTop: 10 },
  heroText: { color: '#C4C8D5', fontSize: 11, lineHeight: 17, marginTop: 7 },
  heroOrb: { position: 'absolute', right: 18, top: 54, width: 58, height: 58, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '6deg' }] },
  heroOrbText: { color: colors.white, fontSize: 22, fontWeight: '900' },
  heroDesktop: { minHeight: 142, backgroundColor: '#222532', borderRadius: 20, marginBottom: 22, ...shadow.card },
  heroAccentDesktop: { width: 170, height: 170, borderRadius: 85, backgroundColor: '#2D3040', right: -72, top: -88 },
  heroContentDesktop: { padding: 24, paddingRight: 120 },
  heroOrbDesktop: { right: 28, top: 42, width: 52, height: 52, borderRadius: 16, transform: [] },
  categories: { paddingBottom: 18, paddingTop: 1 },
  cat: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  catActive: { backgroundColor: colors.primary, borderColor: colors.primary, ...shadow.card },
  catText: { color: colors.muted, fontWeight: '800', fontSize: 11 },
  catTextActive: { color: colors.white },
  loader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  loaderText: { color: colors.muted, fontSize: 11 },
});
