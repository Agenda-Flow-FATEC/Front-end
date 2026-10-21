import { useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister, setUnauthorizedHandler } from '@/src/services/api';
import type { User } from '@/src/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (nome: string, email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => { setUnauthorizedHandler(() => setUser(null)); return () => setUnauthorizedHandler(null); }, []);
  useEffect(() => { getCurrentUser().then(setUser).finally(() => setLoading(false)); }, []);
  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(tabs)');
  }, [loading, user, segments, router]);
  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async signIn(email, senha) { const result = await apiLogin(email.trim(), senha); setUser(result.usuario); },
    async signUp(nome, email, senha) { const result = await apiRegister(nome.trim(), email.trim(), senha); setUser(result.usuario); },
    async signOut() { await apiLogout(); setUser(null); router.replace('/(auth)/login'); },
  }), [loading, router, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider'); return context; }
