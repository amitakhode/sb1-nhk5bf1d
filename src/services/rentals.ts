import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Rental = Database['public']['Tables']['rentals']['Row'];

interface CreateRentalParams {
  toy_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  payment_method: 'upi' | 'cod';
}

export const createRental = async ({
  toy_id,
  start_date,
  end_date,
  total_amount,
  payment_method
}: CreateRentalParams): Promise<Rental> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  try {
    // First ensure profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Create profile if it doesn't exist
      const { error: createProfileError } = await supabase
        .from('profiles')
        .insert({ id: user.id });
      if (createProfileError) throw createProfileError;
    }

    // Create the rental
    const { data, error } = await supabase
      .from('rentals')
      .insert({
        user_id: user.id,
        toy_id,
        start_date,
        end_date,
        total_amount,
        status: 'pending',
        payment_status: payment_method === 'cod' ? 'pending' : 'paid',
        payment_method,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create rental');

    return data;
  } catch (err) {
    console.error('Error creating rental:', err);
    throw err;
  }
};

export const fetchUserRentals = async (): Promise<Rental[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('rentals')
    .select('*, toys(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};