import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/types';

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  parent_id?: string | null;
  sort_order?: number;
}

interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  is_active?: boolean;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (input: CreateCategoryInput) => Promise<Category | null>;
  updateCategory: (id: string, input: UpdateCategoryInput) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setCategories((data as Category[]) ?? []);
    }
    setLoading(false);
  };

  const createCategory = async (input: CreateCategoryInput): Promise<Category | null> => {
    setError(null);
    const { data, error: err } = await supabase
      .from('categories')
      .insert([{ ...input, parent_id: input.parent_id ?? null }])
      .select()
      .single();

    if (err) {
      setError(err.message);
      return null;
    }
    const created = data as Category;
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (
    id: string,
    input: UpdateCategoryInput
  ): Promise<Category | null> => {
    setError(null);
    const { data, error: err } = await supabase
      .from('categories')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (err) {
      setError(err.message);
      return null;
    }
    const updated = data as Category;
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setError(null);
    const { error: err } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (err) {
      setError(err.message);
      return false;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
