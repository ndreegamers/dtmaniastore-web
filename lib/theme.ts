export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceHover: '#F1F3F5',
    surfaceElevated: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6C757D',
    textMuted: '#ADB5BD',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    accent: '#7C3AED',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    overlay: 'rgba(0,0,0,0.5)',
  },
  fonts: {
    heading: 'DMSans_700Bold',
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
    background: '#0F0F1A',
    surface: '#1A1A2E',
    surfaceHover: '#25253D',
    surfaceElevated: '#25253D',
    text: '#F8F9FA',
    textSecondary: '#ADB5BD',
    textMuted: '#6C757D',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    accent: '#8B5CF6',
    border: '#2D2D44',
    borderLight: '#1F1F35',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    overlay: 'rgba(0,0,0,0.7)',
  },
};
