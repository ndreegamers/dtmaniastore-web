---
description: Genera una nueva página Expo Router con la estructura correcta del proyecto
---

Crea una nueva página para dtmaniaStore.

Pregunta al usuario:
1. **Ruta** de la página (ej: `categorias/[slug]`, `sobre-nosotros`, `admin/reportes`)
2. **Tipo**: pública `(public)/` o admin `(admin)/`
3. **Necesita parámetros dinámicos** (ruta con `[param]`)?
4. **Fuente de datos**: qué hook o tabla de Supabase usará

Genera el archivo en `app/(public|admin)/{ruta}.tsx` siguiendo estas reglas:

- Usa el hook adecuado de `hooks/` para los datos (nunca llames a Supabase directamente en la página)
- Incluye estado de carga con `Skeleton` de `@/components/ui/Skeleton`
- Incluye manejo de error con mensaje amigable
- Para páginas admin: verifica autenticación con `useAuth` de `@/hooks/useAuth`
- Usa `Stack.Screen` de Expo Router para configurar el título de la página
- Importa colores/espaciados desde `@/lib/theme`
- TypeScript estricto con tipos importados de `@/lib/types`

Si la página necesita un hook que no existe aún, indica que también hay que crearlo con `/supabase-query`.
