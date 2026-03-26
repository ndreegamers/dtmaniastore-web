import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { CarouselSlide } from '@/lib/types';

interface SlideInput {
  title?: string | null;
  subtitle?: string | null;
  image_url: string;
  image_url_mobile?: string | null;
  link_url?: string | null;
  link_text?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

interface UseCarouselReturn {
  slides: CarouselSlide[];
  loading: boolean;
  error: string | null;
  fetchSlides: () => Promise<void>;
  createSlide: (input: SlideInput) => Promise<CarouselSlide | null>;
  updateSlide: (id: string, input: Partial<SlideInput>) => Promise<CarouselSlide | null>;
  deleteSlide: (id: string) => Promise<boolean>;
  reorderSlides: (orderedIds: string[]) => Promise<void>;
}

export function useCarousel(): UseCarouselReturn {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlides = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('carousel_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (err) setError(err.message);
    else setSlides((data as CarouselSlide[]) ?? []);
    setLoading(false);
  };

  const createSlide = async (input: SlideInput): Promise<CarouselSlide | null> => {
    setError(null);
    const { data, error: err } = await supabase
      .from('carousel_slides')
      .insert([{
        ...input,
        sort_order: input.sort_order ?? slides.length,
        is_active: input.is_active ?? true,
      }])
      .select()
      .single();

    if (err) { setError(err.message); return null; }
    const created = data as CarouselSlide;
    setSlides((prev) => [...prev, created]);
    return created;
  };

  const updateSlide = async (
    id: string,
    input: Partial<SlideInput>
  ): Promise<CarouselSlide | null> => {
    setError(null);
    const { data, error: err } = await supabase
      .from('carousel_slides')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (err) { setError(err.message); return null; }
    const updated = data as CarouselSlide;
    setSlides((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteSlide = async (id: string): Promise<boolean> => {
    setError(null);
    const { error: err } = await supabase
      .from('carousel_slides')
      .delete()
      .eq('id', id);

    if (err) { setError(err.message); return false; }
    setSlides((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  // Update sort_order for each slide based on new order array
  const reorderSlides = async (orderedIds: string[]): Promise<void> => {
    setError(null);
    // Optimistic update
    setSlides((prev) => {
      const map = new Map(prev.map((s) => [s.id, s]));
      return orderedIds
        .map((id, idx) => {
          const slide = map.get(id);
          return slide ? { ...slide, sort_order: idx } : null;
        })
        .filter(Boolean) as CarouselSlide[];
    });

    // Persist each sort_order update
    await Promise.all(
      orderedIds.map((id, idx) =>
        supabase
          .from('carousel_slides')
          .update({ sort_order: idx })
          .eq('id', id)
      )
    );
  };

  return { slides, loading, error, fetchSlides, createSlide, updateSlide, deleteSlide, reorderSlides };
}
