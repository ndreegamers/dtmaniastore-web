import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { lightTheme, type Theme } from '@/lib/theme';
import type { CarouselSlide } from '@/lib/types';

interface CarouselManagerProps {
  editingSlide?: CarouselSlide | null;
  onSubmit: (data: {
    image_url: string;
    image_url_mobile: string | null;
    title: string | null;
    subtitle: string | null;
    link_url: string | null;
    link_text: string | null;
    is_active: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  theme?: Theme;
}

export const CarouselManager: React.FC<CarouselManagerProps> = ({
  editingSlide = null,
  onSubmit,
  onCancel,
  theme = lightTheme,
}) => {
  const [imageUrl, setImageUrl] = useState(editingSlide?.image_url ?? '');
  const [imageMobileUrl, setImageMobileUrl] = useState(editingSlide?.image_url_mobile ?? '');
  const [title, setTitle] = useState(editingSlide?.title ?? '');
  const [subtitle, setSubtitle] = useState(editingSlide?.subtitle ?? '');
  const [linkUrl, setLinkUrl] = useState(editingSlide?.link_url ?? '');
  const [linkText, setLinkText] = useState(editingSlide?.link_text ?? '');
  const [isActive, setIsActive] = useState(editingSlide?.is_active ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!imageUrl) newErrors.imageUrl = 'La imagen principal es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        image_url: imageUrl,
        image_url_mobile: imageMobileUrl || null,
        title: title.trim() || null,
        subtitle: subtitle.trim() || null,
        link_url: linkUrl.trim() || null,
        link_text: linkText.trim() || null,
        is_active: isActive,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      <SectionLabel label="IMAGEN PRINCIPAL (Desktop) *" theme={theme} />
      <ImageUploader
        bucket="carousel"
        folder="slides"
        currentImageUrl={imageUrl || null}
        onUploadComplete={(url) => { setImageUrl(url); setErrors((e) => ({ ...e, imageUrl: '' })); }}
        theme={theme}
      />
      {errors.imageUrl && (
        <Text style={[styles.fieldError, { color: theme.colors.error, fontFamily: theme.fonts.body }]}>
          {errors.imageUrl}
        </Text>
      )}

      <SectionLabel label="IMAGEN MÓVIL (opcional)" theme={theme} />
      <ImageUploader
        bucket="carousel"
        folder="slides/mobile"
        currentImageUrl={imageMobileUrl || null}
        onUploadComplete={setImageMobileUrl}
        theme={theme}
      />

      <SectionLabel label="CONTENIDO DEL SLIDE" theme={theme} />

      <Input
        label="Título (opcional)"
        placeholder="Las Mejores Laptops"
        value={title}
        onChangeText={setTitle}
        theme={theme}
      />
      <Input
        label="Subtítulo (opcional)"
        placeholder="Encuentra el equipo perfecto para ti"
        value={subtitle}
        onChangeText={setSubtitle}
        theme={theme}
      />

      <SectionLabel label="ENLACE DEL BOTÓN" theme={theme} />

      <Input
        label="URL de destino"
        placeholder="/categorias/computadoras"
        value={linkUrl}
        onChangeText={setLinkUrl}
        autoCapitalize="none"
        theme={theme}
      />
      <Input
        label="Texto del botón"
        placeholder="Ver Laptops"
        value={linkText}
        onChangeText={setLinkText}
        theme={theme}
      />

      <SectionLabel label="ESTADO" theme={theme} />
      <View style={styles.toggleRow}>
        <View style={styles.toggleLabels}>
          <Text style={[styles.toggleLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
            Slide activo
          </Text>
          <Text style={[styles.toggleHint, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Visible en el carrusel del sitio público
          </Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '80' }}
          thumbColor={isActive ? theme.colors.primary : theme.colors.textMuted}
        />
      </View>

      <View style={styles.actions}>
        <Button title="Cancelar" onPress={onCancel} variant="secondary" theme={theme} style={styles.actionBtn} />
        <Button
          title={editingSlide ? 'Guardar cambios' : 'Crear slide'}
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

const SectionLabel: React.FC<{ label: string; theme: Theme }> = ({ label, theme }) => (
  <Text style={[sLabelStyles.text, { color: theme.colors.textSecondary, fontFamily: theme.fonts.bodyMedium }]}>
    {label}
  </Text>
);
const sLabelStyles = StyleSheet.create({
  text: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 12, marginBottom: 8 },
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, gap: 4 },
  fieldError: { fontSize: 12, marginTop: -8, marginBottom: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  toggleLabels: { flex: 1, paddingRight: 12 },
  toggleLabel: { fontSize: 14 },
  toggleHint: { fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn: { flex: 1 },
});
