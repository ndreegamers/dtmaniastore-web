import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCategories } from '@/hooks/useCategories';
import { lightTheme, type Theme } from '@/lib/theme';

interface CategoryGridProps {
  theme?: Theme;
}

const CategoryCard = ({ cat, cardWidth, theme, onPress }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handleHoverIn = () => {
        Animated.spring(scaleValue, { toValue: 1.04, friction: 8, tension: 40, useNativeDriver: true }).start();
    };
    const handleHoverOut = () => {
        Animated.spring(scaleValue, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onHoverIn={handleHoverIn}
            onHoverOut={handleHoverOut}
            style={[styles.card, { width: cardWidth }]}
        >
            <Animated.View style={[
                styles.imageWrap,
                {
                    borderRadius: theme.borderRadius.xl,
                    backgroundColor: theme.colors.surfaceElevated,
                    transform: [{ scale: scaleValue }],
                    shadowColor: '#0F172A',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.07,
                    shadowRadius: 16,
                    elevation: 4,
                }
            ]}>
                {cat.image_url ? (
                    <Image source={{ uri: cat.image_url }} style={styles.image} resizeMode="cover" />
                ) : (
                    <Text style={styles.imagePlaceholder}>🖥️</Text>
                )}
            </Animated.View>

            <Text
                style={[styles.label, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}
                numberOfLines={2}
            >
                {cat.name}
            </Text>
        </Pressable>
    );
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ theme = lightTheme }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { categories, fetchCategories } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  const rootCategories = categories.filter((c) => c.is_active && c.parent_id === null);

  if (rootCategories.length === 0) return null;

    const isDesktop = width >= 1024;
    const isTablet = width >= 768 && width < 1024;
    const gap = isDesktop ? 48 : isTablet ? 32 : 16;
    const horizontalPadding = isDesktop ? 60 : isTablet ? 32 : 16;
    const availableWidth = Math.min(width, 1200) - (horizontalPadding * 2);
    const cols = isDesktop ? 3 : isTablet ? 2 : 1;
    const cardWidth = Math.max(0, (availableWidth - (gap * (cols - 1))) / cols);

    return (
        <View nativeID="seccion-categorias" style={{ width: '100%', backgroundColor: theme.colors.surface }}>
            <View style={[styles.section, { paddingHorizontal: horizontalPadding }]}>
                {/* Section header */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
                        Categorías
                    </Text>
                    <View style={[styles.titleAccent, { backgroundColor: theme.colors.primary }]} />
                </View>

                <View style={[styles.grid, { gap }]}>
                    {rootCategories.map((cat) => (
                        <CategoryCard
                            key={cat.id}
                            cat={cat}
                            cardWidth={cardWidth}
                            theme={theme}
                            onPress={() => router.push(`/(public)/categorias/${cat.slug}` as any)}
                        />
                    ))}
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
        marginBottom: 40,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 28,
        letterSpacing: -0.5,
    },
    titleAccent: {
        width: 36,
        height: 3,
        borderRadius: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
    },
    imageWrap: {
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        fontSize: 40,
    },
    label: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 2,
        letterSpacing: -0.1,
    },
});
