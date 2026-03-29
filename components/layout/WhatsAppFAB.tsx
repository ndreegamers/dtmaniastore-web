import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

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

  if (!config?.whatsapp_number || !isDesktop) return null;

  return (
    <Pressable
      onPress={handlePress}
      style={({ hovered }) => [styles.fab, hovered && styles.fabHovered]}
      accessibilityLabel="Contactar por WhatsApp"
      accessibilityRole="button"
    >
      <FontAwesome5 name="whatsapp" size={20} color="#FFFFFF" />
      <Text style={styles.label}>WhatsApp</Text>
    </Pressable>
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
    // On web use fixed positioning so the button stays in the viewport corner
    ...(Platform.OS === 'web'
      ? ({ position: 'fixed', boxShadow: '0 4px 20px rgba(37,211,102,0.45)', zIndex: 100 } as any)
      : {}),
  },
  fabHovered: {
    backgroundColor: WA_GREEN_DARK,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
