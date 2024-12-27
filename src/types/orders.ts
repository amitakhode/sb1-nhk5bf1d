import type { Database } from '../lib/supabase-types';

export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
export type OrderPriority = 'high' | 'medium' | 'low';

export interface OrderItem {
  id: string;
  toy: {
    name: string;
    image_url: string | null;
  } | null;
  duration: number;
  rental_amount: number;
  deposit_amount: number;
}

// Extend the Supabase types for better type safety
export interface Order extends Database['public']['Tables']['rentals']['Row'] {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  } | null;
  delivery_address?: {
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    pincode: string;
  } | null;
  items?: OrderItem[];
}

export interface OrderFilter {
  status: OrderStatus | 'all';
  dateRange: 'today' | 'week' | 'month' | 'custom';
  priority: OrderPriority | 'all';
  customDateStart?: string;
  customDateEnd?: string;
}

export interface OrderMetrics {
  total: number;
  new: number;
  inProgress: number;
  ready: number;
  completed: number;
  cancelled: number;
  averageProcessingTime: number;
}