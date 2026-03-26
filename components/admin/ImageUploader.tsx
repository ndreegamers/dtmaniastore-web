import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { lightTheme, type Theme } from '@/lib/theme';

type StorageBucket = 'products' | 'carousel' | 'site';

interface ImageUploaderProps {
  bucket?: StorageBucket;
  folder?: string;
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
  onError?: (message: string) => void;
  theme?: Theme;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  bucket = 'site',
  folder = 'uploads',
  currentImageUrl,
  onUploadComplete,
  onError,
  theme = lightTheme,
}) => {
  const [previewUri, setPreviewUri] = useState<string | null>(currentImageUrl ?? null);
  const [uploading, setUploading] = useState(false);

  const pickAndUpload = async () => {
    // Request permissions on native
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        onError?.('Se necesita acceso a la galería para subir imágenes.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) return;

    const asset = result.assets[0];
    setPreviewUri(asset.uri);
    setUploading(true);

    try {
      // Fetch the image as a blob (works on web and native with polyfill)
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const ext = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filename = `${folder}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, blob, {
          contentType: asset.mimeType ?? `image/${ext}`,
          upsert: false,
        });

      if (uploadError) {
        onError?.(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);

      onUploadComplete(publicData.publicUrl);
    } catch (err) {
      onError?.('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pickAndUpload}
        disabled={uploading}
        activeOpacity={0.75}
        style={[
          styles.dropzone,
          {
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.preview} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={[styles.placeholderText, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
              Toca para seleccionar imagen
            </Text>
          </View>
        )}

        {uploading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.overlayText}>Subiendo...</Text>
          </View>
        )}
      </TouchableOpacity>

      {previewUri && !uploading && (
        <TouchableOpacity
          onPress={pickAndUpload}
          style={[styles.changeBtn, { borderRadius: theme.borderRadius.sm }]}
        >
          <Text style={[styles.changeBtnText, { color: theme.colors.primary, fontFamily: theme.fonts.bodyMedium }]}>
            Cambiar imagen
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    gap: 8,
  },
  dropzone: {
    width: '100%',
    height: 180,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderIcon: {
    fontSize: 32,
  },
  placeholderText: {
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
  },
  changeBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeBtnText: {
    fontSize: 13,
  },
});
