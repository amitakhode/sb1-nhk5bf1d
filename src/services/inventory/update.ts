import { supabase } from '../../lib/supabase';
import type { UpdateInventoryQuantityParams } from './types';

export const updateInventoryQuantity = async (params: UpdateInventoryQuantityParams) => {
  const { data, error } = await supabase.rpc('update_inventory_quantity', {
    p_toy_id: params.toyId,
    p_quantity_change: params.quantityChange,
    p_reason: params.reason,
    p_notes: params.notes
  });

  if (error) throw error;
  return data;
};

export const logInventoryTransaction = async (params: UpdateInventoryQuantityParams) => {
  const { error } = await supabase
    .from('inventory_transactions')
    .insert({
      toy_id: params.toyId,
      quantity_change: params.quantityChange,
      reason: params.reason,
      notes: params.notes
    });

  if (error) throw error;
};