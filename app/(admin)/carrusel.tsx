import React, { useEffect, useState } from 'react';
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
import { useCarousel } from '@/hooks/useCarousel';
import { CarouselManager } from '@/components/admin/CarouselManager';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { lightTheme } from '@/lib/theme';
import type { CarouselSlide } from '@/lib/types';

type ViewMode = 'list' | 'create' | 'edit';

export default function CarruselScreen() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { slides, loading, error, fetchSlides, createSlide, updateSlide, deleteSlide, reorderSlides } =
    useCarousel();

  const [mode, setMode] = useState<ViewMode>('list');
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const confirm = (msg: string, onOk: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(msg)) onOk();
    } else {
      Alert.alert('Confirmar', msg, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onOk },
      ]);
    }
  };

  const handleDelete = (slide: CarouselSlide) => {
    confirm(`¿Eliminar el slide "${slide.title ?? 'sin título'}"?`, () => deleteSlide(slide.id));
  };

  const handleToggle = async (slide: CarouselSlide) => {
    await updateSlide(slide.id, { is_active: !slide.is_active });
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const ids = slides.map((s) => s.id);
    [ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]];
    reorderSlides(ids);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === slides.length - 1) return;
    const ids = slides.map((s) => s.id);
    [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]];
    reorderSlides(ids);
  };

  const handleSubmit = async (data: {
    image_url: string;
    image_url_mobile: string | null;
    title: string | null;
    subtitle: string | null;
    link_url: string | null;
    link_text: string | null;
    is_active: boolean;
  }) => {
    if (editingSlide) {
      await updateSlide(editingSlide.id, data);
    } else {
      await createSlide({ ...data, sort_order: slides.length });
    }
    setMode('list');
    setEditingSlide(null);
  };

  // ── Form view ──
  if (mode === 'create' || mode === 'edit') {
    return (
      <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
        <View style={styles.pageHeader}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            {mode === 'create' ? 'Nuevo Slide' : 'Editar Slide'}
          </Text>
        </View>
        <CarouselManager
          editingSlide={editingSlide}
          onSubmit={handleSubmit}
          onCancel={() => { setMode('list'); setEditingSlide(null); }}
          theme={theme}
        />
      </View>
    );
  }

  // ── List view ──
  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: isDesktop ? 32 : 20 }]}>

        {/* Header */}
        <View style={styles.listHeader}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
              Carrusel
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              {slides.length} slide{slides.length !== 1 ? 's' : ''} configurados
            </Text>
          </View>
          <Button
            title="+ Nuevo slide"
            onPress={() => { setMode('create'); setEditingSlide(null); }}
            variant="primary"
            theme={theme}
          />
        </View>

        {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
        {loading && <Text style={[styles.loadingText, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>Cargando slides...</Text>}

        {/* Empty state */}
        {!loading && slides.length === 0 && (
          <Card theme={theme} style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🖼️</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
              Sin slides
            </Text>
            <Text style={[styles.emptyBody, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              Agrega el primer banner para el carrusel del sitio.
            </Text>
          </Card>
        )}

        {/* Slide rows */}
        {slides.map((slide, idx) => (
          <Card key={slide.id} theme={theme} style={styles.row}>
            <View style={styles.rowInner}>
              {/* Thumbnail */}
              <View style={[styles.thumb, { backgroundColor: theme.colors.borderLight, borderRadius: theme.borderRadius.md }]}>
                <Image source={{ uri: slide.image_url }} style={styles.thumbImg} resizeMode="cover" />
              </View>

              {/* Info */}
              <View style={styles.info}>
                <View style={styles.nameLine}>
                  <Text style={[styles.slideTitle, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]} numberOfLines={1}>
                    {slide.title ?? <Text style={{ color: theme.colors.textMuted, fontStyle: 'italic' }}>Sin título</Text>}
                  </Text>
                  {!slide.is_active && (
                    <View style={[styles.badge, { backgroundColor: theme.colors.textMuted + '25' }]}>
                      <Text style={[styles.badgeText, { color: theme.colors.textMuted }]}>Inactivo</Text>
                    </View>
                  )}
                </View>
                {slide.subtitle && (
                  <Text style={[styles.slideSubtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]} numberOfLines={1}>
                    {slide.subtitle}
                  </Text>
                )}
                {slide.link_url && (
                  <Text style={[styles.slideLink, { color: theme.colors.primary, fontFamily: theme.fonts.body }]} numberOfLines={1}>
                    → {slide.link_url}
                  </Text>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleMoveUp(idx)} style={[styles.iconBtn, { borderColor: theme.colors.border }]}>
                  <Text>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMoveDown(idx)} style={[styles.iconBtn, { borderColor: theme.colors.border }]}>
                  <Text>↓</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggle(slide)} style={[styles.iconBtn, { borderColor: theme.colors.border }]}>
                  <Text>{slide.is_active ? '👁️' : '🚫'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setEditingSlide(slide); setMode('edit'); }}
                  style={[styles.iconBtn, { borderColor: theme.colors.border }]}
                >
                  <Text>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(slide)} style={[styles.iconBtn, { borderColor: theme.colors.border }]}>
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  pageHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  content: { gap: 12 },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  errorText: { fontSize: 13, textAlign: 'center' },
  loadingText: { textAlign: 'center', fontSize: 14, paddingVertical: 24 },
  emptyCard: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 17 },
  emptyBody: { fontSize: 14, textAlign: 'center', maxWidth: 300 },
  row: { padding: 12 },
  rowInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 80, height: 52, overflow: 'hidden' },
  thumbImg: { width: '100%', height: '100%' },
  info: { flex: 1, gap: 3 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  slideTitle: { fontSize: 14, flexShrink: 1 },
  slideSubtitle: { fontSize: 12 },
  slideLink: { fontSize: 12 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 11 },
  actions: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' },
  iconBtn: { width: 32, height: 32, borderWidth: 1, borderRadius: 7, justifyContent: 'center', alignItems: 'center' },
});
