import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { lightTheme, type Theme } from '@/lib/theme';

interface HeaderProps {
  theme?: Theme;
  onScrollToTop?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme = lightTheme, onScrollToTop, onScrollToSection }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isCategoryPage = pathname.startsWith('/categorias');

  const navLinks = [
    { 
      label: 'Inicio', 
      isActive: pathname === '/',
      disabled: false,
      action: () => {
        if (pathname === '/') {
          onScrollToTop?.();
        } else {
          router.push('/');
        }
      } 
    },
    { 
      label: 'Categorías', 
      isActive: isCategoryPage,
      disabled: isCategoryPage, // Deshabilita el botón si ya está en una categoría
      action: () => {
        if (pathname === '/') {
          onScrollToSection?.('seccion-categorias');
        } else if (!isCategoryPage) {
          router.push('/');
        }
      } 
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border, paddingHorizontal: isDesktop ? 48 : 20 }]}>
      <View style={[styles.inner, { maxWidth: 1280 }]}>
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8}>
          <Text style={[styles.logo, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            dtmania<Text style={{ color: theme.colors.primary }}>Store</Text>
          </Text>
        </TouchableOpacity>

        {isDesktop && (
          <View style={styles.navLinks}>
            {navLinks.map((link) => (
              <TouchableOpacity 
                key={link.label} 
                activeOpacity={link.disabled ? 1 : 0.7} 
                onPress={link.disabled ? undefined : link.action}
                style={[{ cursor: link.disabled ? 'default' : 'pointer' } as any]}
              >
                <Text 
                  style={[
                    styles.navLink, 
                    { 
                      color: link.isActive ? theme.colors.primary : theme.colors.textSecondary, 
                      fontFamily: link.isActive ? theme.fonts.bodyMedium : theme.fonts.body, 
                      borderBottomColor: link.isActive ? theme.colors.primary : 'transparent',
                      opacity: link.disabled && !link.isActive ? 0.5 : 1
                    }
                  ]}
                >
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.right}>
          <TouchableOpacity onPress={() => router.push('/(public)/buscar' as any)} activeOpacity={0.7} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md }]} accessibilityLabel="Buscar productos">
            <Text style={styles.iconBtnText}>🔍</Text>
            {isDesktop && <Text style={[styles.iconBtnLabel, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>Buscar...</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: 64, borderBottomWidth: 1, justifyContent: 'center', zIndex: 100 },
  inner: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center', gap: 24 },
  logo: { fontSize: 22, letterSpacing: -0.5 },
  navLinks: { flex: 1, flexDirection: 'row', gap: 24 },
  navLink: { fontSize: 14, borderBottomWidth: 2, paddingBottom: 2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1 },
  iconBtnText: { fontSize: 15 },
  iconBtnLabel: { fontSize: 13, minWidth: 70 },
});
