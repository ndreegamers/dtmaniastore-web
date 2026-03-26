import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductImage } from '@/lib/types';

interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number | null;
  category_id?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  sort_order?: number;
}

interface UpdateProductInput extends Partial<CreateProductInput> {}

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

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------
  // Fetch all products (with primary image + category name)
  // -------------------------------------------------------
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(*)
      `)
      .order('sort_order', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setProducts((data as Product[]) ?? []);
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
        category:categories(id, name, slug),
        images:product_images(*)
      `)
      .eq('id', id)
      .single();

    if (err) {
      setError(err.message);
      return null;
    }
    return data as Product;
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

      // If the image already has a publicUrl it was uploaded by ImageUploader
      let publicUrl = img.publicUrl ?? '';

      // If it's a local URI (not yet uploaded), upload now
      if (!publicUrl && img.uri) {
        const response = await fetch(img.uri);
        const blob = await response.blob();
        const ext = img.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
        const filename = `products/${productId}/${Date.now()}_${i}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from('products')
          .upload(filename, blob, { contentType: `image/${ext}`, upsert: false });

        if (upErr) continue; // skip on error, don't block the product save

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

    const { data, error: err } = await supabase
      .from('products')
      .insert([{
        ...input,
        category_id: input.category_id ?? null,
        compare_price: input.compare_price ?? null,
        sort_order: input.sort_order ?? 0,
        is_active: input.is_active ?? true,
        is_featured: input.is_featured ?? false,
      }])
      .select()
      .single();

    if (err) {
      setError(err.message);
      return null;
    }

    const created = data as Product;
    await uploadAndLinkImages(created.id, images);
    await fetchProducts(); // refresh full list with images
    return created;
  };

  // -------------------------------------------------------
  // Update product (optionally replace images)
  // -------------------------------------------------------
  const updateProduct = async (
    id: string,
    input: UpdateProductInput,
    images?: ImageInput[]
  ): Promise<Product | null> => {
    setError(null);

    const { data, error: err } = await supabase
      .from('products')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (err) {
      setError(err.message);
      return null;
    }

    // If new images array provided, replace existing
    if (images && images.length > 0) {
      // Delete old images rows (storage files remain, acceptable for MVP)
      await supabase.from('product_images').delete().eq('product_id', id);
      await uploadAndLinkImages(id, images);
    }

    await fetchProducts();
    return data as Product;
  };

  // -------------------------------------------------------
  // Delete product (CASCADE removes product_images rows)
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
