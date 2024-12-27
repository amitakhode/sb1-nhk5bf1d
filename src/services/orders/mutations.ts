import { supabase } from '../../lib/supabase';
import type { Order, CreateOrderParams, UpdateOrderAddressParams } from './types';
import type { OrderStatus } from '../../types/orders';

const ORDER_SELECT = `
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
`;

export const createOrder = async (params: CreateOrderParams): Promise<Order> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  try {
    const { data, error } = await supabase.rpc(
      'create_order',
      {
        p_user_id: user.id,
        p_address_id: params.addressId,
        p_items: params.items.map(item => ({
          toyId: item.toyId,
          duration: item.duration,
          rentalAmount: item.rentalAmount,
          depositAmount: item.depositAmount
        })),
        p_payment_method: params.paymentMethod,
        p_upi_id: params.upiId
      }
    );

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err instanceof Error ? err : new Error('Failed to create order');
  }
};

export const updateOrder = async (orderId: string, updates: { status: OrderStatus }): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .update(updates)
      .eq('id', orderId)
      .select(ORDER_SELECT)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Order not found');
    
    return data;
  } catch (err) {
    console.error('Error updating order:', err);
    throw err instanceof Error ? err : new Error('Failed to update order');
  }
};

export const updateOrderAddress = async ({ orderId, addressId }: UpdateOrderAddressParams): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from('rentals')
      .update({ address_id: addressId })
      .eq('id', orderId)
      .select(ORDER_SELECT)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Order not found');
    
    return data;
  } catch (err) {
    console.error('Error updating order address:', err);
    throw err instanceof Error ? err : new Error('Failed to update order address');
  }
};