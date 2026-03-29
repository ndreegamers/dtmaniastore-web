# CompuStore — Documento de Arquitectura del Proyecto

**Tipo:** Knowledge Item para Google Antigravity  
**Versión:** 1.0 — MVP  
**Fecha:** Marzo 2026  
**Rol del agente:** Ejecutor de código bajo supervisión del ingeniero principal

---

## 1. VISIÓN GENERAL DEL PRODUCTO

CompuStore es un catálogo web premium de computadoras, componentes y periféricos. **NO es un e-commerce con carrito de compras.** Es una vitrina digital donde el cliente (dueño de la tienda) administra sus productos y los visitantes contactan por WhatsApp para concretar compras.

### Principios de Diseño

- **Elegancia y estilo premium** — Diseño limpio, tipografía refinada, espaciado generoso
- **Velocidad** — La página debe cargar rápido, sin animaciones pesadas
- **Dark/Light mode** — Toggle accesible, preferencia del sistema por defecto
- **Animaciones mínimas** — Solo transiciones sutiles (fade-in, hover states), nada llamativo
- **Seguridad visual** — El sitio debe transmitir confianza y profesionalismo

---

## 2. STACK TECNOLÓGICO

| Tecnología | Propósito |
|---|---|
| Expo SDK 52+ | Framework base |
| Expo Router v4 | File-based routing, SSR-ready |
| React Native Web | Componentes cross-platform |
| Supabase | Auth, Database (PostgreSQL), Storage |
| TypeScript | Tipado estricto en todo el proyecto |

### NO incluir en el MVP

- Google Analytics (se agrega después)
- Sistema de pagos / carrito de compras
- Notificaciones push
- Chat en vivo
- Sistema de reviews/reseñas

---

## 3. ESTRUCTURA DE CARPETAS

```
compustore/
├── app/                          # Expo Router — rutas del sitio
│   ├── _layout.tsx               # Root layout (ThemeProvider, Supabase init)
│   ├── index.tsx                 # Homepage (Hero + Categorías + Destacados)
│   │
│   ├── (public)/                 # Grupo: Sitio público
│   │   ├── _layout.tsx           # Layout público (Header + Footer + WhatsApp FAB)
│   │   ├── categorias/
│   │   │   ├── index.tsx         # Lista de todas las categorías
│   │   │   └── [slug].tsx        # Productos filtrados por categoría
│   │   ├── producto/
│   │   │   └── [id].tsx          # Detalle de producto individual
│   │   ├── buscar.tsx            # Página de búsqueda
│   │   └── contacto.tsx          # Página de contacto / información
│   │
│   ├── (admin)/                  # Grupo: Panel de administración
│   │   ├── _layout.tsx           # Layout admin (Sidebar + Auth guard)
│   │   ├── index.tsx             # Dashboard admin
│   │   ├── carrusel.tsx          # Gestión del carrusel/hero
│   │   ├── productos/
│   │   │   ├── index.tsx         # Lista de productos (tabla)
│   │   │   ├── crear.tsx         # Crear producto nuevo
│   │   │   └── [id].tsx          # Editar producto existente
│   │   ├── categorias.tsx        # CRUD de categorías
│   │   └── configuracion.tsx     # Config del sitio (WhatsApp, nombre, logo)
│   │
│   └── login.tsx                 # Login del administrador
│
├── components/                   # Componentes reutilizables
│   ├── ui/                       # Componentes base (Button, Input, Card, Modal)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── Skeleton.tsx          # Loading skeletons
│   │
│   ├── layout/                   # Componentes de estructura
│   │   ├── Header.tsx            # Navbar público
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── WhatsAppFAB.tsx       # Botón flotante de WhatsApp
│   │   └── ThemeToggle.tsx       # Toggle dark/light
│   │
│   ├── home/                     # Componentes del homepage
│   │   ├── HeroCarousel.tsx      # Carrusel principal
│   │   ├── CategoryGrid.tsx      # Grid de categorías
│   │   └── FeaturedProducts.tsx  # Productos destacados
│   │
│   ├── product/                  # Componentes de producto
│   │   ├── ProductCard.tsx       # Card en grid/lista
│   │   ├── ProductGallery.tsx    # Galería de hasta 5 imágenes
│   │   ├── ProductInfo.tsx       # Nombre, precio, descripción
│   │   └── ProductGrid.tsx       # Grid responsive de productos
│   │
│   └── admin/                    # Componentes del panel admin
│       ├── ImageUploader.tsx     # Upload de imágenes con preview
│       ├── ProductForm.tsx       # Formulario crear/editar producto
│       ├── CarouselManager.tsx   # Gestión de slides del carrusel
│       ├── CategoryForm.tsx      # Form de categoría
│       └── DataTable.tsx         # Tabla reutilizable con acciones
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── supabase.ts               # Cliente Supabase singleton
│   ├── theme.ts                  # Definición de temas (colores, tipografía)
│   ├── types.ts                  # Tipos TypeScript globales
│   ├── constants.ts              # Constantes (tamaños de imagen, límites)
│   └── utils/
│       ├── formatPrice.ts        # Formateo de precios con moneda
│       ├── generateSlug.ts       # Generador de slugs para URLs
│       ├── compressImage.ts      # Compresión de imágenes antes de upload
│       └── whatsapp.ts           # Generador de links de WhatsApp
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts                # Hook de autenticación
│   ├── useProducts.ts            # CRUD de productos
│   ├── useCategories.ts          # CRUD de categorías
│   ├── useCarousel.ts            # CRUD del carrusel
│   ├── useTheme.ts               # Dark/Light mode
│   └── useSiteConfig.ts          # Configuración del sitio
│
├── assets/                       # Assets estáticos
│   ├── fonts/                    # Tipografías custom
│   └── images/                   # Imágenes estáticas (logo, placeholders)
│
├── supabase/                     # Configuración de Supabase
│   └── migrations/               # SQL migrations
│       └── 001_initial_schema.sql
│
└── package.json
```

