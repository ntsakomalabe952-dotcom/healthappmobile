// Central design tokens for the Sibanye-Stillwater Health app.
// Brand: blue, bright gold/yellow, white/platinum.
// Change colors here and they update everywhere in the app.

export const colors = {
  // Primary blues
  primary: '#0B3D91',       // deep corporate blue
  primaryDark: '#082B66',
  primaryLight: '#1E5FC2',
  primarySoft: '#E8F0FC',   // pale blue background wash

  // Gold / yellow accent
  gold: '#F5B301',
  goldDark: '#D89A00',
  goldSoft: '#FDF0CC',

  // Platinum / white neutrals
  white: '#FFFFFF',
  platinum: '#E8E9EB',
  platinumDark: '#C9CBCF',

  // Text
  textPrimary: '#101828',
  textSecondary: '#4B5568',
  textMuted: '#8A93A3',
  textOnPrimary: '#FFFFFF',
  textOnGold: '#0B3D91',

  // Status
  success: '#1E8E5A',
  successSoft: '#E3F5EC',
  warning: '#D89A00',
  warningSoft: '#FDF0CC',
  danger: '#D64545',
  dangerSoft: '#FBE7E7',
  info: '#1E5FC2',
  infoSoft: '#E8F0FC',

  // Structure
  background: '#F5F7FA',
  card: '#FFFFFF',
  border: '#E3E6EB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.textPrimary },
  bodySecondary: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textMuted },
  button: { fontSize: 16, fontWeight: '700' as const },
};

export const shadow = {
  card: {
    shadowColor: '#0B3D91',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
};

const theme = { colors, spacing, radii, typography, shadow };
export default theme;
