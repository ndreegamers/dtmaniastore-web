import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { lightTheme } from '@/lib/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const theme = lightTheme;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } else {
      router.replace('/(admin)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.page, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header brand */}
        <Text style={[styles.brand, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
          dtmania<Text style={{ color: theme.colors.primary }}>Store</Text>
        </Text>

        <Card
          theme={theme}
          style={{
            ...styles.card,
            width: isDesktop ? 420 : '100%',
          }}
        >
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
            Acceso Administrador
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.fonts.body }]}>
            Ingresa tus credenciales para continuar
          </Text>

          <View style={styles.form}>
            <Input
              label="Correo electrónico"
              placeholder="admin@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              theme={theme}
            />

            <Input
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              theme={theme}
            />

            {error && (
              <Text style={[styles.errorBanner, { color: theme.colors.error, fontFamily: theme.fonts.body }]}>
                {error}
              </Text>
            )}

            <Button
              title={loading ? 'Ingresando...' : 'Ingresar'}
              onPress={handleLogin}
              variant="primary"
              loading={loading}
              theme={theme}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 24,
  },
  brand: {
    fontSize: 28,
    letterSpacing: -0.6,
  },
  card: {
    padding: 32,
  },
  title: {
    fontSize: 20,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    gap: 4,
  },
  errorBanner: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
});