---

## 4. SCHEMA DE BASE DE DATOS (Supabase / PostgreSQL)

### Tabla: `site_config`

```sql
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'CompuStore',
  logo_url TEXT,
  whatsapp_number TEXT NOT NULL,
  whatsapp_default_message TEXT DEFAULT '¡Hola! Vi este producto en su web y me interesa:',
  currency TEXT NOT NULL DEFAULT 'PEN',
  currency_symbol TEXT NOT NULL DEFAULT 'S/',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  show_prices BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Tabla: `categories`

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;
```

### Tabla: `products`

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
```

### Tabla: `product_images`

```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);

-- Trigger: Máximo 5 imágenes por producto
CREATE OR REPLACE FUNCTION check_max_images()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM product_images WHERE product_id = NEW.product_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 images per product';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_images
  BEFORE INSERT ON product_images
  FOR EACH ROW EXECUTE FUNCTION check_max_images();
```

### Tabla: `carousel_slides`

```sql
CREATE TABLE carousel_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  image_url_mobile TEXT,
  link_url TEXT,
  link_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_carousel_active ON carousel_slides(is_active, sort_order) WHERE is_active = true;
```

### Storage Buckets (Supabase Storage)

| Bucket | Acceso | Max Size | Formatos |
|---|---|---|---|
| `products` | Público | 5MB | jpg/png/webp |
| `carousel` | Público | 10MB | jpg/png/webp |
| `site` | Público | — | — |

### Row Level Security (RLS)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Lectura pública (solo registros activos)
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read carousel" ON carousel_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read site_config" ON site_config FOR SELECT USING (true);

-- Acceso total para admin autenticado
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access carousel" ON carousel_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access product_images" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site_config" ON site_config FOR ALL USING (auth.role() = 'authenticated');
```

### Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON carousel_slides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_config FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 5. TIPOS TYPESCRIPT

```typescript
// lib/types.ts

export interface SiteConfig {
  id: string;
  site_name: string;
  logo_url: string | null;
  whatsapp_number: string;
  whatsapp_default_message: string;
  currency: string;
  currency_symbol: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  show_prices: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  children?: Category[];
  product_count?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  category?: Category;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
}

export interface CarouselSlide {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  image_url_mobile: string | null;
  link_url: string | null;
  link_text: string | null;
  sort_order: number;
  is_active: boolean;
}
```

---

## 6. SISTEMA DE TEMAS (Dark/Light Mode)

> **Actualizado Marzo 2026:** El proyecto usa **Sora** (encabezados) + **DM Sans** (cuerpo). Paleta refinada hacia azul slate profundo + sky blue accent.

