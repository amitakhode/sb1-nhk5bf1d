import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Address = Database['public']['Tables']['addresses']['Row'];

export const createAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  try {
    // First, ensure profile exists
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

    // Now create the address
    const { data, error } = await supabase
      .from('addresses')
      .insert({
        ...address,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create address');

    return data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const fetchUserAddresses = async (): Promise<Address[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateAddress = async (id: string, address: Partial<Address>): Promise<Address> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('addresses')
    .update({
      ...address,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Address not found');
  
  return data;
};