import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { lightTheme, type Theme } from '@/lib/theme';
import type { Category } from '@/lib/types';

// Simple slug generator (full version lives in lib/utils/generateSlug.ts)
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface CategoryFormProps {
  parentCategories?: Category[];
  editingCategory?: Category | null;
  onSubmit: (data: {
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
    parent_id: string | null;
  }) => Promise<void>;
  onCancel: () => void;
  theme?: Theme;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  parentCategories = [],
  editingCategory = null,
  onSubmit,
  onCancel,
  theme = lightTheme,
}) => {
  const [name, setName] = useState(editingCategory?.name ?? '');
  const [slug, setSlug] = useState(editingCategory?.slug ?? '');
  const [description, setDescription] = useState(editingCategory?.description ?? '');
  const [imageUrl, setImageUrl] = useState<string | null>(editingCategory?.image_url ?? null);
  const [parentId, setParentId] = useState<string | null>(editingCategory?.parent_id ?? null);
  const [submitting, setSubmitting] = useState(false);

  // Auto-generate slug from name when creating
  useEffect(() => {
    if (!editingCategory) {
      setSlug(toSlug(name));
    }
  }, [name, editingCategory]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!slug.trim()) newErrors.slug = 'El slug es obligatorio.';
    if (!/^[a-z0-9-]+$/.test(slug))
      newErrors.slug = 'Solo letras minúsculas, números y guiones.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image_url: imageUrl,
        parent_id: parentId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageError = (msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Error de imagen', msg);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.bodyMedium }]}>
        IMAGEN DE CATEGORÍA
      </Text>
      <ImageUploader
        bucket="site"
        folder="categories"
        currentImageUrl={imageUrl}
        onUploadComplete={(url) => setImageUrl(url)}
        onError={handleImageError}
        theme={theme}
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.bodyMedium }]}>
        INFORMACIÓN
      </Text>

      <Input
        label="Nombre *"
        placeholder="Ej: Computadoras"
        value={name}
        onChangeText={setName}
        error={errors.name}
        theme={theme}
      />

      <Input
        label="Slug (URL) *"
        placeholder="computadoras"
        value={slug}
        onChangeText={setSlug}
        autoCapitalize="none"
        error={errors.slug}
        theme={theme}
      />

      <Input
        label="Descripción"
        placeholder="Descripción breve de la categoría..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        theme={theme}
      />

      {/* Parent category selector */}
      {parentCategories.length > 0 && (
        <View style={styles.parentSection}>
          <Text style={[styles.fieldLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
            Categoría padre (opcional)
          </Text>
          <View style={styles.parentOptions}>
            <Button
              title="Ninguna (principal)"
              onPress={() => setParentId(null)}
              variant={parentId === null ? 'primary' : 'outline'}
              theme={theme}
              style={styles.parentBtn}
            />
            {parentCategories
              .filter((c) => c.id !== editingCategory?.id)
              .map((cat) => (
                <Button
                  key={cat.id}
                  title={cat.name}
                  onPress={() => setParentId(cat.id)}
                  variant={parentId === cat.id ? 'primary' : 'outline'}
                  theme={theme}
                  style={styles.parentBtn}
                />
              ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Cancelar"
          onPress={onCancel}
          variant="secondary"
          theme={theme}
          style={styles.actionBtn}
        />
        <Button
          title={editingCategory ? 'Guardar cambios' : 'Crear categoría'}
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

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  parentSection: {
    marginTop: 4,
    marginBottom: 8,
    gap: 8,
  },
  parentOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 36,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
  },
});
