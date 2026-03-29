import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductCard } from '@/components/product/ProductCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { lightTheme } from '@/lib/theme';
import type { Product } from '@/lib/types';

const WA_GREEN = '#25D366';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { getProductById, products, fetchProducts } = useProducts();
  const { config, getConfig } = useSiteConfig();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfig();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    })();
  }, [id]);

  // Related products: share at least one category with current product
  const productCategoryIds = product?.categories?.map((c) => c.id) ?? [];
  const related = products.filter(
    (p) =>
      p.is_active &&
      p.id !== product?.id &&
      p.categories?.some((c) => productCategoryIds.includes(c.id))
  ).slice(0, 4);

  const handleWhatsApp = async () => {
    if (!config?.whatsapp_number || !product) return;

    const productUrl = Platform.OS === 'web'
      ? window.location.href
      : `https://compustore.pe/producto/${product.id}`;

    const url = generateWhatsAppUrl(
      config.whatsapp_number,
      product.name,
      productUrl,
      config.whatsapp_default_message
    );

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    }
  };

  const hasDiscount = product?.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product!.compare_price! - product!.price) / product!.compare_price!) * 100)
    : 0;

  const currencySymbol = config?.currency_symbol ?? 'S/';

  // ── Loading ──
  if (loading) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <Header theme={theme} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  // ── Not found ──
  if (!product) {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <Header theme={theme} />
        <View style={styles.center}>
          <Text style={[styles.notFound, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Producto no encontrado.
          </Text>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={[styles.backLink, { color: theme.colors.primary, fontFamily: theme.fonts.bodyMedium }]}>
              ← Volver al inicio
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const pageTitle = product ? `${product.name} — dtmaniaStore` : 'Producto — dtmaniaStore';
  const pageDesc = product?.description?.slice(0, 155) ?? 'Ver detalles y consultar precio por WhatsApp.';

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: pageTitle }} />
      <Header theme={theme} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20, flexDirection: isDesktop ? 'row' : 'column' }]}>

          {/* ── Breadcrumb ── */}
          <View style={styles.breadcrumbWrap}>
            <View style={styles.breadcrumb}>
              <Text onPress={() => router.push('/')} style={[styles.breadLink, { color: theme.colors.primary, fontFamily: theme.fonts.body }]}>Inicio</Text>
              <Text style={[styles.breadSep, { color: theme.colors.textMuted }]}> › </Text>
              {product.categories && product.categories.length > 0 && (
                <>
                  <Text
                    onPress={() => router.push(`/(public)/categorias/${product.categories![0].slug}` as any)}
                    style={[styles.breadLink, { color: theme.colors.primary, fontFamily: theme.fonts.body }]}
                  >
                    {product.categories[0].name}
                  </Text>
                  <Text style={[styles.breadSep, { color: theme.colors.textMuted }]}> › </Text>
                </>
              )}
              <Text style={[styles.breadCurrent, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]} numberOfLines={1}>
                {product.name}
              </Text>
            </View>
          </View>

          {/* ── Gallery ── */}
          <View style={[styles.galleryCol, isDesktop && { width: 480 }]}>
            <ProductGallery images={product.images ?? []} theme={theme} />
          </View>

          {/* ── Info Col ── */}
          <View style={[styles.infoCol, isDesktop && { flex: 1, paddingLeft: 48 }]}>
            {/* Category badges */}
            {product.categories && product.categories.length > 0 && (
              <View style={styles.categoryBadges}>
                {product.categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => router.push(`/(public)/categorias/${cat.slug}` as any)}
                    activeOpacity={0.7}
                    style={[styles.categoryBadge, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
                  >
                    <Text style={[styles.categoryBadgeText, { color: theme.colors.primary, fontFamily: theme.fonts.bodyMedium }]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Name */}
            <Text style={[styles.productName, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
              {product.name}
            </Text>

            {/* Pricing */}
            <View style={[styles.priceBlock, { backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.md, padding: 16 }]}>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: theme.colors.primary, fontFamily: theme.fonts.heading }]}>
                  {currencySymbol} {product.price.toFixed(2)}
                </Text>
                {hasDiscount && (
                  <View style={[styles.discountBadge, { backgroundColor: theme.colors.error }]}>
                    <Text style={styles.discountText}>-{discountPct}%</Text>
                  </View>
                )}
              </View>
              {hasDiscount && (
                <Text style={[styles.comparePrice, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                  Precio anterior: {currencySymbol} {product.compare_price!.toFixed(2)}
                </Text>
              )}
            </View>

            {/* Description */}
            {product.description && (
              <View style={[styles.descriptionBlock, { borderLeftColor: theme.colors.border }]}>
                <Text style={[styles.description, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                  {product.description}
                </Text>
              </View>
            )}

            {/* WhatsApp CTA */}
            <TouchableOpacity
              onPress={handleWhatsApp}
              activeOpacity={0.85}
              style={[styles.waButton, { backgroundColor: WA_GREEN, borderRadius: theme.borderRadius.md }]}
            >
              <Text style={[styles.waButtonText, { fontFamily: theme.fonts.bodyMedium }]}>
                💬  Consultar por WhatsApp
              </Text>
            </TouchableOpacity>

            <Text style={[styles.waHint, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
              Te responderemos a la brevedad con disponibilidad y precio final.
            </Text>
          </View>
        </View>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <View style={[styles.relatedSection, { paddingHorizontal: isDesktop ? 48 : 20 }]}>
            <View style={styles.relatedHeader}>
              <Text style={[styles.relatedTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
                Productos relacionados
              </Text>
              <View style={[styles.relatedAccent, { backgroundColor: theme.colors.primary }]} />
            </View>
            <View style={[styles.relatedGrid, { gap: 14 }]}>
              {related.map((p) => {
                const cols = width >= 1024 ? 4 : width >= 600 ? 3 : 2;
                const cardWidth = (width - (cols + 1) * 14 - (isDesktop ? 96 : 40)) / cols;
                return (
                  <View key={p.id} style={{ width: cardWidth }}>
                    <ProductCard product={p} theme={theme} />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <Footer theme={theme} />
      </ScrollView>

      {/* Mobile sticky WhatsApp button */}
      {!isDesktop && (
        <View style={[styles.stickyWA, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity
            onPress={handleWhatsApp}
            activeOpacity={0.85}
            style={[styles.waButton, { backgroundColor: WA_GREEN, borderRadius: theme.borderRadius.md, margin: 0 }]}
          >
            <Text style={[styles.waButtonText, { fontFamily: theme.fonts.bodyMedium }]}>
              💬  Consultar por WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, paddingVertical: 80 },
  notFound: { fontSize: 16 },
  backLink: { fontSize: 14 },
  scrollContent: { flexGrow: 1 },
  inner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 24,
    paddingBottom: 48,
    gap: 24,
    flexWrap: 'wrap',
  },
  breadcrumbWrap: { width: '100%' },
  breadcrumb: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  breadLink: { fontSize: 13 },
  breadSep: { fontSize: 13 },
  breadCurrent: { fontSize: 13, flexShrink: 1 },
  galleryCol: { width: '100%' },
  infoCol: { width: '100%', gap: 20 },
  categoryBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1,
  },
  categoryBadgeText: { fontSize: 12, letterSpacing: 0.2 },
  productName: { fontSize: 28, letterSpacing: -0.6, lineHeight: 36 },
  priceBlock: { gap: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  price: { fontSize: 34, letterSpacing: -1 },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  comparePrice: { fontSize: 14, textDecorationLine: 'line-through', marginTop: 2 },
  descriptionBlock: {
    borderLeftWidth: 3,
    paddingLeft: 14,
  },
  description: { fontSize: 15, lineHeight: 26 },
  waButton: {
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  waButtonText: { color: '#FFFFFF', fontSize: 16, letterSpacing: 0.2 },
  waHint: { fontSize: 12, textAlign: 'center' },
  relatedSection: {
    paddingVertical: 48,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    gap: 24,
  },
  relatedHeader: { gap: 10 },
  relatedTitle: { fontSize: 24, letterSpacing: -0.5 },
  relatedAccent: { width: 32, height: 3, borderRadius: 2 },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  stickyWA: {
    padding: 12,
    borderTopWidth: 1,
  },
});
