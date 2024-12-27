import { supabase } from '../lib/supabase';
import type { InventoryItem } from '../types/inventory';

export const getInventoryLevels = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      toy:toys (
        name,
        image_url
      )
    `)
    .order('location');
    
  if (error) throw error;
  return data || [];
};

export const updateInventoryQuantity = async (
  params: UpdateInventoryQuantityParams
): Promise<InventoryItem> => {
  const { data, error } = await supabase.rpc('update_inventory_quantity', {
    p_toy_id: params.toyId,
    p_quantity_change: params.quantityChange,
    p_reason: params.reason,
    p_notes: params.notes
  });

  if (error) throw error;
  if (!data) throw new Error('Failed to update inventory');
  
  return data;
};
// ... rest of the file remains the same