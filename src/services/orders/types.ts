import type { Database } from '../../lib/supabase-types';
import type { PaymentMethod } from '../../types/payment';

export interface CreateOrderItem {
  toyId: string;
  duration: number;
  rentalAmount: number;
  depositAmount: number;
}

export interface CreateOrderParams {
  items: CreateOrderItem[];
  paymentMethod: PaymentMethod;
  addressId: string;
  upiId?: string;
}

export interface UpdateOrderAddressParams {
  orderId: string;
  addressId: string;
}

export type Order = Database['public']['Tables']['rentals']['Row'] & {
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
  items?: {
    id: string;
    toy?: {
      name: string;
      image_url: string | null;
    };
    duration: number;
    rental_amount: number;
    deposit_amount: number;
  }[];
};