```typescript
// lib/theme.ts — estado actual

const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F8FAFC',           // Slate-50 frío
    surfaceHover: '#F1F5F9',      // Slate-100
    surfaceElevated: '#FFFFFF',
    text: '#0F172A',              // Slate-900
    textSecondary: '#475569',     // Slate-600
    textMuted: '#94A3B8',         // Slate-400
    primary: '#1A50D4',           // Azul profundo (era #2563EB)
    primaryHover: '#1339B8',
    accent: '#0EA5E9',            // Sky blue — tech (era morado #7C3AED)
    border: '#E2E8F0',            // Slate-200
    borderLight: '#F1F5F9',       // Slate-100
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    overlay: 'rgba(0,0,0,0.5)',
  },
  fonts: {
    heading: 'Sora_700Bold',          // Geométrica — encabezados H1/H2
    headingSemi: 'Sora_600SemiBold',  // Precios, subtítulos importantes
    body: 'DMSans_400Regular',        // Cuerpo de texto
    bodyMedium: 'DMSans_500Medium',   // Labels, nombres de producto
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  borderRadius: {
    sm: 6, md: 10, lg: 16, xl: 24, full: 9999,
  },
};

const darkTheme = {
  ...lightTheme,
  colors: {
    background: '#0A0F1E',
    surface: '#111827',
    surfaceHover: '#1F2937',
    surfaceElevated: '#1F2937',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textMuted: '#475569',
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    accent: '#38BDF8',
    border: '#1E293B',
    borderLight: '#0F172A',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    overlay: 'rgba(0,0,0,0.7)',
  },
};
```

### Fuentes instaladas

| Paquete | Tokens disponibles |
|---|---|
| `@expo-google-fonts/sora` | `Sora_700Bold`, `Sora_600SemiBold` |
| `@expo-google-fonts/dm-sans` | `DMSans_400Regular`, `DMSans_500Medium`, `DMSans_700Bold` |

### Patrones visuales establecidos (no cambiar sin alinear equipo)

- **Hero Carousel:** Overlay gradiente `linear-gradient(to top, rgba(0,0,0,0.75), transparent)`. CTA usa `theme.colors.primary`.
- **Category Cards:** Sombra `shadowOpacity: 0.07` + `borderRadius.xl`. Sin borde explícito.
- **Product Cards:** Sombra `shadowOpacity: 0.06` + borde `theme.colors.border`. Precio en `headingSemi`.
- **Category Badges (detalle):** Pills con `backgroundColor: '#EFF6FF'`, `borderColor: '#BFDBFE'`, texto en `primary`.
- **Price Block (detalle):** Contenedor con `theme.colors.surface` + padding.
- **Sección oscura (FeaturedProducts):** Fondo `#111827`, acento de línea en `theme.colors.accent`.

---

## 7. LÓGICA DE WHATSAPP

```typescript
// lib/utils/whatsapp.ts

// En página genérica (sin producto):
// "¡Hola! Estoy visitando su web y me interesa obtener información."

// En página de producto:
// "¡Hola! Vi este producto en su web y me interesa: {nombre_producto} — {url_del_producto}"

function generateWhatsAppLink(
  phoneNumber: string,
  productName?: string,
  productUrl?: string,
  defaultMessage?: string
): string {
  let message: string;

  if (productName && productUrl) {
    message = `¡Hola! Vi este producto en su web y me interesa: ${productName} — ${productUrl}`;
  } else if (defaultMessage) {
    message = defaultMessage;
  } else {
    message = '¡Hola! Estoy visitando su web y me interesa obtener información.';
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
```

---

## 8. ÁRBOL DE CATEGORÍAS — ESTRUCTURA INICIAL

| Categoría Principal | Subcategorías |
|---|---|
| Computadoras | Laptops, Desktops, All-in-One |
| Componentes | Procesadores, Memorias RAM, Tarjetas Gráficas, Almacenamiento, Placas Madre, Fuentes de Poder, Cases |
| Periféricos | Monitores, Teclados, Mouse, Audífonos, Webcams, Impresoras |
| Accesorios | Cables, Adaptadores, Mochilas/Maletines, Cooling/Ventilación, Limpieza |

---

## 9. FLUJO DE USUARIO — SITIO PÚBLICO

### Landing (`/`)
1. Hero Carousel (slides configurables)
2. Grid de categorías principales con imagen
3. Sección de productos destacados (`is_featured = true`)
4. Footer con información de contacto

