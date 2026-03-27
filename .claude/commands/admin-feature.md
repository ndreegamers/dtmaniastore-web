---
description: Scaffolding de CRUD completo para una nueva feature en el panel admin
---

Crea una nueva feature para el panel admin de dtmaniaStore.

Pregunta al usuario:
1. **Nombre de la feature** (ej: Descuentos, Marcas, Banners)
2. **Tabla de Supabase** asociada (o si hay que crear una nueva)
3. **Campos del formulario** con sus tipos
4. **¿Incluye subida de imágenes?** (a qué bucket de Supabase Storage)

Genera los siguientes archivos:

**1. Hook:** `hooks/use{Feature}.ts`
- CRUD completo: list, create, update, delete
- Tipos en `lib/types.ts`

**2. Página admin:** `app/(admin)/{feature}.tsx`
- Tabla/lista con los registros
- Botón "Nuevo" que abre formulario
- Botón editar/eliminar por fila
- Confirmación antes de eliminar
- Verifica auth con `useAuth` al cargar

**3. Componente formulario:** `components/admin/{Feature}Form.tsx`
- Validación de campos requeridos
- Si tiene imagen: usa el patrón de `ImageUploader` existente en `components/admin/`
- Feedback visual al guardar (loading state en botón)

Sigue exactamente los mismos patrones visuales del admin existente (mismo estilo de tabla, mismo estilo de formulario que `ProductForm` o `CategoryForm`).
