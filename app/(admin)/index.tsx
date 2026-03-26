import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { lightTheme } from '@/lib/theme';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  const theme = lightTheme;

  return (
    <ScrollView
      style={[styles.page, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Dashboard
        </Text>
        <Text style={[styles.pageSubtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
          Panel de administración de dtmaniaStore
        </Text>
      </View>

      {/* Welcome card */}
      <Card theme={theme} style={styles.welcomeCard}>
        <Text style={[styles.welcomeLabel, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
          SESIÓN ACTIVA
        </Text>
        <Text style={[styles.welcomeEmail, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
          {user?.email ?? '—'}
        </Text>
        <Text style={[styles.welcomeNote, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
          Bienvenido al panel de administración. Usa el menú de navegación para gestionar
          los productos, categorías, carrusel y configuración del sitio.
        </Text>

        <Button
          title="Cerrar sesión"
          onPress={signOut}
          variant="outline"
          theme={theme}
          style={styles.signOutBtn}
        />
      </Card>

      {/* Quick stats placeholder */}
      <View style={styles.statsRow}>
        {[
          { label: 'Productos', value: '—', icon: '📦' },
          { label: 'Categorías', value: '—', icon: '🗂️' },
          { label: 'Slides', value: '—', icon: '🖼️' },
        ].map((stat) => (
          <Card key={stat.label} theme={theme} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
              {stat.value}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              {stat.label}
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 20,
  },
  pageHeader: {
    gap: 4,
  },
  pageTitle: {
    fontSize: 26,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
  },
  welcomeCard: {
    gap: 6,
    paddingVertical: 24,
  },
  welcomeLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  welcomeEmail: {
    fontSize: 17,
  },
  welcomeNote: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  signOutBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 13,
  },
});
