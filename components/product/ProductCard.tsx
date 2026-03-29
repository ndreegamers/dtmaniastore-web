import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { lightTheme, type Theme } from '@/lib/theme';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  theme?: Theme;
  onPress?: () => void;
  imageAspectRatio?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  theme = lightTheme,
  onPress,
  imageAspectRatio = 1,
}) => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url
    ?? product.images?.[0]?.image_url
    ?? null;

  const handlePress = () => {
    if (onPress) { onPress(); return; }
    router.push(`/(public)/producto/${product.id}` as any);
  };

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.78}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
    >
      {/* Image */}
      <View style={[styles.imageWrap, { backgroundColor: theme.colors.surface, aspectRatio: imageAspectRatio, borderTopLeftRadius: theme.borderRadius.lg, borderTopRightRadius: theme.borderRadius.lg }]}>
        {primaryImage ? (
          <Image source={{ uri: primaryImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholderWrap}>
            <Text style={[styles.imagePlaceholderIcon, { color: theme.colors.textMuted }]}>⬜</Text>
          </View>
        )}
        {hasDiscount && (
          <View style={[styles.discountBadge, { backgroundColor: theme.colors.error }]}>
            <Text style={styles.discountText}>-{discountPct}%</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[styles.name, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.colors.primary, fontFamily: theme.fonts.headingSemi }]}>
            S/ {product.price.toFixed(2)}
          </Text>
          {hasDiscount && (
            <Text style={[styles.comparePrice, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
              S/ {product.compare_price!.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  imageWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderIcon: { fontSize: 32, opacity: 0.3 },
  discountBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { padding: 14, gap: 6 },
  name: { fontSize: 14, lineHeight: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 16 },
  comparePrice: { fontSize: 12, textDecorationLine: 'line-through' },
});
