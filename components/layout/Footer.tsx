import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { lightTheme, type Theme } from '@/lib/theme';

interface FooterProps {
  theme?: Theme;
}

export const Footer: React.FC<FooterProps> = ({ theme = lightTheme }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const currentYear = new Date().getFullYear();
  const { config, getConfig } = useSiteConfig();

  useEffect(() => {
    getConfig();
  }, []);

  const siteName = config?.site_name ?? 'dtmaniaStore';
  const contactEmail = config?.contact_email;
  const contactPhone = config?.contact_phone;
  const address = config?.address;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingHorizontal: isDesktop ? 48 : 20,
        },
      ]}
    >
      <View style={[styles.inner, { maxWidth: 1280, flexDirection: isDesktop ? 'row' : 'column' }]}>
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

        {/* Social block */}
        <View style={[styles.socialBlock, { justifyContent: isDesktop ? 'flex-end' : 'flex-start' }]}>
          <TouchableOpacity activeOpacity={0.6}>
            <FontAwesome5 name="instagram" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6}>
            <FontAwesome5 name="facebook" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6}>
            <FontAwesome5 name="discord" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
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
  socialBlock: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingTop: 8,
  },
  bottomStrip: {
    borderTopWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  copy: {
    fontSize: 12,
  },
});
