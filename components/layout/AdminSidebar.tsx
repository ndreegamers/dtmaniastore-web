import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { lightTheme, type Theme } from '@/lib/theme';

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',    icon: '⊞', href: '/(admin)' },
  { label: 'Productos',    icon: '📦', href: '/(admin)/productos' },
  { label: 'Categorías',   icon: '🗂️', href: '/(admin)/categorias' },
  { label: 'Carrusel',     icon: '🖼️', href: '/(admin)/carrusel' },
  { label: 'Configuración',icon: '⚙️', href: '/(admin)/configuracion' },
];

interface AdminSidebarProps {
  theme?: Theme;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ theme = lightTheme }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  if (isDesktop) {
    return (
      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: theme.colors.surface,
            borderRightColor: theme.colors.border,
          },
        ]}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={[styles.brandText, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            dtmania<Text style={{ color: theme.colors.primary }}>Store</Text>
          </Text>
          <Text style={[styles.brandSub, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Panel Admin
          </Text>
        </View>

        {/* Nav Items */}
        <View style={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <TouchableOpacity
                key={item.href}
                onPress={() => router.push(item.href as any)}
                activeOpacity={0.7}
                style={[
                  styles.navItem,
                  {
                    backgroundColor: isActive ? theme.colors.primary + '15' : 'transparent',
                    borderRadius: theme.borderRadius.md,
                  },
                ]}
              >
                <Text style={styles.navIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                      fontFamily: isActive ? theme.fonts.bodyMedium : theme.fonts.body,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Mobile: bottom tab bar
  return (
    <View
      style={[
        styles.bottomBar,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <TouchableOpacity
            key={item.href}
            onPress={() => router.push(item.href as any)}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            <Text style={styles.tabIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? theme.colors.primary : theme.colors.textMuted,
                  fontFamily: isActive ? theme.fonts.bodyMedium : theme.fonts.body,
                },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  // Desktop sidebar
  sidebar: {
    width: 220,
    height: '100%',
    borderRightWidth: 1,
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  brand: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    marginBottom: 16,
  },
  brandText: {
    fontSize: 20,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nav: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  navIcon: {
    fontSize: 16,
  },
  navLabel: {
    fontSize: 14,
  },
  // Mobile bottom bar
  bottomBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    gap: 2,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
  },
});
