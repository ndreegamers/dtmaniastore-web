import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/hooks/useProducts';
import { ProductForm, type ImageSlot } from '@/components/admin/ProductForm';
import { lightTheme } from '@/lib/theme';

export default function CrearProducto() {
  const theme = lightTheme;
  const router = useRouter();
  const { createProduct } = useProducts();

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
    const imageInputs = images.map((img) => ({
      uri: img.publicUrl,
      publicUrl: img.publicUrl,
      is_primary: img.is_primary,
    }));

    const product = await createProduct(data, imageInputs);
    if (product) {
      router.replace('/(admin)/productos');
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <View style={styles.pageHeader}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          Nuevo Producto
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
          Completa los campos para agregar un producto al catálogo.
        </Text>
      </View>

      <ProductForm
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
});
