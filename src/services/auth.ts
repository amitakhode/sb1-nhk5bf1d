import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase-types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const signInWithPhone = async (phone: string) => {
  const formattedPhone = `+91${phone.replace(/\D/g, '')}`;
  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });
  if (error) throw error;
};

export const verifyOTP = async (phone: string, otp: string) => {
  const formattedPhone = `+91${phone.replace(/\D/g, '')}`;
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token: otp,
    type: 'sms',
  });
  if (error) throw error;

  // Create profile after successful verification
  await createOrUpdateProfile({
    phone: formattedPhone,
  });

  return data;
};

export const signInAsGuest = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'guest@example.com',
      password: 'guest123',
    });
    if (error) throw error;

    // Create profile for guest user
    await createOrUpdateProfile({
      phone: null,
    });

    return data;
  } catch (err) {
    console.error('Guest login error:', err);
    throw err;
  }
};

export const createOrUpdateProfile = async (profile: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });
    if (error) throw error;
  } catch (err) {
    console.error('Error creating/updating profile:', err);
    throw err;
  }
};