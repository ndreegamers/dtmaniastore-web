import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { lightTheme } from '@/lib/theme';

type Theme = typeof lightTheme;

const SectionLabel: React.FC<{ label: string; theme: Theme }> = ({ label, theme }) => (
  <Text style={[sLabelStyles.text, { color: theme.colors.textSecondary, fontFamily: theme.fonts.bodyMedium }]}>
    {label}
  </Text>
);
const sLabelStyles = StyleSheet.create({
  text: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
});

export default function ConfiguracionScreen() {
  const theme = lightTheme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { config, loading, error, getConfig, updateConfig } = useSiteConfig();

  // Form state
  const [siteName, setSiteName] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getConfig();
  }, []);

  // Populate form when config loads
  useEffect(() => {
    if (!config) return;
    setSiteName(config.site_name ?? '');
    setLogoUrl(config.logo_url ?? null);
    setWhatsappNumber(config.whatsapp_number ?? '');
    setWhatsappMessage(config.whatsapp_default_message ?? '');
    setCurrency(config.currency ?? 'PEN');
    setCurrencySymbol(config.currency_symbol ?? 'S/');
    setContactEmail(config.contact_email ?? '');
    setContactPhone(config.contact_phone ?? '');
    setAddress(config.address ?? '');
    setMetaTitle(config.meta_title ?? '');
    setMetaDescription(config.meta_description ?? '');
  }, [config]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!siteName.trim()) newErrors.siteName = 'El nombre del sitio es obligatorio.';
    if (!whatsappNumber.trim()) newErrors.whatsappNumber = 'El número de WhatsApp es obligatorio.';
    if (!/^\d{8,15}$/.test(whatsappNumber.replace(/\s/g, '')))
      newErrors.whatsappNumber = 'Ingresa solo dígitos (código de país + número), ej: 51999999999';
    if (!currency.trim()) newErrors.currency = 'El código de moneda es obligatorio.';
    if (!currencySymbol.trim()) newErrors.currencySymbol = 'El símbolo es obligatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaved(false);

    const updated = await updateConfig({
      site_name: siteName.trim(),
      logo_url: logoUrl,
      whatsapp_number: whatsappNumber.trim(),
      whatsapp_default_message: whatsappMessage.trim(),
      currency: currency.trim().toUpperCase(),
      currency_symbol: currencySymbol.trim(),
      contact_email: contactEmail.trim() || null,
      contact_phone: contactPhone.trim() || null,
      address: address.trim() || null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDescription.trim() || null,
    });

    setSaving(false);
    if (updated) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      if (Platform.OS === 'web') window.alert('Error al guardar la configuración.');
      else Alert.alert('Error', 'No se pudo guardar la configuración.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.page, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={[styles.content, { padding: isDesktop ? 32 : 20 }]} keyboardShouldPersistTaps="handled">

        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Configuración
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Ajustes globales del sitio dtmaniaStore
          </Text>
        </View>

        {error && (
          <Text style={[styles.errorBanner, { color: theme.colors.error, fontFamily: theme.fonts.body }]}>
            {error}
          </Text>
        )}

        <Card theme={theme} style={{ ...styles.card, maxWidth: isDesktop ? 720 : undefined }}>

          {/* ── IDENTIDAD ── */}
          <SectionLabel label="IDENTIDAD DEL SITIO" theme={theme} />

          <Input
            label="Nombre del sitio *"
            placeholder="dtmaniaStore"
            value={siteName}
            onChangeText={setSiteName}
            error={errors.siteName}
            theme={theme}
          />

          <Text style={[styles.fieldLabel, { color: theme.colors.text, fontFamily: theme.fonts.bodyMedium }]}>
            Logo del sitio
          </Text>
          <ImageUploader
            bucket="site"
            folder="logo"
            currentImageUrl={logoUrl}
            onUploadComplete={setLogoUrl}
            theme={theme}
          />

          {/* ── WHATSAPP ── */}
          <SectionLabel label="WHATSAPP" theme={theme} />

          <Input
            label="Número de WhatsApp * (con código de país)"
            placeholder="51999999999"
            value={whatsappNumber}
            onChangeText={setWhatsappNumber}
            keyboardType="phone-pad"
            error={errors.whatsappNumber}
            theme={theme}
          />
          <Text style={[styles.hint, { color: theme.colors.textMuted, fontFamily: theme.fonts.body }]}>
            Incluye el código de país sin el "+". Ej: 51 para Perú.
          </Text>

          <Input
            label="Mensaje predeterminado"
            placeholder="¡Hola! Vi este producto en su web y me interesa:"
            value={whatsappMessage}
            onChangeText={setWhatsappMessage}
            multiline
            numberOfLines={2}
            theme={theme}
          />

          {/* ── MONEDA ── */}
          <SectionLabel label="MONEDA" theme={theme} />

          <View style={styles.row2}>
            <View style={styles.col}>
              <Input
                label="Código *"
                placeholder="PEN"
                value={currency}
                onChangeText={setCurrency}
                autoCapitalize="characters"
                error={errors.currency}
                theme={theme}
              />
            </View>
            <View style={styles.col}>
              <Input
                label="Símbolo *"
                placeholder="S/"
                value={currencySymbol}
                onChangeText={setCurrencySymbol}
                error={errors.currencySymbol}
                theme={theme}
              />
            </View>
          </View>

          {/* ── CONTACTO ── */}
          <SectionLabel label="INFORMACIÓN DE CONTACTO" theme={theme} />

          <Input
            label="Email de contacto"
            placeholder="ventas@compustore.pe"
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={theme}
          />
          <Input
            label="Teléfono fijo"
            placeholder="01 234 5678"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
            theme={theme}
          />
          <Input
            label="Dirección"
            placeholder="Av. Principal 123, Lima, Perú"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            theme={theme}
          />

          {/* ── SEO ── */}
          <SectionLabel label="SEO" theme={theme} />

          <Input
            label="Meta título"
            placeholder="dtmaniaStore — Tu tienda de tecnología"
            value={metaTitle}
            onChangeText={setMetaTitle}
            theme={theme}
          />
          <Input
            label="Meta descripción"
            placeholder="Encuentra las mejores computadoras y periféricos..."
            value={metaDescription}
            onChangeText={setMetaDescription}
            multiline
            numberOfLines={3}
            theme={theme}
          />

          {/* Save button */}
          <View style={styles.saveRow}>
            {saved && (
              <Text style={[styles.savedText, { color: theme.colors.success, fontFamily: theme.fonts.bodyMedium }]}>
                ✓ Configuración guardada
              </Text>
            )}
            <Button
              title={saving ? 'Guardando...' : 'Guardar configuración'}
              onPress={handleSave}
              variant="primary"
              loading={saving}
              theme={theme}
              style={styles.saveBtn}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { gap: 16 },
  pageHeader: { gap: 4 },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 13 },
  errorBanner: { fontSize: 13, textAlign: 'center' },
  card: { width: '100%', paddingVertical: 24 },
  fieldLabel: { fontSize: 14, marginBottom: 6 },
  hint: { fontSize: 12, marginTop: -10, marginBottom: 12 },
  row2: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  saveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 16, marginTop: 8 },
  savedText: { fontSize: 14 },
  saveBtn: { minWidth: 200 },
});
