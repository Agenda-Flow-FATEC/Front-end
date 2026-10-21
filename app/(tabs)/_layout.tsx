import { Tabs, usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, radius } from '@/src/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { BrandMark } from '@/src/components/ui';

export default function TabsLayout() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;

  if (desktop) {
    return <DesktopTabs user={user} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#A1A6B4',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', marginBottom: 2 },
        tabBarStyle: { height: 70, paddingTop: 7, paddingBottom: 8, backgroundColor: 'rgba(255,255,255,0.96)', borderTopColor: colors.border },
        tabBarItemStyle: { borderRadius: 15, marginHorizontal: 2 },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Serviços', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✦</Text> }} />
      <Tabs.Screen name="agenda" options={{ title: 'Agenda', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>◷</Text> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>○</Text> }} />
      <Tabs.Screen name="admin" options={{ href: user?.role === 'ADMIN' ? '/admin' : null, title: 'Admin', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>✎</Text> }} />
    </Tabs>
  );
}

function DesktopTabs({ user }: { user: ReturnType<typeof useAuth>['user'] }) {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: 'Serviços', icon: '✦', path: '/' },
    { label: 'Agenda', icon: '◷', path: '/agenda' },
    { label: 'Perfil', icon: '○', path: '/perfil' },
    ...(user?.role === 'ADMIN' ? [{ label: 'Administração', icon: '✎', path: '/admin' }] : []),
  ];

  return (
    <View style={styles.desktopRoot}>
      <View style={styles.sidebar}>
        <View>
          <View style={styles.brandRow}>
            <BrandMark compact />
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>AgendaFlow</Text>
              <Text style={styles.brandCaption}>Organize sem complicar</Text>
            </View>
          </View>

          <Text style={styles.navLabel}>NAVEGAÇÃO</Text>
          <View style={styles.navGroup}>
            {items.map((item) => {
              const active = item.label === 'Serviços' ? pathname === '/' : pathname.startsWith(item.path);
              return (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.path as never)}
                  style={({ pressed }) => [styles.navItem, active && styles.navItemActive, pressed && styles.navItemPressed]}
                >
                  <View style={[styles.navIcon, active && styles.navIconActive]}>
                    <Text style={[styles.navIconText, active && styles.navIconTextActive]}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.sidebarBottom}>
          <View style={styles.sidebarLine} />
          <View style={styles.userSummary}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{user?.nome?.slice(0, 1).toUpperCase() || 'A'}</Text>
            </View>
            <View style={styles.userCopy}>
              <Text style={styles.userName} numberOfLines={1}>{user?.nome || 'Cliente'}</Text>
              <Text style={styles.userRole}>{user?.role === 'ADMIN' ? 'Administrador' : 'Conta pessoal'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mainArea}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topBarTitle}>AgendaFlow</Text>
            <Text style={styles.topBarSubtitle}>Tudo em um só lugar.</Text>
          </View>
          <View style={styles.topBarBadge}><View style={styles.liveDot} /><Text style={styles.topBarBadgeText}>ONLINE</Text></View>
        </View>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="index" options={{ title: 'Serviços' }} />
          <Tabs.Screen name="agenda" options={{ title: 'Agenda' }} />
          <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
          <Tabs.Screen name="admin" options={{ href: user?.role === 'ADMIN' ? '/admin' : null, title: 'Admin' }} />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  desktopRoot: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  sidebar: { width: 246, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.border, paddingHorizontal: 18, paddingVertical: 22, justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 },
  brandCopy: { marginLeft: 11, flex: 1 },
  brandName: { color: colors.text, fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  brandCaption: { color: colors.subtle, fontSize: 9, marginTop: 3 },
  navLabel: { color: colors.subtle, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginTop: 34, marginBottom: 10, paddingHorizontal: 8 },
  navGroup: { gap: 6 },
  navItem: { minHeight: 48, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9 },
  navItemActive: { backgroundColor: '#F2F1FF' },
  navItemPressed: { opacity: 0.75 },
  navIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  navIconActive: { backgroundColor: colors.primary },
  navIconText: { color: colors.muted, fontSize: 15, fontWeight: '800' },
  navIconTextActive: { color: colors.white },
  navText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  navTextActive: { color: colors.text },
  sidebarBottom: { paddingHorizontal: 6 },
  sidebarLine: { height: 1, backgroundColor: colors.border, marginBottom: 14 },
  userSummary: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  userAvatar: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center' },
  userAvatarText: { color: colors.white, fontSize: 12, fontWeight: '900' },
  userCopy: { marginLeft: 9, flex: 1 },
  userName: { color: colors.text, fontSize: 11, fontWeight: '900' },
  userRole: { color: colors.subtle, fontSize: 9, marginTop: 2 },
  mainArea: { flex: 1, minWidth: 0 },
  topBar: { minHeight: 68, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topBarTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  topBarSubtitle: { color: colors.subtle, fontSize: 10, marginTop: 2 },
  topBarBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: '#F5F7F9' },
  topBarBadgeText: { color: colors.muted, fontSize: 8, fontWeight: '900', letterSpacing: 0.9 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
});
