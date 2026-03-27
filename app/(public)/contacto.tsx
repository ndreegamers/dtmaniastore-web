import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions, TouchableOpacity, Platform, Linking } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { lightTheme } from '@/lib/theme';

export default function Contacto() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { config, getConfig } = useSiteConfig();

  useEffect(() => {
    getConfig();
  }, []);

  const openWhatsApp = () => {
    if (!config?.whatsapp_number) return;
    const url = `https://wa.me/${config.whatsapp_number}`;
    if (Platform.OS === 'web') window.open(url, '_blank');
    else Linking.openURL(url);
  };

  const openEmail = () => {
    if (!config?.contact_email) return;
    Linking.openURL(`mailto:${config.contact_email}`);
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Contacto — dtmaniaStore' }} />
      <Header theme={theme} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Contacto
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Estamos disponibles para ayudarte con cualquier consulta sobre productos, pedidos o garantías.
          </Text>

          {/* WhatsApp */}
          {config?.whatsapp_number && (
            <TouchableOpacity
              onPress={openWhatsApp}
              style={[styles.contactCard, { backgroundColor: '#25D36615', borderColor: '#25D366' }]}
              activeOpacity={0.75}
            >
              <Text style={[styles.cardIcon]}>💬</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                  WhatsApp
                </Text>
                <Text style={[styles.cardValue, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  +{config.whatsapp_number}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Email */}
          {config?.contact_email && (
            <TouchableOpacity
              onPress={openEmail}
              style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              activeOpacity={0.75}
            >
              <Text style={styles.cardIcon}>✉️</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                  Correo electrónico
                </Text>
                <Text style={[styles.cardValue, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  {config.contact_email}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Phone */}
          {config?.contact_phone && (
            <View style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={styles.cardIcon}>📞</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                  Teléfono
                </Text>
                <Text style={[styles.cardValue, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  {config.contact_phone}
                </Text>
              </View>
            </View>
          )}

          {/* Address */}
          {config?.address && (
            <View style={[styles.contactCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={styles.cardIcon}>📍</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                  Dirección
                </Text>
                <Text style={[styles.cardValue, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  {config.address}
                </Text>
              </View>
            </View>
          )}

        </View>
        <Footer theme={theme} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: {
    maxWidth: 780,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 48,
    gap: 14,
  },
  title: { fontSize: 32, letterSpacing: -0.5, marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 26 },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardIcon: { fontSize: 22 },
  cardText: { gap: 2 },
  cardLabel: { fontSize: 14 },
  cardValue: { fontSize: 14 },
});
