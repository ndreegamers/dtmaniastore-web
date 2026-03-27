import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';

export default function TerminosYCondiciones() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Términos y condiciones — dtmaniaStore' }} />
      <Header theme={theme} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Términos y condiciones
          </Text>
          <Text style={[styles.muted, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Última actualización: enero 2025
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            1. Aceptación de términos
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Al navegar y realizar compras en dtmaniaStore, aceptas los presentes términos y condiciones. Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices nuestros servicios.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            2. Productos y precios
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Los precios publicados en el catálogo están expresados en la moneda indicada e incluyen impuestos cuando corresponda. Nos reservamos el derecho de modificar precios sin previo aviso. El precio válido para tu compra es el confirmado al momento de coordinar el pedido por WhatsApp.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            3. Proceso de compra
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Las compras se realizan mediante coordinación directa por WhatsApp. El pedido se confirma una vez acordadas las condiciones de pago y envío entre el cliente y dtmaniaStore.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            4. Pagos
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Aceptamos transferencias bancarias, Yape, Plin y efectivo (en recojo presencial). El pedido se procesa una vez confirmado el pago. No almacenamos datos de tarjetas bancarias.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            5. Envíos
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Los tiempos y costos de envío se coordinan directamente por WhatsApp según la ubicación del cliente y el servicio de courier disponible. dtmaniaStore no se responsabiliza por demoras atribuibles al servicio de mensajería.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            6. Garantías y devoluciones
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Las condiciones de garantía están detalladas en nuestra página de Garantías. Para devoluciones por productos defectuosos dentro del período de garantía, el cliente debe contactarnos por WhatsApp dentro de los 7 días calendario de recibido el producto.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            7. Limitación de responsabilidad
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            dtmaniaStore no se responsabiliza por daños indirectos derivados del uso de los productos adquiridos. Nuestra responsabilidad máxima se limita al valor del producto vendido.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            8. Modificaciones
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en este sitio.
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
