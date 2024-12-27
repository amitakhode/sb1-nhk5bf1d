import { useState, useEffect } from 'react';
import { fetchUserAddresses, createAddress, updateAddress } from '../services/addresses';
import type { Database } from '../lib/supabase-types';

type Address = Database['public']['Tables']['addresses']['Row'];

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAddresses = async () => {
    try {
      const data = await fetchUserAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load addresses'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const addAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await createAddress(address);
      await loadAddresses();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add address');
    }
  };

  const updateUserAddress = async (id: string, address: Partial<Address>) => {
    try {
      await updateAddress(id, address);
      await loadAddresses();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update address');
    }
  };

  return { addresses, loading, error, addAddress, updateUserAddress };
};