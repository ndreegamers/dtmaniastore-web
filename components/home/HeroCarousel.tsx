import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCarousel } from '@/hooks/useCarousel';
import { lightTheme, type Theme } from '@/lib/theme';
import type { CarouselSlide } from '@/lib/types';

const AUTO_PLAY_INTERVAL = 4500;

interface HeroCarouselProps { theme?: Theme; }

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ theme = lightTheme }) => {
  const { slides, fetchSlides } = useCarousel();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const activeSlides = slides.filter((s) => s.is_active);

  useEffect(() => { fetchSlides(); }, []);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => { goToNext(); }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [activeSlides.length, activeIndex]);

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % activeSlides.length;
    goTo(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = (activeIndex - 1 + activeSlides.length) % activeSlides.length;
    goTo(prevIndex);
  };

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    flatListRef.current?.scrollToIndex({ index: idx, animated: true });
  };

  const onScrollEnd = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const carouselHeight = width >= 1024 ? 600 : width >= 768 ? 450 : width;

  if (activeSlides.length === 0) {
    return (
      <View style={[styles.placeholder, { backgroundColor: theme.colors.surface, height: carouselHeight }]}>
        <Text style={[styles.placeholderText, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
          Sin slides configurados
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CarouselSlide }) => {
    const imageUrl = width < 768 && item.image_url_mobile ? item.image_url_mobile : item.image_url;

    return (
      <View style={{ width, height: carouselHeight }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.slideImage} resizeMode="cover" />
        ) : (
          <View style={[styles.slideImage, { backgroundColor: theme.colors.borderLight }]} />
        )}

        {/* Sin overlay de opacidad */}

        {(item.title || item.subtitle || item.link_url) && (
          <View style={[styles.content, { paddingHorizontal: width >= 1024 ? 80 : 24 }]}>
            {item.title && <Text style={[styles.title, { fontFamily: theme.fonts.heading }]}>{item.title}</Text>}
            {item.subtitle && <Text style={[styles.subtitle, { fontFamily: theme.fonts.body }]}>{item.subtitle}</Text>}
            {item.link_url && item.link_text && (
              <TouchableOpacity
                onPress={() => router.push(item.link_url as any)}
                activeOpacity={0.85}
                style={[styles.cta, { backgroundColor: '#FFFFFF', borderRadius: theme.borderRadius.md }]}
              >
                <Text style={[styles.ctaText, { color: '#1D1D1F', fontFamily: theme.fonts.bodyMedium }]}>
                  {item.link_text}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { height: carouselHeight, backgroundColor: theme.colors.surface }]}>
      <FlatList
        ref={flatListRef}
        data={activeSlides}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />

      {activeSlides.length > 1 && width >= 768 && (
        <>
          <TouchableOpacity onPress={goToPrev} style={[styles.arrow, styles.arrowLeft]} activeOpacity={0.7}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNext} style={[styles.arrow, styles.arrowRight]} activeOpacity={0.7}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </>
      )}

      {activeSlides.length > 1 && (
        <View style={styles.dots}>
          {activeSlides.map((_, idx) => (
            <TouchableOpacity key={idx} onPress={() => goTo(idx)}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: idx === activeIndex ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                    width: idx === activeIndex ? 20 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  slideContainer: {
    flex: 1,
  },
  slideImage: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    gap: 10,
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  cta: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -22,
  },
  arrowLeft: { left: 16 },
  arrowRight: { right: 16 },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  placeholder: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
  },
});
