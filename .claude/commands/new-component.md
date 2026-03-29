---
description: Genera un nuevo componente React Native siguiendo los patrones del proyecto
---

Crea un nuevo componente para dtmaniaStore.

Pregunta al usuario:
1. **Nombre** del componente (PascalCase, ej: ProductBadge)
2. **Tipo/carpeta**: ui, layout, home, product, o admin
3. **Props principales** que recibirá

Luego genera el archivo en `components/{tipo}/{NombreComponente}.tsx` siguiendo estas reglas:

**TypeScript y estructura:**
- Define una interface `{Nombre}Props` con todas las props
- Importa `lightTheme, type Theme` desde `@/lib/theme`
- El componente recibe `theme?: Theme` como prop con default `lightTheme` (NO usar hook useTheme)
- Usa alias `@/` en todos los imports (nunca rutas relativas `../../`)
- Componente funcional, máximo ~150 líneas
- Si necesita datos de Supabase, usa el hook existente adecuado (`useProducts`, `useCategories`, etc.)

**Estilos — sistema de temas actual:**
- `StyleSheet.create()` para estilos estáticos (sin colores del tema)
- Inline styles para valores que dependen del tema: `{ backgroundColor: theme.colors.surface }`
- NUNCA hardcodear colores hex salvo excepciones documentadas

**Tipografía disponible (usar según jerarquía):**
- `theme.fonts.heading`      → Sora Bold — títulos principales
- `theme.fonts.headingSemi`  → Sora SemiBold — precios, subtítulos destacados
- `theme.fonts.body`         → DM Sans Regular — texto corrido
- `theme.fonts.bodyMedium`   → DM Sans Medium — labels, nombres en listas

**Paleta de colores clave:**
- `theme.colors.primary`       → #1A50D4 (azul profundo) — CTAs, links, acentos
- `theme.colors.accent`        → #0EA5E9 (sky blue) — acentos secundarios
- `theme.colors.surface`       → #F8FAFC — fondo de cards/contenedores
- `theme.colors.surfaceElevated` → #FFFFFF — cards con sombra
- `theme.colors.text`          → #0F172A — texto principal
- `theme.colors.textSecondary` → #475569 — texto secundario
- `theme.colors.border`        → #E2E8F0 — bordes sutiles

**Border radius disponible:**
- `theme.borderRadius.sm` (6) · `md` (10) · `lg` (16) · `xl` (24) · `full` (9999)

**Patrones de cards establecidos:**
```tsx
// Card con sombra (product cards, info blocks)
style={[
  styles.card,
  {
    backgroundColor: theme.colors.surfaceElevated,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
  }
]}
// En StyleSheet.create:
card: {
  borderWidth: 1,
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 3,
}
```

**Plantilla base:**
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightTheme, type Theme } from '@/lib/theme';

interface NombreComponenteProps {
  // props aquí
  theme?: Theme;
}

export const NombreComponente: React.FC<NombreComponenteProps> = ({
  theme = lightTheme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.fonts.heading }]}>
        Título
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.4,
  },
});
```

Muestra el código final y explica brevemente las decisiones de diseño.
