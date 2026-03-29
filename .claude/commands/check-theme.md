---
description: Detecta colores y estilos hardcodeados que deberían usar lib/theme.ts
---

Audita el uso del sistema de temas en dtmaniaStore.

1. Lee `lib/theme.ts` para entender todos los tokens disponibles.

2. Busca en `components/` y `app/` archivos con StyleSheet y detecta:
   - **Colores hex hardcodeados** que deberían ser `theme.colors.X`
   - **Font families hardcodeadas** que deberían ser `theme.fonts.X`
   - **Estilos que no cambian entre dark/light mode** pero deberían

3. **Excepciones permitidas** — estos valores hardcodeados son intencionales, NO reportarlos:
   - `'#25D366'` — verde WhatsApp (color de marca externa)
   - `'#111827'` — fondo oscuro de la sección FeaturedProducts
   - `'#EFF6FF'` y `'#BFDBFE'` — colores del pill badge de categoría en ProductDetail
   - `'rgba(255,255,255,...)'` — overlays sobre imágenes del carousel
   - `'rgba(0,0,0,...)'` — gradiente del carousel hero

4. **Tokens de fuente actuales** (verificar que se usen correctamente):
   - `theme.fonts.heading`     → `Sora_700Bold` — títulos de sección, nombre de producto en detalle
   - `theme.fonts.headingSemi` → `Sora_600SemiBold` — precios en cards y detalle
   - `theme.fonts.body`        → `DMSans_400Regular` — texto corrido, descripciones
   - `theme.fonts.bodyMedium`  → `DMSans_500Medium` — nombres en cards, labels, nav

5. **Colores primary/accent actuales** (detectar si algún componente usa valores viejos):
   - primary viejo: `#2563EB` → nuevo: `#1A50D4`
   - accent viejo: `#7C3AED` → nuevo: `#0EA5E9`
   - surface viejo: `#F8F9FA` → nuevo: `#F8FAFC`
   - text viejo: `#1A1A2E` → nuevo: `#0F172A`

6. Verifica que el tema se pasa como prop correctamente:
   - Los componentes reciben `theme?: Theme` como prop
   - El default es `lightTheme` (NO hay hook useTheme() en este proyecto)

7. Reporta archivos con más inconsistencias primero (prioridad alta → baja)

8. Muestra el cambio exacto (antes/después) para cada inconsistencia encontrada
