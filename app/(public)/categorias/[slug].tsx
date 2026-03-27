import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { SkeletonProductCard } from '@/components/ui/Skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';
import type { Product } from '@/lib/types';

export default function CategoriaSlug() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const theme = lightTheme;
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { categories, loading: loadingCats, fetchCategories } = useCategories();
  const { products, loading: loadingProducts, fetchProducts } = useProducts();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const category = categories.find((c) => c.slug === slug);

  const filtered: Product[] = products.filter(
    (p) => p.is_active && p.category_id === category?.id
  );

  const horizontalPadding = isDesktop ? 48 : 20;
  const gap = width >= 1024 ? 16 : 12;
  const availableWidth = width - horizontalPadding * 2;
  const cols = width >= 1024 ? 4 : width >= 600 ? 3 : 2;
  const cardWidth = Math.max(0, (availableWidth - gap * (cols - 1)) / cols);

  const isLoading = loadingCats || loadingProducts;
  const pageTitle = category ? `${category.name} — dtmaniaStore` : 'Categoría — dtmaniaStore';

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: pageTitle }} />
      <Header theme={theme} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          {/* Breadcrumb */}
          <View style={styles.breadcrumb}>
            <Text onPress={() => router.push('/')} style={[styles.breadLink, { color: theme.colors.primary, fontFamily: theme.fonts.body }]}>
              Inicio
            </Text>
            <Text style={[styles.breadSep, { color: theme.colors.textMuted }]}> › </Text>
            <Text style={[styles.breadCurrent, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              {category?.name ?? slug}
            </Text>
          </View>

          {/* Category header */}
          {category && (
            <View style={styles.catHeader}>
              <Text style={[styles.catName, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
                {category.name}
              </Text>
              {category.description && (
                <Text style={[styles.catDesc, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  {category.description}
                </Text>
              )}
              {!isLoading && (
                <Text style={[styles.count, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                  {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
                </Text>
              )}
            </View>
          )}

          {/* Skeleton loading */}
          {isLoading && (
            <View style={[styles.grid, { gap }]}>
              {Array.from({ length: cols * 2 }).map((_, i) => (
                <View key={i} style={{ width: cardWidth }}>
                  <SkeletonProductCard theme={theme} />
                </View>
              ))}
            </View>
          )}

          {/* Category not found */}
          {!isLoading && !category && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                Categoría no encontrada
              </Text>
              <Text style={[styles.emptyBody, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                La categoría que buscas no existe o ya no está disponible.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/')}
                style={[styles.backBtn, { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md }]}
              >
                <Text style={[styles.backBtnText, { fontFamily: theme.fonts.bodyMedium }]}>← Volver al inicio</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty products */}
          {!isLoading && category && filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                Sin productos en esta categoría
              </Text>
              <Text style={[styles.emptyBody, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                No se encontraron productos disponibles en "{category.name}" por el momento.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/')}
                style={[styles.backBtn, { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md }]}
              >
                <Text style={[styles.backBtnText, { fontFamily: theme.fonts.bodyMedium }]}>← Volver al inicio</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Product grid */}
          {!isLoading && filtered.length > 0 && (
            <View style={[styles.grid, { gap }]}>
              {filtered.map((product) => (
                <View key={product.id} style={{ width: cardWidth }}>
                  <ProductCard product={product} theme={theme} />
                </View>
              ))}
            </View>
          )}
        </View>

        <Footer theme={theme} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  inner: { maxWidth: 1280, alignSelf: 'center', width: '100%', paddingTop: 24, paddingBottom: 40, gap: 20 },
  breadcrumb: { flexDirection: 'row', alignItems: 'center' },
  breadLink: { fontSize: 13 },
  breadSep: { fontSize: 13 },
  breadCurrent: { fontSize: 13 },
  catHeader: { gap: 6 },
  catName: { fontSize: 28, letterSpacing: -0.5 },
  catDesc: { fontSize: 15, lineHeight: 22 },
  count: { fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 44 },
  emptyTitle: { fontSize: 18 },
  emptyBody: { fontSize: 14, textAlign: 'center', maxWidth: 320, lineHeight: 20 },
  backBtn: { paddingVertical: 12, paddingHorizontal: 24, marginTop: 8 },
  backBtnText: { color: '#fff', fontSize: 14 },
});
