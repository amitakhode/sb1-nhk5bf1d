/*
  # Enable WhatsApp Authentication
  
  1. Changes
    - Enable WhatsApp authentication provider
    - Add WhatsApp-specific columns to profiles table
    - Add WhatsApp verification settings
*/

-- Enable WhatsApp authentication
ALTER TABLE auth.identities
ADD COLUMN IF NOT EXISTS whatsapp_id text;

-- Add WhatsApp-specific columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS whatsapp_verified_at timestamptz;

-- Create function to handle WhatsApp verification
CREATE OR REPLACE FUNCTION handle_whatsapp_verification()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET 
    whatsapp_verified = true,
    whatsapp_verified_at = NOW(),
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for WhatsApp verification
DROP TRIGGER IF EXISTS on_whatsapp_verification ON auth.users;
CREATE TRIGGER on_whatsapp_verification
  AFTER UPDATE OF phone ON auth.users
  FOR EACH ROW
  WHEN (NEW.phone IS NOT NULL AND OLD.phone IS NULL)
  EXECUTE FUNCTION handle_whatsapp_verification();