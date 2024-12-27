import { supabase } from '../../lib/supabase';
import type { OrderFilter } from '../../types/orders';

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
    case 'today': {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query = query.gte('created_at', today.toISOString());
      break;
    }
    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
      break;
    }
    case 'month': {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('created_at', monthAgo.toISOString());
      break;
    }
    case 'custom': {
      if (filters.customDateStart) {
        query = query.gte('created_at', new Date(filters.customDateStart).toISOString());
      }
      if (filters.customDateEnd) {
        const endDate = new Date(filters.customDateEnd);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endDate.toISOString());
      }
      break;
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};