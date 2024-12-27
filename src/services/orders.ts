import { supabase } from '../lib/supabase';
import type { OrderStatus, OrderFilter } from '../types/orders';
import type { PaymentMethod } from '../types/payment';

interface CreateOrderItem {
  toyId: string;
  duration: number;
  rentalAmount: number;
  depositAmount: number;
}

interface CreateOrderParams {
  items: CreateOrderItem[];
  paymentMethod: PaymentMethod;
  addressId: string;
  upiId?: string;
}

export const createOrder = async (params: CreateOrderParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  try {
    const { data, error } = await supabase.rpc(
      'create_order',
      {
        p_user_id: user.id,
        p_address_id: params.addressId,
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

export const fetchOrders = async (filters: OrderFilter) => {
  let query = supabase
    .from('rentals')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name,
        phone
      ),
      delivery_address:address_id (*)
    `);

  // Apply filters
  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }

  // Apply date filters
  const now = new Date();
  switch (filters.dateRange) {
    case 'today':
      query = query.gte('created_at', now.toISOString().split('T')[0]);
      break;
    case 'week':
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      query = query.gte('created_at', weekAgo.toISOString());
      break;
    case 'month':
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      query = query.gte('created_at', monthAgo.toISOString());
      break;
    case 'custom':
      if (filters.customDateStart) {
        query = query.gte('created_at', filters.customDateStart);
      }
      if (filters.customDateEnd) {
        query = query.lte('created_at', filters.customDateEnd);
      }
      break;
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateOrder = async (orderId: string, updates: { status: OrderStatus }) => {
  const { data, error } = await supabase
    .from('rentals')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};