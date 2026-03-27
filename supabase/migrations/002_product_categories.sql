-- ============================================================
-- Migración: Relación many-to-many productos ↔ categorías
-- Version: 2.0
-- ============================================================

-- =========================
-- Tabla pivote: product_categories
-- =========================
CREATE TABLE product_categories (
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_product  ON product_categories(product_id);
CREATE INDEX idx_product_categories_category ON product_categories(category_id);

-- =========================
-- Migrar datos existentes
-- =========================
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id
FROM products
WHERE category_id IS NOT NULL;

-- =========================
-- Row Level Security
-- =========================
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product_categories"
  ON product_categories FOR SELECT USING (true);

CREATE POLICY "Admin full access product_categories"
  ON product_categories FOR ALL USING (auth.role() = 'authenticated');
