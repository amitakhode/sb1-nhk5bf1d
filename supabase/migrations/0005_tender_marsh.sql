/*
  # Update RLS policies for public access
  
  1. Changes
    - Update toys table policies for public access
    - Update profiles table policies for authenticated users
*/

-- Update toys policies
DROP POLICY IF EXISTS "Public can view toys" ON toys;
CREATE POLICY "Public can view toys"
  ON toys FOR SELECT
  USING (true);

-- Update profiles policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);