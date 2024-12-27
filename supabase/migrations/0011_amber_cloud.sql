/*
  # Add inventory transactions tracking

  1. New Tables
    - `inventory_transactions`
      - Tracks all inventory changes
      - Records reason and notes for each change
      - Links to toys and users

  2. Security
    - Enable RLS
    - Add policy for staff access
*/

-- Create inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toy_id uuid REFERENCES toys(id) NOT NULL,
  quantity_change integer NOT NULL,
  reason text NOT NULL,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Staff can view inventory transactions"
  ON inventory_transactions
  FOR SELECT
  USING (true);

CREATE POLICY "Staff can create inventory transactions"
  ON inventory_transactions
  FOR INSERT
  WITH CHECK (true);

-- Update inventory update function to log transactions
CREATE OR REPLACE FUNCTION update_inventory_quantity(
  p_toy_id uuid,
  p_quantity_change integer,
  p_reason text,
  p_notes text DEFAULT NULL
)
RETURNS inventory
LANGUAGE plpgsql
AS $$
DECLARE
  v_inventory inventory;
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();

  -- Update inventory
  UPDATE inventory
  SET 
    quantity = quantity + p_quantity_change,
    available_quantity = GREATEST(0, available_quantity + p_quantity_change),
    status = CASE
      WHEN available_quantity + p_quantity_change <= 0 THEN 'out_of_stock'
      WHEN available_quantity + p_quantity_change <= 5 THEN 'low_stock'
      ELSE 'in_stock'
    END,
    updated_at = now()
  WHERE toy_id = p_toy_id
  RETURNING * INTO v_inventory;

  -- Log transaction
  INSERT INTO inventory_transactions (
    toy_id,
    quantity_change,
    reason,
    notes,
    created_by
  ) VALUES (
    p_toy_id,
    p_quantity_change,
    p_reason,
    p_notes,
    v_user_id
  );
  
  RETURN v_inventory;
END;
$$;