import React, { useEffect, useRef } from 'react';
import { ScrollView, View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { SkeletonHero, SkeletonCategoryCard, SkeletonProductCard } from '@/components/ui/Skeleton';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { lightTheme } from '@/lib/theme';

const SKELETON_COUNT = 8;

export default function HomePage() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const { config, loading, getConfig } = useSiteConfig();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    getConfig();
  }, []);

  const metaTitle = config?.meta_title ?? 'dtmaniaStore — Tu tienda de tecnología';

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScrollToSection = (sectionId: string) => {
    if (Platform.OS === 'web') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: metaTitle }} />

      <Header theme={theme} onScrollToTop={handleScrollToTop} onScrollToSection={handleScrollToSection} />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View>
            <SkeletonHero theme={theme} />

            <View style={[styles.skSection, { paddingHorizontal: isDesktop ? 48 : 20 }]}>
              <View style={styles.skGrid}>
                {Array.from({ length: 4 }).map((_, i) => {
                  const cols = width >= 1024 ? 4 : width >= 600 ? 3 : 2;
                  const gap = 12;
                  const cardWidth = (width - (cols + 1) * gap - (isDesktop ? 96 : 40)) / cols;
                  return (
                    <View key={i} style={{ width: cardWidth }}>
                      <SkeletonCategoryCard theme={theme} />
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={[styles.skSection, { paddingHorizontal: isDesktop ? 48 : 20 }]}>
              <View style={styles.skGrid}>
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => {
                  const cols = width >= 1024 ? 4 : width >= 600 ? 3 : 2;
                  const gap = 14;
                  const cardWidth = (width - (cols + 1) * gap - (isDesktop ? 96 : 40)) / cols;
                  return (
                    <View key={i} style={{ width: cardWidth }}>
                      <SkeletonProductCard theme={theme} />
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        ) : (
          <View>
            <HeroCarousel theme={theme} />
            <CategoryGrid theme={theme} />
            <FeaturedProducts theme={theme} />
          </View>
        )}

        <Footer theme={theme} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  skSection: {
    paddingVertical: 40,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  skGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
});
