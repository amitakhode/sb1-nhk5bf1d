import { supabase } from '../../lib/supabase';
import type { InventoryItem } from '../../types/inventory';

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