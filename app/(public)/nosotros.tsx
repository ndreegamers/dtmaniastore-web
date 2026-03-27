import React from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';

export default function Nosotros() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Quiénes somos — dtmaniaStore' }} />
      <Header theme={theme} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Quiénes somos
          </Text>

          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Somos dtmaniaStore, una tienda especializada en tecnología con el objetivo de acercar los mejores productos de cómputo, componentes y periféricos a nuestros clientes al mejor precio del mercado.
          </Text>

          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Nacimos con la visión de ofrecer una experiencia de compra sencilla, directa y de confianza. Creemos que adquirir tecnología no tiene que ser complicado, por eso ponemos a tu disposición un catálogo claro, atención personalizada por WhatsApp y asesoría honesta en cada consulta.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Nuestra misión
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Conectar a las personas con la tecnología que necesitan, ofreciendo productos de calidad, precios justos y un servicio postventa responsable.
          </Text>

          <Text style={[styles.subtitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Por qué elegirnos
          </Text>
          {[
            'Productos originales con garantía.',
            'Atención personalizada por WhatsApp.',
            'Asesoría técnica sin costo adicional.',
            'Envíos coordinados a todo el país.',
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
