---
description: Genera un nuevo componente React Native siguiendo los patrones del proyecto
---

Crea un nuevo componente para dtmaniaStore.

Pregunta al usuario:
1. **Nombre** del componente (PascalCase, ej: ProductBadge)
2. **Tipo/carpeta**: ui, layout, home, product, o admin
3. **Props principales** que recibirá

Luego genera el archivo en `components/{tipo}/{NombreComponente}.tsx` siguiendo estas reglas:

- TypeScript estricto: define una interface `{Nombre}Props` con todas las props
- Importa `useTheme` o los colores desde `@/lib/theme`
- Usa `StyleSheet.create()` con los colores del tema (no hardcodes hex)
- Usa alias `@/` en todos los imports (nunca rutas relativas `../../`)
- Componente funcional, máximo ~150 líneas
- Si necesita datos de Supabase, usa el hook existente adecuado (`useProducts`, `useCategories`, etc.) en lugar de llamar directamente al cliente

Muestra el código final y explica brevemente las decisiones de diseño.
