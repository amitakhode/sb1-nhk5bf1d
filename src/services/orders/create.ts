import { supabase } from '../../lib/supabase';
import type { CreateOrderParams } from './types';

export const createOrder = async (params: CreateOrderParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  try {
    const { data, error } = await supabase.rpc(
      'create_order',
      {
        p_user_id: user.id,
        p_items: params.items.map(item => ({
          toy_id: item.toyId,
          duration: item.duration,
          rental_amount: item.rentalAmount,
          deposit_amount: item.depositAmount
        })),
        p_payment_method: params.paymentMethod
      }
    );

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};