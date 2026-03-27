import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';

export default function Garantias() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Garantías — dtmaniaStore' }} />
      <Header theme={theme} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Garantías
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Todos los productos vendidos en dtmaniaStore cuentan con garantía oficial del fabricante o importador. Nos comprometemos a brindar soporte durante todo el período de garantía.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Períodos de garantía
          </Text>
          {[
            'Laptops y computadoras de escritorio: 12 meses.',
            'Componentes (procesadores, RAM, SSD, GPU): 12 meses.',
            'Monitores: 12 meses.',
            'Periféricos (teclados, mouse, audífonos): 6 meses.',
            'Accesorios y cables: 3 meses.',
          ].map((item, i) => (
            <Text key={i} style={[styles.bullet, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              • {item}
            </Text>
          ))}

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Proceso para hacer efectiva la garantía
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Para hacer válida tu garantía, contáctanos por WhatsApp con los siguientes datos: nombre completo, número de pedido o comprobante de compra, descripción del problema y, si es posible, fotos o video del defecto.
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Una vez evaluado el caso, coordinaremos la revisión, reparación o reemplazo del producto según corresponda.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            La garantía no cubre
          </Text>
          {[
            'Daños por uso inadecuado o accidentes.',
            'Daños por líquidos o humedad.',
            'Modificaciones o reparaciones no autorizadas.',
            'Desgaste normal del producto.',
          ].map((item, i) => (
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
});
