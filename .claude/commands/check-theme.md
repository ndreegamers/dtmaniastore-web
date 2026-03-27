---
description: Detecta colores y estilos hardcodeados que deberían usar lib/theme.ts
---

Audita el uso del sistema de temas en dtmaniaStore.

1. Lee `lib/theme.ts` para entender todos los tokens disponibles (colores, espaciados, tipografías, radios)

2. Busca en `components/` y `app/` archivos con StyleSheet y detecta:
   - **Colores hexadecimales hardcodeados** (ej: `'#ffffff'`, `'#1a1a1a'`) que deberían ser `theme.colors.background` etc.
   - **Valores numéricos de espaciado** hardcodeados que deberían ser `theme.spacing.md` etc.
   - **Font sizes** hardcodeados que deberían usar los tokens de tipografía del tema
   - **Estilos que no cambian entre dark/light mode** pero deberían hacerlo

3. Verifica que el toggle dark/light mode funciona correctamente en todos los componentes:
   - ¿Todos los componentes reciben el tema como prop o lo obtienen del contexto?
   - ¿Hay componentes que ignoran el modo oscuro?

4. Reporta los archivos con más inconsistencias primero (prioridad alta → baja)

5. Para las inconsistencias encontradas, muestra el cambio exacto a realizar (antes/después)
