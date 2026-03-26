import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useCategories } from '@/hooks/useCategories';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { lightTheme } from '@/lib/theme';
import type { Category } from '@/lib/types';

type ViewMode = 'list' | 'create' | 'edit';

export default function CategoriasScreen() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategories();

  const [mode, setMode] = useState<ViewMode>('list');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  const confirm = (message: string, onConfirm: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(message)) onConfirm();
    } else {
      Alert.alert('Confirmar', message, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  const handleDelete = (cat: Category) => {
    confirm(`¿Eliminar la categoría "${cat.name}"?`, async () => {
      await deleteCategory(cat.id);
    });
  };

  const handleToggle = async (cat: Category) => {
    await updateCategory(cat.id, { is_active: !cat.is_active });
  };

  const handleSubmit = async (data: {
    name: string;
    slug: string;
    description: string;
    image_url: string | null;
    parent_id: string | null;
  }) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory({ ...data, sort_order: categories.length });
    }
    setMode('list');
    setEditingCategory(null);
  };

  // Parent categories only (no subcategories of subcategories)
  const rootCategories = categories.filter((c) => c.parent_id === null);

  // --------------------------------------------------
  // Render: Form view
  // --------------------------------------------------
  if (mode === 'create' || mode === 'edit') {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <View style={styles.formHeader}>
          <Text style={[styles.pageTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            {mode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
          </Text>
        </View>
        <CategoryForm
          parentCategories={rootCategories}
          editingCategory={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingCategory(null); }}
          theme={theme}
        />
      </View>
    );
  }

  // --------------------------------------------------
  // Render: List view
  // --------------------------------------------------
  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: isDesktop ? 32 : 20 }]}>
        {/* Header */}
        <View style={styles.listHeader}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
              Categorías
            </Text>
            <Text style={[styles.pageSubtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              {categories.length} categoría{categories.length !== 1 ? 's' : ''} registradas
            </Text>
          </View>
          <Button
            title="+ Nueva categoría"
            onPress={() => { setMode('create'); setEditingCategory(null); }}
            variant="primary"
            theme={theme}
          />
        </View>

        {/* Error banner */}
        {error && (
          <Text style={[styles.errorBanner, { color: theme.colors.error, fontFamily: theme.fonts.body }]}>
            {error}
          </Text>
        )}

        {/* Loading */}
        {loading && (
          <Text style={[styles.loadingText, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Cargando categorías...
          </Text>
        )}

        {/* Empty state */}
        {!loading && categories.length === 0 && (
          <Card theme={theme} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
              Sin categorías
            </Text>
            <Text style={[styles.emptyBody, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              Crea tu primera categoría para organizar los productos.
            </Text>
          </Card>
        )}

        {/* Category rows */}
        {categories.map((cat) => {
          const parent = categories.find((c) => c.id === cat.parent_id);
          return (
            <Card key={cat.id} theme={theme} style={styles.row}>
              <View style={styles.rowMain}>
                {/* Info */}
                <View style={styles.rowInfo}>
                  <View style={styles.rowNameLine}>
                    <Text style={[styles.catName, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
                      {cat.name}
                    </Text>
                    {!cat.is_active && (
                      <View style={[styles.badge, { backgroundColor: theme.colors.textMuted + '25' }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.textMuted }]}>Inactiva</Text>
                      </View>
                    )}
                    {parent && (
                      <View style={[styles.badge, { backgroundColor: theme.colors.primary + '15' }]}>
                        <Text style={[styles.badgeText, { color: theme.colors.primary }]}>↳ {parent.name}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.catSlug, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
                    /{cat.slug}
                  </Text>
                  {cat.description && (
                    <Text
                      numberOfLines={1}
                      style={[styles.catDesc, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}
                    >
                      {cat.description}
                    </Text>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.rowActions}>
                  <TouchableOpacity
                    onPress={() => handleToggle(cat)}
                    style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text style={styles.iconBtnText}>{cat.is_active ? '👁️' : '🚫'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setEditingCategory(cat); setMode('edit'); }}
                    style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text style={styles.iconBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(cat)}
                    style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                  >
                    <Text style={styles.iconBtnText}>🗑️</Text>
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
  page: {
    flex: 1,
  },
  content: {
    gap: 12,
  },
  formHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 24,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  errorBanner: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 24,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 17 },
  emptyBody: { fontSize: 14, textAlign: 'center', maxWidth: 300 },
  row: {
    padding: 14,
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowNameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  catName: {
    fontSize: 15,
  },
  catSlug: {
    fontSize: 12,
  },
  catDesc: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBtnText: {
    fontSize: 14,
  },
});
