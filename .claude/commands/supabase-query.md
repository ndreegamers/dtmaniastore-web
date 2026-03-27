---
description: Crea o extiende un hook de Supabase en hooks/ con tipos y manejo de estado correcto
---

Crea o extiende un hook de datos para dtmaniaStore.

Pregunta al usuario:
1. **¿Hook nuevo o existente?** (si existente, ¿cuál?)
2. **Tabla(s) de Supabase** que usará (`products`, `categories`, `carousel_slides`, `product_images`, `site_config`)
3. **Operación**: solo lectura, CRUD completo, o específica
4. **Filtros o parámetros** (ej: por categoría, activos únicamente, ordenados por precio)
5. **¿Solo admin o también público?** (determina Row Level Security)

Genera el hook en `hooks/use{Nombre}.ts` siguiendo estas reglas:

- Importa el cliente desde `@/lib/supabase` (nunca crees uno nuevo)
- Usa los tipos de `@/lib/types` para tipar los datos
- Estados requeridos: `data`, `loading: boolean`, `error: string | null`
- Para mutaciones (insert/update/delete): incluye función que retorna `{ error }`
- Para queries de lectura: llama automáticamente al montar el componente
- Maneja errores de Supabase mostrando `error.message`
- Si la operación es solo admin, documenta que requiere auth activa

Muestra el hook completo y los ajustes necesarios en `lib/types.ts` si hacen falta tipos nuevos.
