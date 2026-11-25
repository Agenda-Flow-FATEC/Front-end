import { Appearance } from 'react-native';

const claro = {
  primary: '#6C5CE7',
  primaryDark: '#4D3FC2',
  primarySoft: '#EEEBFF',
  accent: '#11B982',
  accentSoft: '#E8FBF4',
  background: '#F7F8FC',
  surface: '#FFFFFF',
  text: '#171A2B',
  muted: '#697386',
  subtle: '#96a2b8',
  border: '#E7EAF0',
  borderStrong: '#CBD2DC',
  danger: '#D94B4B',
  dangerSoft: '#FDECEC',
  dangerText: '#7F1D1D',
  warning: '#C27A19',
  warningSoft: '#FFF5E4',
  info: '#3B72D9',
  infoSoft: '#EEF5FF',
  infoText: '#284A78',
  success: '#0B8F61',
  neutralSoft: '#F2F4F7',
  line: '#E4E7EC',
  white: '#FFFFFF',
  dark: '#181A2A',
};

const escuro: typeof claro = {
  primary: '#7C6CF0',
  primaryDark: '#B7AEFF',
  primarySoft: '#2A2552',
  accent: '#2FD3A0',
  accentSoft: '#10352C',
  background: '#0F1220',
  surface: '#181B2C',
  text: '#F2F4FA',
  muted: '#A3ABBD',
  subtle: '#2153d2',
  border: '#2A2F45',
  borderStrong: '#434A6B',
  danger: '#F26B6B',
  dangerSoft: '#3A1D22',
  dangerText: '#FFB4B4',
  warning: '#E0A04A',
  warningSoft: '#3A2D14',
  info: '#6C9BF0',
  infoSoft: '#17284A',
  infoText: '#BBD3FF',
  success: '#3DD6A0',
  neutralSoft: '#232739',
  line: '#2F3450',
  white: '#FFFFFF',
  dark: '#232748',
};

// Segue o tema do sistema (Windows/Android/iOS). O valor e lido ao abrir o app: ao trocar o tema, recarregue a pagina.
export const colors = Appearance.getColorScheme() === 'dark' ? escuro : claro;

export const spacing = { xs: 6, sm: 10, md: 16, lg: 22, xl: 30, xxl: 40 };
export const radius = { sm: 10, md: 16, lg: 22, xl: 28, pill: 999 };

export const shadow = {
  card: {
    shadowColor: '#171A2B',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  floating: {
    shadowColor: '#171A2B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};
