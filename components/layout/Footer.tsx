import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Linking, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { lightTheme, type Theme } from '@/lib/theme';

// ── Redes sociales — actualizar seguidores cuando cambien significativamente ──
const SOCIAL = [
  {
    icon: 'instagram' as const,
    username: '@dtmani4',
    followers: '2.1K seguidores',
    url: 'https://www.instagram.com/dtmani4/',
    color: '#E1306C',
  },
  {
    icon: 'facebook' as const,
    username: '/DTMANIAST',
    followers: '1.8K seguidores',
    url: 'https://www.facebook.com/DTMANIAST',
    color: '#1877F2',
  },
];

const SITEMAP = [
  { label: 'Inicio', href: '/' },
  { label: 'Buscar productos', href: '/buscar' },
  { label: 'Quiénes somos', href: '/nosotros' },
  { label: 'Cómo comprar', href: '/como-comprar' },
  { label: 'Garantías', href: '/garantias' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Política de privacidad', href: '/politica-de-privacidad' },
  { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
];

interface FooterProps {
  theme?: Theme;
}

export const Footer: React.FC<FooterProps> = ({ theme = lightTheme }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const currentYear = new Date().getFullYear();
  const { config, getConfig } = useSiteConfig();
  const router = useRouter();

  useEffect(() => { getConfig(); }, []);

  const siteName = config?.site_name ?? 'dtmaniaStore';
  const contactEmail = config?.contact_email;
  const contactPhone = config?.contact_phone;
  const address = config?.address;

  const openLink = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingHorizontal: isDesktop ? 60 : 20,
        },
      ]}
    >
      <View style={[styles.inner, { maxWidth: 1200, flexDirection: isDesktop ? 'row' : 'column' }]}>

        {/* Brand block */}
        <View style={styles.brandBlock}>
          <Text style={[styles.brand, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            {siteName.replace('dtmaniaStore', 'dtmania')}
            <Text style={{ color: theme.colors.primary }}>
              {siteName.includes('dtmaniaStore') ? 'Store' : ''}
            </Text>
          </Text>
          <Text style={[styles.tagline, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Tu tienda de tecnología de confianza.
          </Text>

          {/* Redes sociales — icono + columna (usuario + seguidores) */}
          <View style={styles.socialBlock}>
            {SOCIAL.map((s) => (
              <TouchableOpacity
                key={s.icon}
                onPress={() => openLink(s.url)}
                activeOpacity={0.7}
                style={styles.socialRow}
              >
                <View style={[styles.socialIconWrap, { backgroundColor: s.color + '18' }]}>
                  <FontAwesome5 name={s.icon} size={18} color={s.color} />
                </View>
                <View style={styles.socialInfo}>
                  <Text style={[styles.socialUsername, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                    {s.username}
                  </Text>
                  <Text style={[styles.socialFollowers, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                    {s.followers}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sitemap block */}
        <View style={styles.sitemapBlock}>
          <Text style={[styles.sectionLabel, { color: theme.colors.textMuted, fontFamily: theme.fonts.bodyMedium }]}>
            MAPA DEL SITIO
          </Text>
          {SITEMAP.map((item) => (
            <TouchableOpacity key={item.href} onPress={() => router.push(item.href as any)} activeOpacity={0.7}>
              <Text style={[styles.sitemapLink, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact block */}
        {(contactEmail || contactPhone || address) && (
          <View style={styles.contactBlock}>
            <Text style={[styles.sectionLabel, { color: theme.colors.textMuted, fontFamily: theme.fonts.bodyMedium }]}>
              CONTACTO
            </Text>
            {contactEmail && (
              <Text style={[styles.contactItem, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                ✉️  {contactEmail}
              </Text>
            )}
            {contactPhone && (
              <Text style={[styles.contactItem, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                📞  {contactPhone}
              </Text>
            )}
            {address && (
              <Text style={[styles.contactItem, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                📍  {address}
              </Text>
            )}
          </View>
        )}

      </View>

      {/* Bottom strip */}
      <View style={[styles.bottomStrip, { borderTopColor: theme.colors.borderLight }]}>
        <Text style={[styles.copy, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
          © {currentYear} {siteName}. Todos los derechos reservados.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 40,
  },
  inner: {
    alignSelf: 'center',
    width: '100%',
    gap: 32,
    paddingBottom: 32,
  },
  brandBlock: {
    flex: 1,
    gap: 6,
  },
  brand: {
    fontSize: 20,
    letterSpacing: -0.4,
  },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Redes sociales
  socialBlock: {
    marginTop: 20,
    gap: 14,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialInfo: {
    gap: 2,
  },
  socialUsername: {
    fontSize: 14,
    letterSpacing: -0.1,
  },
  socialFollowers: {
    fontSize: 12,
  },

  // Sitemap
  sitemapBlock: {
    gap: 8,
  },
  sitemapLink: {
    fontSize: 13,
    lineHeight: 22,
  },

  // Contact
  contactBlock: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contactItem: {
    fontSize: 13,
    lineHeight: 20,
  },

  // Bottom
  bottomStrip: {
    borderTopWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  copy: {
    fontSize: 12,
  },
});