### Categoría (`/categorias/[slug]`)
1. Breadcrumb: Inicio > Categoría
2. Header con nombre y descripción de categoría
3. Grid de productos filtrados
4. Subcategorías si existen

### Producto (`/producto/[id]`)
1. Breadcrumb: Inicio > Categoría > Producto
2. Galería de imágenes (hasta 5, con zoom)
3. Información: nombre, precio, precio comparativo tachado
4. Descripción del producto
5. Botón "Consultar por WhatsApp" (FAB fijo en mobile)
6. Productos relacionados (misma categoría)

### Búsqueda (`/buscar`)
1. Input de búsqueda con debounce (300ms)
2. Búsqueda por nombre y descripción
3. Resultados en grid con highlight del término

---

## 10. FLUJO DE USUARIO — PANEL ADMIN

### Login (`/login`)
- Email + contraseña (Supabase Auth)
- Redirect a `/admin` al autenticarse
- Solo 1 usuario admin (configurado manualmente en Supabase)

### Dashboard (`/admin`)
- Resumen: Total productos, categorías, productos activos
- Accesos rápidos a secciones

### Gestión de Carrusel (`/admin/carrusel`)
- Lista de slides con drag-and-drop para reordenar
- Crear/editar slide: imagen desktop, imagen mobile (opcional), título, subtítulo, link
- Activar/desactivar slides

### Gestión de Productos (`/admin/productos`)
- Tabla con: imagen, nombre, categoría, precio, estado
- Filtros: por categoría, estado (activo/inactivo), destacado
- Acciones: editar, activar/desactivar, eliminar
- Formulario: nombre → slug automático, precio, precio comparativo, categoría, descripción, hasta 5 imágenes, destacado sí/no

### Gestión de Categorías (`/admin/categorias`)
- Lista con drag-and-drop para reordenar
- Crear/editar: nombre → slug automático, descripción, imagen, categoría padre
- Activar/desactivar

### Configuración (`/admin/configuracion`)
- Nombre del sitio, logo, número WhatsApp, mensaje default
- Email, teléfono, dirección
- Moneda y símbolo
- Meta título y descripción (SEO)

---

## 11. CONVENCIONES DE CÓDIGO

### General
- **TypeScript estricto** en todo el proyecto (`strict: true`)
- **Functional components** siempre (no class components)
- **Nombres descriptivos** en inglés para variables y funciones
- **Interfaces** sobre `type` para objetos
- **Async/await** sobre `.then()`

### Estructura de componentes
```typescript
// 1. Imports
import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// 2. Types/Interfaces
interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

// 3. Component
export function ProductCard({ product, onPress }: ProductCardProps) {
  const { theme } = useTheme();
  
  return (
    <View>
      {/* ... */}
    </View>
  );
}

// 4. Styles (si aplica)
```

### Breakpoints (Mobile-first)
```typescript
const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};
```

---

## 12. FASES DE IMPLEMENTACIÓN

### FASE 1 — Fundación (Día 1-2)
- [ ] Crear proyecto Expo con TypeScript
- [ ] Configurar Expo Router con grupos `(public)` y `(admin)`
- [ ] Instalar y configurar Supabase client
- [ ] Ejecutar migration SQL (schema completo)
- [ ] Crear Storage buckets con políticas
- [ ] Implementar sistema de temas (dark/light)
- [ ] Crear componentes UI base (Button, Input, Card)
- [ ] Configurar layouts con Header, Footer, Sidebar

### FASE 2 — Panel Admin (Día 3-5)
- [ ] Login con Supabase Auth
- [ ] Auth guard para rutas admin
- [ ] Dashboard con estadísticas
- [ ] CRUD completo de categorías
- [ ] CRUD completo de productos con upload de imágenes
- [ ] Gestión del carrusel
- [ ] Página de configuración del sitio
- [ ] Ordenamiento drag-and-drop

### FASE 3 — Sitio Público (Día 6-8)
- [ ] Homepage con Hero, Categorías y Destacados
- [ ] Página de categoría con filtrado
- [ ] Página de detalle de producto
- [ ] Búsqueda con debounce
- [ ] WhatsApp FAB y links dinámicos
- [ ] Responsive design completo
- [ ] Loading skeletons

