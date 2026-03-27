import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductImage } from '@/lib/types';

interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number | null;
  category_ids?: string[];
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  compare_price?: number | null;
  category_ids?: string[];
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

interface ImageInput {
  uri: string;           // local URI or already-uploaded URL
  is_primary: boolean;
  publicUrl?: string;    // set after upload
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
  createProduct: (input: CreateProductInput, images: ImageInput[]) => Promise<Product | null>;
  updateProduct: (id: string, input: UpdateProductInput, images?: ImageInput[]) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
}

// -------------------------------------------------------
// Helper: transforms raw Supabase row → Product with categories[]
// -------------------------------------------------------
function normalizeProduct(raw: any): Product {
  const categories = (raw.product_categories ?? [])
    .map((pc: any) => pc.categories)
    .filter(Boolean);
  const { product_categories, ...rest } = raw;
  return { ...rest, categories } as Product;
}

// -------------------------------------------------------
// Helper: sync product_categories pivot rows
// -------------------------------------------------------
async function syncProductCategories(productId: string, categoryIds: string[]) {
  await supabase.from('product_categories').delete().eq('product_id', productId);
  if (categoryIds.length > 0) {
    await supabase.from('product_categories').insert(
      categoryIds.map((catId) => ({ product_id: productId, category_id: catId }))
    );
  }
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------
  // Fetch all products (with categories + images)
  // -------------------------------------------------------
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('products')
      .select(`
        *,
        product_categories(categories(id, name, slug)),
        images:product_images(*)
      `)
      .order('sort_order', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setProducts((data ?? []).map(normalizeProduct));
    }
    setLoading(false);
  };

  // -------------------------------------------------------
  // Get a single product by ID (full detail)
  // -------------------------------------------------------
  const getProductById = async (id: string): Promise<Product | null> => {
    const { data, error: err } = await supabase
      .from('products')
      .select(`
        *,
        product_categories(categories(id, name, slug)),
        images:product_images(*)
      `)
      .eq('id', id)
      .single();

    if (err) {
      setError(err.message);
      return null;
    }
    return normalizeProduct(data);
  };

  // -------------------------------------------------------
  // Upload images to Supabase Storage and insert rows
  // -------------------------------------------------------
  const uploadAndLinkImages = async (
    productId: string,
    images: ImageInput[]
  ): Promise<void> => {
    for (let i = 0; i < Math.min(images.length, 5); i++) {
      const img = images[i];

      let publicUrl = img.publicUrl ?? '';

      if (!publicUrl && img.uri) {
        const response = await fetch(img.uri);
        const blob = await response.blob();
        const ext = img.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
        const filename = `products/${productId}/${Date.now()}_${i}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from('products')
          .upload(filename, blob, { contentType: `image/${ext}`, upsert: false });

        if (upErr) continue;

        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(filename);

        publicUrl = urlData.publicUrl;
      }

      if (!publicUrl) continue;

      await supabase.from('product_images').insert({
        product_id: productId,
        image_url: publicUrl,
        sort_order: i,
        is_primary: img.is_primary,
      });
    }
  };

  // -------------------------------------------------------
  // Create product
  // -------------------------------------------------------
  const createProduct = async (
    input: CreateProductInput,
    images: ImageInput[] = []
  ): Promise<Product | null> => {
    setError(null);

    const { category_ids = [], ...productData } = input;

    const { data, error: err } = await supabase
      .from('products')
      .insert([{
        ...productData,
        compare_price: productData.compare_price ?? null,
        sort_order: productData.sort_order ?? 0,
        is_active: productData.is_active ?? true,
        is_featured: productData.is_featured ?? false,
      }])
      .select()
      .single();

    if (err) {
      setError(err.message);
      return null;
    }

    const created = data as Product;
    await syncProductCategories(created.id, category_ids);
    await uploadAndLinkImages(created.id, images);
    await fetchProducts();
    return created;
  };

  // -------------------------------------------------------
  // Update product (optionally replace images and categories)
  // -------------------------------------------------------
  const updateProduct = async (
    id: string,
    input: UpdateProductInput,
    images?: ImageInput[]
  ): Promise<Product | null> => {
    setError(null);

    const { category_ids, ...productData } = input;

    const { data, error: err } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (err) {
      setError(err.message);
      return null;
    }

    if (category_ids !== undefined) {
      await syncProductCategories(id, category_ids);
    }

    if (images && images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', id);
      await uploadAndLinkImages(id, images);
    }

    await fetchProducts();
    return data as Product;
  };

  // -------------------------------------------------------
  // Delete product (CASCADE removes product_images + product_categories)
  // -------------------------------------------------------
  const deleteProduct = async (id: string): Promise<boolean> => {
    setError(null);

    const { error: err } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (err) {
      setError(err.message);
      return false;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
