import { useEffect } from 'react';
import { Stack } from 'expo-router';
import Head from 'expo/head';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

// Evita que la pantalla de carga se oculte antes de tener las fuentes listas
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Head>
        <title>dtmaniaStore</title>
      </Head>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
