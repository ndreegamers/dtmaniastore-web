---
description: Audita la consistencia de tipos TypeScript entre lib/types.ts, hooks y componentes
---

Realiza una auditoría completa de tipos TypeScript en dtmaniaStore.

1. Lee `lib/types.ts` para ver todas las interfaces definidas

2. Revisa cada hook en `hooks/` y verifica:
   - ¿Usa los tipos de `lib/types.ts` o define los suyos propios duplicados?
   - ¿Los campos del tipo coinciden con lo que devuelve Supabase?
   - ¿Hay campos opcionales que deberían ser requeridos o viceversa?

3. Revisa los componentes críticos en `components/` y verifica:
   - ¿Las props usan `React.FC<Props>` o typing inline?
   - ¿Hay props con tipo `any` que deberían tiparse correctamente?
   - ¿Los componentes de producto/categoría usan los tipos de `lib/types.ts`?

4. Reporta:
   - **Inconsistencias encontradas** (con archivo y línea)
   - **Tipos duplicados** que podrían unificarse
   - **Tipos faltantes** que sería útil agregar
   - **Sugerencias de mejora** priorizadas

Propón las correcciones concretas solo si son simples. Para cambios grandes, lista qué habría que modificar.
