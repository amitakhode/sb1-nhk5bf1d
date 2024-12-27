/*
  # Update toys table RLS policies
  
  1. Changes
    - Add policy to allow public access to toys table
    - Remove authenticated requirement for viewing toys
  
  2. Security
    - Enable public read access to toys
    - Maintain write protection
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view toys" ON toys;

-- Create new policy for public access
CREATE POLICY "Public can view toys"
  ON toys FOR SELECT
  USING (true);