export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceHover: '#F1F5F9',
    surfaceElevated: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#1A50D4',
    primaryHover: '#1339B8',
    accent: '#0EA5E9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    overlay: 'rgba(0,0,0,0.5)',
  },
  fonts: {
    heading: 'Sora_700Bold',
    headingSemi: 'Sora_600SemiBold',
    body: 'DMSans_400Regular',
    bodyMedium: 'DMSans_500Medium',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    background: '#0A0F1E',
    surface: '#111827',
    surfaceHover: '#1F2937',
    surfaceElevated: '#1F2937',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#475569',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    accent: '#38BDF8',
    border: '#1E293B',
    borderLight: '#0F172A',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    overlay: 'rgba(0,0,0,0.7)',
  },
};
