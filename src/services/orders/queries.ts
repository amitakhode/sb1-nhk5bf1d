import { supabase } from '../../lib/supabase';
import type { Order } from './types';
import type { OrderFilter } from '../../types/orders';

export const fetchOrders = async (filters: OrderFilter): Promise<Order[]> => {
  let query = supabase
    .from('rentals')
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