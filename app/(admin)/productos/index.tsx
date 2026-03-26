import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { lightTheme } from '@/lib/theme';
import type { Product } from '@/lib/types';

export default function ProductosIndex() {
  const theme = lightTheme;
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { products, loading, error, fetchProducts, deleteProduct, updateProduct } =
    useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const getPrimaryImage = (product: Product): string | null => {
    if (!product.images || product.images.length === 0) return null;
    const primary = product.images.find((img) => img.is_primary);
    return primary?.image_url ?? product.images[0].image_url;
  };

  const handleDelete = (product: Product) => {
    const doDelete = async () => {
      await deleteProduct(product.id);
    };
    if (Platform.OS === 'web') {
      if (window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) {
        doDelete();
      }
    } else {
      Alert.alert('Eliminar producto', `¿Eliminar "${product.name}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const handleToggleActive = async (product: Product) => {
    await updateProduct(product.id, { is_active: !product.is_active });
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: isDesktop ? 32 : 20 }]}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
              Productos
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              {products.length} producto{products.length !== 1 ? 's' : ''} registrados
            </Text>
          </View>
          <Button
            title="+ Nuevo producto"
            onPress={() => router.push('/(admin)/productos/crear')}
            variant="primary"
            theme={theme}
          />
        </View>

        {/* Error */}
        {error && (
          <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
        )}

        {/* Loading */}
        {loading && (
          <Text style={[styles.loading, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Cargando productos...
          </Text>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <Card theme={theme} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
              Sin productos
            </Text>
            <Text style={[styles.emptyBody, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              Crea tu primer producto para comenzar a construir el catálogo.
            </Text>
            <Button
              title="Crear primer producto"
              onPress={() => router.push('/(admin)/productos/crear')}
              variant="primary"
              theme={theme}
              style={{ marginTop: 12 }}
            />
          </Card>
        )}

        {/* Product list */}
        {products.map((product) => {
          const imageUrl = getPrimaryImage(product);
          return (
            <Card key={product.id} theme={theme} style={styles.row}>
              <View style={styles.rowInner}>
                {/* Thumbnail */}
                <View style={[styles.thumb, { backgroundColor: theme.colors.borderLight, borderRadius: theme.borderRadius.md }]}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.thumbImg} resizeMode="cover" />
                  ) : (
                    <Text style={styles.thumbPlaceholder}>📷</Text>
                  )}
                </View>

                {/* Info */}
                <View style={styles.info}>
                  <View style={styles.nameLine}>
                    <Text style={[styles.productName, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]} numberOfLines={1}>
                      {product.name}
                    </Text>
                    {product.is_featured && (
                      <View style={[styles.badge, { backgroundColor: theme.colors.warning + '25' }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.warning }]}>★ Destacado</Text>
                      </View>
                    )}
                    {!product.is_active && (
                      <View style={[styles.badge, { backgroundColor: theme.colors.textMuted + '25' }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.textMuted }]}>Inactivo</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.category, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                    {(product.category as any)?.name ?? 'Sin categoría'}
                  </Text>

                  <View style={styles.priceLine}>
                    <Text style={[styles.price, { color: theme.colors.primary, fontFamily: theme.fonts.bodyMedium }]}>
                      S/ {product.price.toFixed(2)}
                    </Text>
                    {product.compare_price && (
                      <Text style={[styles.comparePrice, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                        S/ {product.compare_price.toFixed(2)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleToggleActive(product)}
                    style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text>{product.is_active ? '👁️' : '🚫'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push(`/(admin)/productos/${product.id}`)}
                    style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(product)}
                    style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  content: { gap: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  error: { fontSize: 13, textAlign: 'center', paddingVertical: 8 },
  loading: { textAlign: 'center', fontSize: 14, paddingVertical: 24 },
  emptyCard: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 17 },
  emptyBody: { fontSize: 14, textAlign: 'center', maxWidth: 300 },
  row: { padding: 12 },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { fontSize: 24 },
  info: { flex: 1, gap: 3 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  productName: { fontSize: 14, flexShrink: 1 },
  category: { fontSize: 12 },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  price: { fontSize: 15 },
  comparePrice: { fontSize: 12, textDecorationLine: 'line-through' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 11 },
  actions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
