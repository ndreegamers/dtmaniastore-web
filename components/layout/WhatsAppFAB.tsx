import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';

// WhatsApp brand green — not part of the app theme, intentionally hardcoded
const WA_GREEN = '#25D366';
const WA_GREEN_DARK = '#1DA851';

interface WhatsAppFABProps {
  productName?: string;
  productUrl?: string;
}

export const WhatsAppFAB: React.FC<WhatsAppFABProps> = ({
  productName,
  productUrl,
}) => {
  const { config } = useSiteConfig();

  const handlePress = async () => {
    if (!config?.whatsapp_number) return;

    const url = generateWhatsAppUrl(
      config.whatsapp_number,
      productName,
      productUrl,
      config.whatsapp_default_message
    );

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else if (Platform.OS === 'web') {
      window.open(url, '_blank');
    }
  };

  if (!config?.whatsapp_number) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      style={styles.fab}
      accessibilityLabel="Contactar por WhatsApp"
      accessibilityRole="button"
    >
      {/* WhatsApp SVG-like icon via unicode */}
      <Text style={styles.icon}>💬</Text>
      <Text style={styles.label}>WhatsApp</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: WA_GREEN,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9999,
    shadowColor: WA_GREEN_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    // Web-only shadow via boxShadow when supported
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 20px rgba(37,211,102,0.45)' } as any)
      : {}),
  },
  icon: {
    fontSize: 18,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
