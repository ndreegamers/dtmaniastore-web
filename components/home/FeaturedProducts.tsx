import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { lightTheme, type Theme } from '@/lib/theme';

interface FeaturedProductsProps {
  theme?: Theme;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ theme = lightTheme }) => {
  const { products, fetchProducts } = useProducts();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const featured = products.filter((p) => p.is_featured && p.is_active);

  if (featured.length === 0) return null;

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;
    const horizontalPadding = isDesktop ? 60 : isTablet ? 32 : 16;
    const cardWidth = isDesktop ? 340 : isTablet ? 280 : width * 0.75;
    const gap = 24;

    const handleScroll = (event: any) => {
        setScrollX(event.nativeEvent.contentOffset.x);
    };

    const slide = (direction: 'left' | 'right') => {
        const step = cardWidth + gap;
        const newX = direction === 'left' ? Math.max(0, scrollX - step) : scrollX + step;
        scrollRef.current?.scrollTo({ x: newX, animated: true });
    };

    return (
        <View style={{ width: '100%', backgroundColor: '#111827', position: 'relative' }}>
            <View style={[styles.section, { paddingHorizontal: horizontalPadding }]}>
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={[styles.heading, { color: '#FFFFFF', fontFamily: theme.fonts.heading }]}>
                            Productos Destacados
                        </Text>
                        <Text style={[styles.subheading, { color: 'rgba(255,255,255,0.5)', fontFamily: theme.fonts.body }]}>
                            Selección especial para ti
                        </Text>
                    </View>
                    <View style={[styles.accent, { backgroundColor: theme.colors.accent }]} />
                </View>

                <View style={{ position: 'relative' }}>
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ gap, paddingRight: horizontalPadding * 2, paddingBottom: 16 }}
                        style={styles.scrollContainer}
                    >
                        {featured.map((product) => (
                            <View key={product.id} style={{ width: cardWidth }}>
                                <ProductCard product={product} theme={theme} imageAspectRatio={0.87} />
                            </View>
                        ))}
                    </ScrollView>

                    {isDesktop && (
                        <>
                            <TouchableOpacity
                                style={[styles.navArrow, { left: -24 }]}
                                onPress={() => slide('left')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.arrowText}>‹</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.navArrow, { right: -24 }]}
                                onPress={() => slide('right')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.arrowText}>›</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  section: {
    paddingTop: 56,
    paddingBottom: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionHeader: {
    marginBottom: 36,
    gap: 12,
  },
  heading: {
    fontSize: 28,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    letterSpacing: 0.1,
  },
  accent: {
    width: 36,
    height: 3,
    borderRadius: 2,
  },
  scrollContainer: {
    overflow: 'visible',
  },
  navArrow: {
      position: 'absolute',
      top: '40%',
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 10,
  },
  arrowText: {
      fontSize: 28,
      color: '#111827',
      lineHeight: 32,
      marginLeft: 2,
  },
});
