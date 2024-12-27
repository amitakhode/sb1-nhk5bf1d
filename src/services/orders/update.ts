import { supabase } from '../../lib/supabase';
import type { OrderStatus } from '../../types/orders';

export const updateOrder = async (orderId: string, updates: { status: OrderStatus }) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .update(updates)
      .eq('id', orderId)
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          phone
        ),
        delivery_address:address_id (*),
        items:rental_items (
          id,
          toy:toy_id (
            name,
            image_url
          ),
          duration,
          rental_amount,
          deposit_amount
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Order not found');
    
    return data;
  } catch (err) {
    console.error('Error updating order:', err);
    throw err instanceof Error ? err : new Error('Failed to update order');
  }
};

export const updateOrderAddress = async (orderId: string, addressId: string) => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .update({ address_id: addressId })
      .eq('id', orderId)
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          phone
        ),
        delivery_address:address_id (*),
        items:rental_items (
          id,
          toy:toy_id (
            name,
            image_url
          ),
          duration,
          rental_amount,
          deposit_amount
        )
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Order not found');
    
    return data;
  } catch (err) {
    console.error('Error updating order address:', err);
    throw err instanceof Error ? err : new Error('Failed to update order address');
  }
};