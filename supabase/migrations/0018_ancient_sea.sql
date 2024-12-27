/*
  # Add rental items support
  
  1. New Tables
    - rental_items: Stores individual items in a rental order
  
  2. Changes
    - Add rental items relationship to rentals table
    - Add indexes for better query performance
*/

-- Create rental items table if not exists
CREATE TABLE IF NOT EXISTS rental_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE,
  toy_id uuid REFERENCES toys(id),
  duration integer NOT NULL,
  rental_amount integer NOT NULL,
  deposit_amount integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE rental_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can view their own rental items" ON rental_items;

-- Create new policy
CREATE POLICY "Users can view their own rental items"
  ON rental_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rentals
      WHERE rentals.id = rental_items.rental_id
      AND rentals.user_id = auth.uid()
    )
  );

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_rental_items_rental_id ON rental_items(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_items_toy_id ON rental_items(toy_id);