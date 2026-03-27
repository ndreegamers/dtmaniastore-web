import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';

export default function PoliticaDePrivacidad() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Política de privacidad — dtmaniaStore' }} />
      <Header theme={theme} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Política de privacidad
          </Text>
          <Text style={[styles.muted, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Última actualización: enero 2025
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            1. Información que recopilamos
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Al contactarnos por WhatsApp, podemos recopilar tu nombre, número de teléfono y la información que compartas voluntariamente para procesar tu consulta o pedido. No almacenamos datos de tarjetas de crédito ni información bancaria.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            2. Uso de la información
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            La información recopilada se utiliza exclusivamente para atender tu consulta, procesar tu pedido y brindarte soporte postventa. No compartimos tus datos con terceros ni los usamos con fines publicitarios sin tu consentimiento.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            3. Cookies y tecnologías de seguimiento
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Este sitio puede utilizar cookies técnicas necesarias para el funcionamiento de la plataforma. No utilizamos cookies de rastreo publicitario de terceros.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            4. Seguridad
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Adoptamos medidas razonables para proteger la información que nos proporcionas. Sin embargo, ningún método de transmisión por internet es completamente seguro.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            5. Tus derechos
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Puedes solicitarnos en cualquier momento el acceso, corrección o eliminación de tus datos personales contactándonos por WhatsApp o correo electrónico.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            6. Cambios en esta política
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Nos reservamos el derecho de actualizar esta política en cualquier momento. Los cambios serán publicados en esta página con la fecha de actualización correspondiente.
          </Text>

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
    gap: 16,
  },
  title: { fontSize: 32, letterSpacing: -0.5, marginBottom: 4 },
  muted: { fontSize: 13 },
  subtitle: { fontSize: 18, letterSpacing: -0.3, marginTop: 8 },
  body: { fontSize: 15, lineHeight: 26 },
});
