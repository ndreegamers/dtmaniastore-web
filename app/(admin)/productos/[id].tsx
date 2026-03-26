import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { ProductForm, type ImageSlot } from '@/components/admin/ProductForm';
import { lightTheme } from '@/lib/theme';
import type { Product } from '@/lib/types';

export default function EditarProducto() {
  const theme = lightTheme;
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { getProductById, updateProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await getProductById(id);
      setProduct(data);
      setLoadingProduct(false);
    })();
  }, [id]);

  const handleSubmit = async (
    data: {
      name: string;
      slug: string;
      description: string;
      price: number;
      compare_price: number | null;
      category_id: string | null;
      is_active: boolean;
      is_featured: boolean;
    },
    images: ImageSlot[]
  ) => {
    if (!id) return;

    const imageInputs = images.map((img) => ({
      uri: img.publicUrl,
      publicUrl: img.publicUrl,
      is_primary: img.is_primary,
    }));

    const updated = await updateProduct(id, data, imageInputs);
    if (updated) {
      router.replace('/(admin)/productos');
    }
  };

  if (loadingProduct) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.notFound, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
          Producto no encontrado.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <View style={styles.pageHeader}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Editar Producto
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}
          numberOfLines={1}
        >
          {product.name}
        </Text>
      </View>

      <ProductForm
        editingProduct={product}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 4,
  },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { fontSize: 15, textAlign: 'center' },
});
