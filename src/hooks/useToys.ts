import { useState, useEffect } from 'react';
import { fetchToys, fetchToyById } from '../services/toys';
import type { Database } from '../lib/supabase-types';

type Toy = Database['public']['Tables']['toys']['Row'];

export const useToys = (category?: string, minAge?: number, maxAge?: number) => {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadToys = async () => {
      try {
        const data = await fetchToys(category, minAge, maxAge);
        setToys(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load toys'));
      } finally {
        setLoading(false);
      }
    };

    loadToys();
  }, [category, minAge, maxAge]);

  return { toys, loading, error };
};

export const useToyDetails = (id: string) => {
  const [toy, setToy] = useState<Toy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadToy = async () => {
      try {
        const data = await fetchToyById(id);
        setToy(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load toy details'));
      } finally {
        setLoading(false);
      }
    };

    loadToy();
  }, [id]);

  return { toy, loading, error };
};