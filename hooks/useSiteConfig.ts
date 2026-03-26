import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteConfig } from '@/lib/types';

interface UseSiteConfigReturn {
  config: SiteConfig | null;
  loading: boolean;
  error: string | null;
  getConfig: () => Promise<void>;
  updateConfig: (input: Partial<SiteConfig>) => Promise<SiteConfig | null>;
}

export function useSiteConfig(): UseSiteConfigReturn {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConfig = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('site_config')
      .select('*')
      .limit(1)
      .single();

    if (err) setError(err.message);
    else setConfig(data as SiteConfig);
    setLoading(false);
  };

  const updateConfig = async (input: Partial<SiteConfig>): Promise<SiteConfig | null> => {
    if (!config?.id) { setError('No hay configuración cargada.'); return null; }
    setError(null);

    const { data, error: err } = await supabase
      .from('site_config')
      .update(input)
      .eq('id', config.id)
      .select()
      .single();

    if (err) { setError(err.message); return null; }
    const updated = data as SiteConfig;
    setConfig(updated);
    return updated;
  };

  return { config, loading, error, getConfig, updateConfig };
}
