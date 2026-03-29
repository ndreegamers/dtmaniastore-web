import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { lightTheme, type Theme } from '@/lib/theme';
import type { ProductImage } from '@/lib/types';

interface ProductGalleryProps {
  images: ProductImage[];
  theme?: Theme;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  theme = lightTheme,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const activeUrl = sorted[activeIndex]?.image_url ?? null;
  const mainSize = isDesktop ? 480 : width - 40;

  if (sorted.length === 0) {
    return (
      <View
        style={[
          styles.emptyBox,
          {
            width: mainSize,
            height: mainSize,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            borderColor: theme.colors.border,
          },
        ]}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Main image */}
      <View
        style={[
          styles.mainWrap,
          {
            width: mainSize,
            height: mainSize,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {activeUrl && (
          <Image
            source={{ uri: activeUrl }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Thumbnails row */}
      {sorted.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.thumbRow, { gap: 10 }]}
        >
          {sorted.map((img, idx) => (
            <TouchableOpacity
              key={img.id}
              onPress={() => setActiveIndex(idx)}
              activeOpacity={0.75}
              style={[
                styles.thumb,
                {
                  borderColor: idx === activeIndex ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.surface,
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: idx === activeIndex ? 0.12 : 0,
                  shadowRadius: 6,
                },
              ]}
            >
              <Image
                source={{ uri: img.image_url }}
                style={styles.thumbImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 14 },
  mainWrap: {
    overflow: 'hidden',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: { width: '100%', height: '100%' },
  emptyBox: { borderWidth: 1 },
  thumbRow: { paddingVertical: 2 },
  thumb: {
    width: 76,
    height: 76,
    overflow: 'hidden',
    borderWidth: 2,
  },
  thumbImage: { width: '100%', height: '100%' },
});
