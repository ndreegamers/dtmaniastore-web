import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/product/ProductCard';
import { SkeletonProductCard } from '@/components/ui/Skeleton';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { lightTheme } from '@/lib/theme';
import type { Product } from '@/lib/types';

const DEBOUNCE_MS = 300;

export default function BuscarScreen() {
  const theme = lightTheme;
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { products, loading, fetchProducts } = useProducts();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const hasQuery = debouncedQuery.trim().length >= 2;

  const filtered: Product[] = !hasQuery
    ? []
    : products.filter((p) => {
        if (!p.is_active) return false;
        const q = debouncedQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description ?? '').toLowerCase().includes(q)
        );
      });

  const horizontalPadding = isDesktop ? 48 : 20;
  const gap = width >= 1024 ? 16 : 12;
  const availableWidth = width - horizontalPadding * 2;
  const cols = width >= 1024 ? 4 : width >= 600 ? 3 : 2;
  const cardWidth = Math.max(0, (availableWidth - gap * (cols - 1)) / cols);

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Buscar — dtmaniaStore' }} />
      <Header theme={theme} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.inner, { paddingHorizontal: isDesktop ? 48 : 20 }]}>

          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Buscar productos
          </Text>

          {/* Search input */}
          <View
            style={[
              styles.inputWrap,
              {
                borderColor: isFocused ? theme.colors.primary : theme.colors.border,
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.md,
              },
            ]}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Busca laptops, procesadores, monitores..."
              placeholderTextColor={theme.colors.textMuted}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={[styles.input, { color: theme.colors.text, fontFamily: theme.fonts.body }]}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Text onPress={() => setQuery('')} style={[styles.clearBtn, { color: theme.colors.textMuted }]}>
                ✕
              </Text>
            )}
          </View>

          {/* Loading skeletons */}
          {loading && (
            <View style={[styles.grid, { gap }]}>
              {Array.from({ length: cols * 2 }).map((_, i) => (
                <View key={i} style={{ width: cardWidth }}>
                  <SkeletonProductCard theme={theme} />
                </View>
              ))}
            </View>
          )}

          {/* Prompt */}
          {!loading && !hasQuery && (
            <View style={styles.center}>
              <Text style={styles.hintIcon}>🔎</Text>
              <Text style={[styles.hintText, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                Escribe al menos 2 caracteres para buscar
              </Text>
            </View>
          )}

          {/* No results + empty state */}
          {!loading && hasQuery && filtered.length === 0 && (
            <View style={styles.center}>
              <Text style={styles.hintIcon}>😕</Text>
              <Text style={[styles.hintText, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                Sin resultados para "{debouncedQuery}"
              </Text>
              <Text style={[styles.hintSub, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                Revisa la ortografía o intenta con otro término.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/')}
                style={[styles.backBtn, { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md }]}
              >
                <Text style={[styles.backBtnText, { fontFamily: theme.fonts.bodyMedium }]}>← Volver al inicio</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results */}
          {!loading && hasQuery && filtered.length > 0 && (
            <>
              <Text style={[styles.resultsCount, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{debouncedQuery}"
              </Text>
              <View style={[styles.grid, { gap }]}>
                {filtered.map((product) => (
                  <View key={product.id} style={{ width: cardWidth }}>
                    <ProductCard product={product} theme={theme} />
                  </View>
                ))}
              </View>
            </>
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
  inner: { maxWidth: 1280, alignSelf: 'center', width: '100%', paddingTop: 32, paddingBottom: 48, gap: 24 },
  title: { fontSize: 26, letterSpacing: -0.5 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 10,
  },
  searchIcon: { fontSize: 18 },
  input: { flex: 1, height: 48, fontSize: 16 },
  clearBtn: { fontSize: 16, padding: 4 },
  center: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  hintIcon: { fontSize: 40 },
  hintText: { fontSize: 16, textAlign: 'center' },
  hintSub: { fontSize: 14, textAlign: 'center', maxWidth: 300 },
  backBtn: { paddingVertical: 12, paddingHorizontal: 24, marginTop: 4 },
  backBtnText: { color: '#fff', fontSize: 14 },
  resultsCount: { fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
