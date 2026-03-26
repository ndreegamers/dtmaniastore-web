-- ============================================================
-- CompuStore — Initial Database Schema
-- Version: 1.0 — MVP
-- ============================================================

-- =========================
-- Tabla: site_config
-- =========================
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

-- =========================
-- Tabla: categories
-- =========================
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

-- =========================
-- Tabla: products
-- =========================
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

-- =========================
-- Tabla: product_images
-- =========================
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

-- =========================
-- Tabla: carousel_slides
-- =========================
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

-- =========================
-- Row Level Security (RLS)
-- =========================
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

-- =========================
-- Trigger: updated_at automático
-- =========================
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

-- =========================
-- Datos de prueba (Seed)
-- =========================

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
