import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useCategories } from '@/hooks/useCategories';
import { lightTheme, type Theme } from '@/lib/theme';

// ── Dropdown item con hover ──────────────────────────────────────────────────
interface DropdownItemProps {
  label: string;
  onPress: () => void;
  showDivider: boolean;
  hoverColor: string;
  dividerColor: string;
  textColor: string;
  fontFamily: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  label, onPress, showDivider, hoverColor, dividerColor, textColor, fontFamily,
}) => {
  const bg = useRef(new Animated.Value(0)).current;

  const onHoverIn = () => Animated.timing(bg, { toValue: 1, duration: 120, useNativeDriver: false }).start();
  const onHoverOut = () => Animated.timing(bg, { toValue: 0, duration: 120, useNativeDriver: false }).start();

  const backgroundColor = bg.interpolate({ inputRange: [0, 1], outputRange: ['rgba(0,0,0,0)', hoverColor] });

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      style={[
        dropdownItemStyles.item,
        showDivider && { borderBottomWidth: 1, borderBottomColor: dividerColor },
      ]}
    >
      <Animated.View style={[dropdownItemStyles.bg, { backgroundColor }]} />
      <Text style={[dropdownItemStyles.text, { color: textColor, fontFamily }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const dropdownItemStyles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    position: 'relative',
    cursor: 'pointer' as any,
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 14,
    zIndex: 1,
  },
});
// ─────────────────────────────────────────────────────────────────────────────

interface HeaderProps {
  theme?: Theme;
  onScrollToTop?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme = lightTheme }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { categories, fetchCategories } = useCategories();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  // Cerrar dropdown al cambiar de ruta
  useEffect(() => { setDropdownOpen(false); }, [pathname]);

  // Cerrar dropdown al hacer click fuera (web)
  useEffect(() => {
    if (!dropdownOpen || Platform.OS !== 'web') return;
    const close = () => setDropdownOpen(false);
    // Pequeño delay para que no se cierre inmediatamente por el mismo click que lo abrió
    const timer = setTimeout(() => {
      document.addEventListener('click', close, { once: true });
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', close);
    };
  }, [dropdownOpen]);

  const rootCategories = categories.filter((c) => c.is_active && c.parent_id === null);

  const handleCategoryPress = (slug: string) => {
    setDropdownOpen(false);
    router.push(`/(public)/categorias/${slug}` as any);
  };

  const searchPlaceholder = isDesktop
    ? 'Buscar laptops, monitores, teclados, componentes y más...'
    : 'Buscar...';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
          paddingHorizontal: isDesktop ? 60 : 20,
          zIndex: 200,
        },
      ]}
    >
      <View style={[styles.inner, { maxWidth: 1200 }]}>

        {/* Logo */}
        <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8} style={styles.logoWrap}>
          <Text style={[styles.logo, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            dtmania<Text style={{ color: theme.colors.primary }}>Store</Text>
          </Text>
        </TouchableOpacity>

        {/* Categorías button + dropdown */}
        <View style={styles.categoriesWrapper}>
          <TouchableOpacity
            onPress={(e) => {
              // Evitar que el click se propague al document listener
              if (Platform.OS === 'web') (e as any).nativeEvent?.stopPropagation?.();
              setDropdownOpen((prev) => !prev);
            }}
            activeOpacity={0.85}
            style={[
              styles.categoriesBtn,
              { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md },
            ]}
          >
            <Text style={[styles.categoriesBtnText, { fontFamily: theme.fonts.bodyMedium }]}>
              Categorías  {dropdownOpen ? '▲' : '▾'}
            </Text>
          </TouchableOpacity>

          {/* Dropdown — position absolute, no afecta al layout */}
          {dropdownOpen && (
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                  shadowColor: '#0F172A',
                },
              ]}
            >
              {rootCategories.length === 0 ? (
                <Text style={[styles.dropdownEmpty, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                  Sin categorías
                </Text>
              ) : (
                rootCategories.map((cat, index) => (
                  <DropdownItem
                    key={cat.id}
                    label={cat.name}
                    onPress={() => handleCategoryPress(cat.slug)}
                    showDivider={index < rootCategories.length - 1}
                    hoverColor={theme.colors.surfaceHover}
                    dividerColor={theme.colors.borderLight}
                    textColor={theme.colors.text}
                    fontFamily={theme.fonts.bodyMedium}
                  />
                ))
              )}
            </View>
          )}
        </View>

        {/* Search bar — flex:1, alineado con el ancho de la sección de categorías */}
        <TouchableOpacity
          onPress={() => router.push('/(public)/buscar' as any)}
          activeOpacity={0.7}
          style={[
            styles.searchBtn,
            !isDesktop && styles.searchBtnMobile,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.borderRadius.md,
            },
          ]}
          accessibilityLabel="Buscar productos"
        >
          <Text style={[styles.searchIcon, { color: theme.colors.textMuted }]}>🔍</Text>
          {isDesktop && (
            <Text
              style={[styles.searchLabel, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}
              numberOfLines={1}
            >
              {searchPlaceholder}
            </Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    borderBottomWidth: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  inner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 16,
  },

  // Logo
  logoWrap: {
    marginRight: 16,
  },
  logo: {
    fontSize: 22,
    letterSpacing: -0.5,
  },

  // Categorías
  categoriesWrapper: {
    position: 'relative',
    zIndex: 300,
  },
  categoriesBtn: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    // minWidth fijo para que el chevron ▾/▲ no cause resize
    minWidth: 130,
    justifyContent: 'center',
  },
  categoriesBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 0.1,
  },

  // Dropdown — position absolute, no empuja al search bar
  dropdown: {
    position: 'absolute',
    top: 46,
    left: 0,
    minWidth: 210,
    borderWidth: 1,
    zIndex: 400,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  dropdownEmpty: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 13,
  },

  // Search
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  // En móvil: solo icono, cuadrado
  searchBtnMobile: {
    paddingHorizontal: 12,
    gap: 0,
  },
  searchIcon: {
    fontSize: 14,
  },
  searchLabel: {
    fontSize: 14,
  },
});
