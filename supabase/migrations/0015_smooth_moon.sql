/*
  # Authentication Setup Migration
  
  1. Create guest user account
  2. Set up necessary tables and policies
  3. Add required indexes
*/

-- Create guest user if not exists
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Create guest user in auth.users if not exists
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  SELECT
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'guest@planetplay.com',
    crypt('guest123', gen_salt('bf')),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Guest User"}',
    now(),
    now()
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'guest@planetplay.com'
  )
  RETURNING id INTO v_user_id;

  -- Create profile for guest user if one was created
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      first_name,
      last_name,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      'Guest',
      'User',
      now(),
      now()
    );
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_auth_users_phone ON auth.users(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Add phone authentication settings
ALTER TABLE auth.users 
ADD COLUMN IF NOT EXISTS phone_confirmed_at timestamptz,
ADD COLUMN IF NOT EXISTS phone_change_token text,
ADD COLUMN IF NOT EXISTS phone_change text;

-- Add function to handle phone verification
CREATE OR REPLACE FUNCTION handle_phone_verification()
RETURNS trigger AS $$
BEGIN
  UPDATE auth.users
  SET phone_confirmed_at = NOW()
  WHERE id = NEW.id AND NEW.phone IS NOT NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for phone verification
DROP TRIGGER IF EXISTS on_phone_verification ON auth.users;
CREATE TRIGGER on_phone_verification
  AFTER UPDATE OF phone ON auth.users
  FOR EACH ROW
  WHEN (NEW.phone IS NOT NULL AND OLD.phone IS NULL)
  EXECUTE FUNCTION handle_phone_verification();