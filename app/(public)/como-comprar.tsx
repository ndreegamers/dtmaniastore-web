import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';

const STEPS = [
  {
    number: '1',
    title: 'Explora el catálogo',
    desc: 'Navega por las categorías o usa el buscador para encontrar el producto que necesitas. Puedes ver las imágenes, descripción y precio de cada artículo.',
  },
  {
    number: '2',
    title: 'Consulta por WhatsApp',
    desc: 'En la página de cada producto encontrarás el botón "Consultar por WhatsApp". Al tocarlo, se abrirá una conversación con nuestro equipo con los datos del producto ya incluidos.',
  },
  {
    number: '3',
    title: 'Coordina el pago y envío',
    desc: 'Nuestro equipo te confirmará disponibilidad, precio final y te guiará con las opciones de pago y envío disponibles para tu ubicación.',
  },
  {
    number: '4',
    title: 'Recibe tu producto',
    desc: 'Una vez confirmado el pago, coordinamos la entrega. Puedes recogerlo en tienda o solicitar envío a domicilio.',
  },
];

export default function ComoComprar() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Cómo comprar — dtmaniaStore' }} />
      <Header theme={theme} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Cómo comprar
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            El proceso es sencillo y completamente por WhatsApp. No necesitas crear cuenta ni registrarte.
          </Text>

          {STEPS.map((step) => (
            <View key={step.number} style={[styles.stepCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.stepNumberText, { fontFamily: theme.fonts.heading }]}>{step.number}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                  {step.title}
                </Text>
                <Text style={[styles.stepDesc, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Medios de pago
          </Text>
          {['Transferencia bancaria', 'Yape / Plin', 'Efectivo (recojo en tienda)'].map((item, i) => (
            <Text key={i} style={[styles.bullet, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              • {item}
            </Text>
          ))}

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
  title: { fontSize: 32, letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 20, letterSpacing: -0.3, marginTop: 8 },
  body: { fontSize: 15, lineHeight: 26 },
  bullet: { fontSize: 15, lineHeight: 26, paddingLeft: 4 },
  stepCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberText: { color: '#fff', fontSize: 16 },
  stepContent: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 15 },
  stepDesc: { fontSize: 14, lineHeight: 22 },
});
