import React from 'react';
import { View, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native';
import { Slot, Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { lightTheme } from '@/lib/theme';

export default function AdminLayout() {
  const { session, loading } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const theme = lightTheme;

  // Show loading spinner while resolving auth state
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // No session → redirect to login
  if (!session) {
    return <Redirect href="/login" />;
  }

  // Authenticated — render admin shell
  return (
    <View style={[styles.shell, { backgroundColor: theme.colors.background }]}>
      {isDesktop ? (
        // Desktop: sidebar left + content right
        <View style={styles.desktopLayout}>
          <AdminSidebar theme={theme} />
          <View style={styles.desktopContent}>
            <Slot />
          </View>
        </View>
      ) : (
        // Mobile: content on top + bottom tab bar
        <View style={styles.mobileLayout}>
          <View style={styles.mobileContent}>
            <Slot />
          </View>
          <AdminSidebar theme={theme} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shell: {
    flex: 1,
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  desktopContent: {
    flex: 1,
    overflow: 'hidden',
  },
  mobileLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  mobileContent: {
    flex: 1,
  },
});
