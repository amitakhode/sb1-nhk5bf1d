/*
  # Add address relationship to rentals

  1. Changes
    - Add address_id column to rentals table
    - Add foreign key constraint to addresses table
    - Update existing policies
*/

-- Add address_id column to rentals table
ALTER TABLE rentals 
ADD COLUMN IF NOT EXISTS address_id uuid REFERENCES addresses(id);

-- Update rentals policies to include address access
CREATE POLICY "Users can access rentals with their addresses"
  ON rentals FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM addresses 
      WHERE addresses.id = rentals.address_id 
      AND addresses.user_id = auth.uid()
    )
  );