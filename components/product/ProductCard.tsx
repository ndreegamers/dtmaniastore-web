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

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.78}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderLight,
          borderRadius: theme.borderRadius.lg,
        },
      ]}
    >
      {/* Image */}
      <View style={[styles.imageWrap, { backgroundColor: theme.colors.borderLight, aspectRatio: imageAspectRatio }]}>
        {primaryImage ? (
          <Image source={{ uri: primaryImage }} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.imagePlaceholder}>📷</Text>
        )}
        {hasDiscount && (
          <View style={[styles.discountBadge, { backgroundColor: theme.colors.error }]}>
            <Text style={styles.discountText}>
              -{Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}%
            </Text>
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
          <Text style={[styles.price, { color: theme.colors.primary, fontFamily: theme.fonts.bodyMedium }]}>
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
  },
  imageWrap: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { fontSize: 32 },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { padding: 12, gap: 6 },
  name: { fontSize: 13, lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 15 },
  comparePrice: { fontSize: 12, textDecorationLine: 'line-through' },
});
