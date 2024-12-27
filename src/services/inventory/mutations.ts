import { supabase } from '../../lib/supabase';
import type { UpdateInventoryQuantityParams } from './types';
import type { InventoryItem } from '../../types/inventory';

export const updateInventoryQuantity = async (
  params: UpdateInventoryQuantityParams
): Promise<InventoryItem> => {
  // First check if inventory record exists
  const { data: existingInventory } = await supabase
    .from('inventory')
    .select('*')
    .eq('toy_id', params.toyId)
    .single();

  if (!existingInventory) {
    // Create new inventory record if it doesn't exist
    const { data: newInventory, error: createError } = await supabase
      .from('inventory')
      .insert({
        toy_id: params.toyId,
        quantity: params.quantityChange,
        available_quantity: params.quantityChange,
        reserved_quantity: 0,
        location: params.notes?.match(/Location: (.+)/)?.[1] || 'Default',
        status: params.quantityChange <= 5 ? 'low_stock' : 'in_stock'
      })
      .select(`
        *,
        toy:toys (
          name,
          image_url
        )
      `)
      .single();

    if (createError) throw createError;
    if (!newInventory) throw new Error('Failed to create inventory record');
    
    return newInventory;
  }

  // Update existing inventory record
  const { data: updatedInventory, error: updateError } = await supabase
    .from('inventory')
    .update({
      quantity: existingInventory.quantity + params.quantityChange,
      available_quantity: existingInventory.available_quantity + params.quantityChange,
      status: existingInventory.available_quantity + params.quantityChange <= 0 
        ? 'out_of_stock' 
        : existingInventory.available_quantity + params.quantityChange <= 5 
          ? 'low_stock' 
          : 'in_stock',
      updated_at: new Date().toISOString()
    })
    .eq('toy_id', params.toyId)
    .select(`
      *,
      toy:toys (
        name,
        image_url
      )
    `)
    .single();

  if (updateError) throw updateError;
  if (!updatedInventory) throw new Error('Failed to update inventory');

  // Log the transaction
  const { error: logError } = await supabase
    .from('inventory_transactions')
    .insert({
      toy_id: params.toyId,
      quantity_change: params.quantityChange,
      reason: params.reason,
      notes: params.notes
    });

  if (logError) {
    console.error('Failed to log inventory transaction:', logError);
  }

  return updatedInventory;
};