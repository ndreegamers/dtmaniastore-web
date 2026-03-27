import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { useCategories } from '@/hooks/useCategories';
import { lightTheme, type Theme } from '@/lib/theme';
import type { Product, ProductImage } from '@/lib/types';

// ----------------------------------------------------------------
// Slug helper
// ----------------------------------------------------------------
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ----------------------------------------------------------------
// Image slot state
// ----------------------------------------------------------------
export interface ImageSlot {
  publicUrl: string;    // URL already stored in Supabase
  is_primary: boolean;
}

// ----------------------------------------------------------------
// Props
// ----------------------------------------------------------------
interface ProductFormProps {
  editingProduct?: Product | null;
  onSubmit: (
    data: {
      name: string;
      slug: string;
      description: string;
      price: number;
      compare_price: number | null;
      category_ids: string[];
      is_active: boolean;
      is_featured: boolean;
    },
    images: ImageSlot[]
  ) => Promise<void>;
  onCancel: () => void;
  theme?: Theme;
}

const MAX_IMAGES = 5;

export const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct = null,
  onSubmit,
  onCancel,
  theme = lightTheme,
}) => {
  // ---- Text fields ----
  const [name, setName] = useState(editingProduct?.name ?? '');
  const [slug, setSlug] = useState(editingProduct?.slug ?? '');
  const [description, setDescription] = useState(editingProduct?.description ?? '');
  const [price, setPrice] = useState(editingProduct?.price?.toString() ?? '');
  const [comparePrice, setComparePrice] = useState(
    editingProduct?.compare_price?.toString() ?? ''
  );

  // ---- Toggles ----
  const [isActive, setIsActive] = useState(editingProduct?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(editingProduct?.is_featured ?? false);

  // ---- Categories (multi-select) ----
  const [categoryIds, setCategoryIds] = useState<string[]>(
    editingProduct?.categories?.map((c) => c.id) ?? []
  );
  const { categories, fetchCategories } = useCategories();

  // ---- Images ----
  const [images, setImages] = useState<ImageSlot[]>(
    editingProduct?.images
      ? editingProduct.images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img: ProductImage) => ({
            publicUrl: img.image_url,
            is_primary: img.is_primary,
          }))
      : []
  );

  // ---- Validation ----
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-slug on create
  useEffect(() => {
    if (!editingProduct) setSlug(toSlug(name));
  }, [name, editingProduct]);

  // ----------------------------------------------------------------
  // Image management
  // ----------------------------------------------------------------
  const handleImageUploaded = (url: string) => {
    setImages((prev) => {
      if (prev.length >= MAX_IMAGES) return prev;
      const isPrimary = prev.length === 0; // first image is primary
      return [...prev, { publicUrl: url, is_primary: isPrimary }];
    });
  };

  const setPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === index }))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // ensure there's always a primary if images remain
      if (next.length > 0 && !next.some((img) => img.is_primary)) {
        next[0].is_primary = true;
      }
      return next;
    });
  };

  // ----------------------------------------------------------------
  // Validation
  // ----------------------------------------------------------------
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!slug.trim()) newErrors.slug = 'El slug es obligatorio.';
    if (!/^[a-z0-9-]+$/.test(slug))
      newErrors.slug = 'Solo letras minúsculas, números y guiones.';
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0)
      newErrors.price = 'Ingresa un precio válido.';
    if (comparePrice) {
      const cp = parseFloat(comparePrice);
      if (isNaN(cp) || cp < 0)
        newErrors.comparePrice = 'Ingresa un precio comparativo válido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------------------------------------------------------
  // Submit
  // ----------------------------------------------------------------
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(
        {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          price: parseFloat(price),
          compare_price: comparePrice ? parseFloat(comparePrice) : null,
          category_ids: categoryIds,
          is_active: isActive,
          is_featured: isFeatured,
        },
        images
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── IMAGE GALLERY ── */}
      <SectionLabel label="IMÁGENES (máx. 5)" theme={theme} />

      <View style={styles.galleryGrid}>
        {images.map((img, idx) => (
          <View
            key={idx}
            style={[
              styles.thumbWrap,
              img.is_primary && { borderColor: theme.colors.primary, borderWidth: 2 },
            ]}
          >
            <Image source={{ uri: img.publicUrl }} style={styles.thumb} resizeMode="cover" />
            <View style={styles.thumbActions}>
              <TouchableOpacity
                onPress={() => setPrimary(idx)}
                style={[
                  styles.thumbBtn,
                  { backgroundColor: img.is_primary ? theme.colors.primary : theme.colors.overlay },
                ]}
              >
                <Text style={styles.thumbBtnText}>★</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeImage(idx)}
                style={[styles.thumbBtn, { backgroundColor: theme.colors.error }]}
              >
                <Text style={styles.thumbBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            {img.is_primary && (
              <View style={[styles.primaryBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.primaryBadgeText}>Principal</Text>
              </View>
            )}
          </View>
        ))}

        {images.length < MAX_IMAGES && (
          <View style={styles.uploaderSlot}>
            <ImageUploader
              bucket="products"
              folder="items"
              onUploadComplete={handleImageUploaded}
              onError={(msg) => {
                if (Platform.OS === 'web') window.alert(msg);
                else Alert.alert('Error', msg);
              }}
              theme={theme}
            />
          </View>
        )}
      </View>

      <Text style={[styles.hint, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
        Toca ★ para marcar como imagen principal.
      </Text>

      {/* ── INFORMACIÓN BÁSICA ── */}
      <SectionLabel label="INFORMACIÓN BÁSICA" theme={theme} />

      <Input
        label="Nombre del producto *"
        placeholder="Ej: Laptop Lenovo IdeaPad 3"
        value={name}
        onChangeText={setName}
        error={errors.name}
        theme={theme}
      />

      <Input
        label="Slug (URL) *"
        placeholder="laptop-lenovo-ideapad-3"
        value={slug}
        onChangeText={setSlug}
        autoCapitalize="none"
        error={errors.slug}
        theme={theme}
      />

      <Input
        label="Descripción"
        placeholder="Describe las características del producto..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        theme={theme}
      />

      {/* ── PRECIOS ── */}
      <SectionLabel label="PRECIOS" theme={theme} />

      <Input
        label="Precio (S/) *"
        placeholder="0.00"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        error={errors.price}
        theme={theme}
      />

      <Input
        label="Precio comparativo (opcional)"
        placeholder="Precio tachado si hay descuento"
        value={comparePrice}
        onChangeText={setComparePrice}
        keyboardType="decimal-pad"
        error={errors.comparePrice}
        theme={theme}
      />

      {/* ── CATEGORÍAS ── */}
      <SectionLabel label="CATEGORÍAS (puedes elegir varias)" theme={theme} />

      <View style={styles.categoryOptions}>
        {categories
          .filter((c) => c.is_active)
          .map((cat) => {
            const selected = categoryIds.includes(cat.id);
            return (
              <Button
                key={cat.id}
                title={selected ? `✓ ${cat.name}` : cat.name}
                onPress={() =>
                  setCategoryIds((prev) =>
                    selected ? prev.filter((id) => id !== cat.id) : [...prev, cat.id]
                  )
                }
                variant={selected ? 'primary' : 'outline'}
                theme={theme}
                style={styles.catBtn}
              />
            );
          })}
      </View>
      {categoryIds.length === 0 && (
        <Text style={[styles.hint, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
          Sin categoría asignada.
        </Text>
      )}

      {/* ── OPCIONES ── */}
      <SectionLabel label="OPCIONES" theme={theme} />

      <ToggleRow
        label="Producto activo"
        hint="Visible en el catálogo público"
        value={isActive}
        onChange={setIsActive}
        theme={theme}
      />
      <ToggleRow
        label="Producto destacado"
        hint="Aparece en la sección de destacados del home"
        value={isFeatured}
        onChange={setIsFeatured}
        theme={theme}
      />

      {/* ── ACCIONES ── */}
      <View style={styles.actions}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="secondary"
          theme={theme}
          style={styles.actionBtn}
        />
        <Button
          title={editingProduct ? 'Guardar cambios' : 'Crear producto'}
          onPress={handleSubmit}
          variant="primary"
          loading={submitting}
          theme={theme}
          style={styles.actionBtn}
        />
      </View>
    </ScrollView>
  );
};

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------
const SectionLabel: React.FC<{ label: string; theme: Theme }> = ({ label, theme }) => (
  <Text
    style={[
      sectionLabelStyles.text,
      { color: theme.colors.textSecondary, fontFamily: theme.fonts.bodyMedium },
    ]}
  >
    {label}
  </Text>
);
const sectionLabelStyles = StyleSheet.create({
  text: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 12, marginBottom: 8 },
});

const ToggleRow: React.FC<{
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
  theme: Theme;
}> = ({ label, hint, value, onChange, theme }) => (
  <View style={toggleStyles.row}>
    <View style={toggleStyles.labels}>
      <Text style={[toggleStyles.label, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
        {label}
      </Text>
      <Text style={[toggleStyles.hint, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
        {hint}
      </Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
      thumbColor={value ? theme.colors.primary : theme.colors.textMuted}
    />
  </View>
);
const toggleStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  labels: { flex: 1, paddingRight: 12 },
  label: { fontSize: 14 },
  hint: { fontSize: 12, marginTop: 2 },
});

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------
const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, gap: 4 },
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: {
    width: 100,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0,
    position: 'relative',
  },
  thumb: { width: '100%', height: '100%' },
  thumbActions: {
    position: 'absolute',
    top: 4,
    right: 4,
    gap: 4,
  },
  thumbBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  primaryBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 3,
    alignItems: 'center',
  },
  primaryBadgeText: { color: '#fff', fontSize: 10 },
  uploaderSlot: { width: 100, height: 100 },
  hint: { fontSize: 12, marginTop: 4 },
  categoryOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catBtn: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 36 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn: { flex: 1 },
});