### FASE 4 — Pulido y Deploy (Día 9-10)
- [ ] SEO meta tags
- [ ] Optimización de imágenes
- [ ] Error boundaries
- [ ] 404 pages
- [ ] Testing final cross-browser
- [ ] Deploy a producción

---

## 13. REGLAS PARA EL AGENTE DE ANTIGRAVITY

1. **Siempre usar TypeScript** — Nunca JavaScript plano
2. **Siempre usar colores del tema** — Nunca hardcodear colores
3. **Siempre manejar estados** — Loading, error, empty, success
4. **Siempre validar formularios** — Antes de enviar a Supabase
5. **Siempre usar slugs** — Para URLs amigables
6. **Siempre respetar RLS** — No bypasear las políticas de seguridad
7. **Mobile-first** — Diseñar primero para móvil, luego adaptar
8. **Componentes pequeños** — Máximo ~150 líneas por componente
9. **Hooks para lógica** — Separar lógica de negocio en hooks custom
10. **Imports con @/** — Usar alias de path siempre

---

## 14. DATOS DE PRUEBA (Seed)

> Insertar después de ejecutar el schema completo.

```sql
-- Configuración del sitio
INSERT INTO site_config (site_name, whatsapp_number, currency, currency_symbol, meta_title, meta_description)
VALUES (
  'CompuStore',
  '51999999999',
  'PEN',
  'S/',
  'CompuStore — Tu tienda de tecnología',
  'Encuentra las mejores computadoras, componentes y periféricos al mejor precio.'
);

-- Categorías principales
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Computadoras', 'computadoras', 'Laptops, desktops y equipos completos', 1),
  ('Componentes', 'componentes', 'Todo para armar o mejorar tu PC', 2),
  ('Periféricos', 'perifericos', 'Monitores, teclados, mouse y más', 3),
  ('Accesorios', 'accesorios', 'Cables, adaptadores y complementos', 4);

-- Subcategorías (usar los IDs generados de las categorías principales)
-- NOTA: Ejecutar después de las categorías principales para obtener los parent_id correctos

-- Productos de ejemplo
INSERT INTO products (name, slug, description, price, compare_price, category_id, is_featured) VALUES
  ('Laptop Lenovo IdeaPad 3', 'laptop-lenovo-ideapad-3', 'Procesador AMD Ryzen 5, 8GB RAM, 256GB SSD, Pantalla 15.6" Full HD', 2499.00, 2899.00, (SELECT id FROM categories WHERE slug = 'computadoras'), true),
  ('Procesador AMD Ryzen 7 5800X', 'procesador-amd-ryzen-7-5800x', '8 núcleos, 16 hilos, 3.8GHz base, 4.7GHz boost, Socket AM4', 1299.00, NULL, (SELECT id FROM categories WHERE slug = 'componentes'), true),
  ('Monitor Samsung 27" Curvo', 'monitor-samsung-27-curvo', 'Panel VA, 1920x1080, 75Hz, FreeSync, HDMI + VGA', 899.00, 1099.00, (SELECT id FROM categories WHERE slug = 'perifericos'), true),
  ('Teclado Mecánico Redragon Kumara', 'teclado-mecanico-redragon-kumara', 'Switches Red, RGB, TKL, USB-C desmontable', 189.00, NULL, (SELECT id FROM categories WHERE slug = 'perifericos'), false),
  ('Memoria RAM Kingston Fury 16GB', 'memoria-ram-kingston-fury-16gb', 'DDR4 3200MHz, Disipador de calor, Compatible Intel/AMD', 249.00, 299.00, (SELECT id FROM categories WHERE slug = 'componentes'), false);

-- Slides del carrusel
INSERT INTO carousel_slides (title, subtitle, image_url, link_url, link_text, sort_order) VALUES
  ('Las Mejores Laptops', 'Encuentra el equipo perfecto para ti', '/placeholder-carousel-1.jpg', '/categorias/computadoras', 'Ver Laptops', 1),
  ('Arma tu PC Gamer', 'Componentes de alto rendimiento', '/placeholder-carousel-2.jpg', '/categorias/componentes', 'Ver Componentes', 2),
  ('Periféricos Premium', 'Mejora tu setup con los mejores accesorios', '/placeholder-carousel-3.jpg', '/categorias/perifericos', 'Ver Periféricos', 3);
```
