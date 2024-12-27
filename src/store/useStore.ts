import { create } from 'zustand';
import type { Database } from '../lib/supabase-types';

type User = Database['public']['Tables']['profiles']['Row'];
type CartToy = {
  id: string;
  name: string;
  imageUrl: string;
  pricePerDay: number;
  depositAmount: number;
  depositTerms: string;
  available: boolean;
};

interface StoreState {
  user: User | null;
  cart: { toy: CartToy; duration: number }[];
  setUser: (user: User | null) => void;
  addToCart: (toy: CartToy, duration: number) => void;
  removeFromCart: (toyId: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  cart: [],
  setUser: (user) => set({ user }),
  addToCart: (toy, duration) =>
    set((state) => ({
      cart: [...state.cart, { toy, duration }],
    })),
  removeFromCart: (toyId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.toy.id !== toyId),
    })),
  clearCart: () => set({ cart: [] }),
}));