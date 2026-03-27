---
description: Integra o actualiza links de WhatsApp usando lib/utils/whatsapp.ts
---

Ayuda a integrar WhatsApp como canal de contacto en dtmaniaStore.

Primero lee `lib/utils/whatsapp.ts` para ver las funciones disponibles.

Pregunta al usuario qué quiere hacer:

**A) Añadir botón WhatsApp en una página/componente**
- ¿En qué página o componente?
- ¿Mensaje predefinido o dinámico? (ej: "Hola, me interesa el producto {nombre}")
- ¿Botón flotante (FAB) o inline?

**B) Actualizar el número de WhatsApp**
- Explica que el número se guarda en la tabla `site_config` de Supabase
- El hook `useSiteConfig` de `@/hooks/useSiteConfig` lo provee en toda la app
- No hardcodear el número en componentes, siempre usar el hook

**C) Crear un mensaje de WhatsApp personalizado**
- Define el template del mensaje usando las funciones de `lib/utils/whatsapp.ts`
- El número debe venir de `useSiteConfig().config?.whatsapp_number`

Genera el código necesario siguiendo estos principios:
- El número de WhatsApp SIEMPRE viene de `useSiteConfig`, nunca hardcodeado
- Los links de WhatsApp usan `https://wa.me/{numero}?text={mensaje_encodado}`
- En mobile: `Linking.openURL()` de React Native
- En web: `window.open()` o `<a href>` con `target="_blank"`
