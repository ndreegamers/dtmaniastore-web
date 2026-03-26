import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB';
import { useSiteConfig } from '@/hooks/useSiteConfig';

export default function PublicLayout() {
  const { getConfig } = useSiteConfig();

  // Load site config once for the whole public section (populates WhatsAppFAB)
  useEffect(() => {
    getConfig();
  }, []);

  return (
    <View style={styles.shell}>
      <Slot />
      <WhatsAppFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
});
