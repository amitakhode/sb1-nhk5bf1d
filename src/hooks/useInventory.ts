import { useState, useEffect } from 'react';
import { getInventoryLevels, updateInventoryQuantity } from '../services/inventory';
import type { InventoryItem } from '../types/inventory';
import type { UpdateInventoryQuantityParams } from '../services/inventory/types';

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventoryLevels();
      setInventory(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load inventory'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateQuantity = async (params: UpdateInventoryQuantityParams) => {
    try {
      await updateInventoryQuantity(params);
      // Reload inventory after update
      await loadInventory();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update inventory');
    }
  };

  return { 
    inventory, 
    loading, 
    error, 
    updateQuantity: handleUpdateQuantity 
  };
};