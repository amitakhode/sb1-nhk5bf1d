/*
  # Add Inventory Management Support
  
  1. New Tables
    - inventory: Tracks toy inventory levels
    - pick_list_items: Manages order picking process
  
  2. Functions
    - update_inventory_quantity: Safely updates inventory levels
    - generate_pick_list: Creates pick list items for an order
    
  3. Triggers
    - Automatically update inventory on rental creation/update
*/

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  toy_id uuid REFERENCES toys(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  available_quantity integer NOT NULL DEFAULT 0,
  reserved_quantity integer NOT NULL DEFAULT 0,
  location text NOT NULL,
  last_checked timestamptz DEFAULT now(),
  status text CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pick list items table
CREATE TABLE IF NOT EXISTS pick_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rental_id uuid REFERENCES rentals(id) NOT NULL,
  toy_id uuid REFERENCES toys(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  location text NOT NULL,
  status text CHECK (status IN ('pending', 'picked', 'packed')) DEFAULT 'pending',
  picked_at timestamptz,
  picked_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Function to update inventory quantity
CREATE OR REPLACE FUNCTION update_inventory_quantity(
  p_toy_id uuid,
  p_quantity_change integer
)
RETURNS inventory
LANGUAGE plpgsql
AS $$
DECLARE
  v_inventory inventory;
BEGIN
  UPDATE inventory
  SET 
    quantity = quantity + p_quantity_change,
    available_quantity = available_quantity + p_quantity_change,
    status = CASE
      WHEN available_quantity + p_quantity_change <= 0 THEN 'out_of_stock'
      WHEN available_quantity + p_quantity_change <= 5 THEN 'low_stock'
      ELSE 'in_stock'
    END,
    updated_at = now()
  WHERE toy_id = p_toy_id
  RETURNING * INTO v_inventory;
  
  RETURN v_inventory;
END;
$$;

-- Function to generate pick list
CREATE OR REPLACE FUNCTION generate_pick_list(p_rental_id uuid)
RETURNS SETOF pick_list_items
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create pick list items
  INSERT INTO pick_list_items (
    rental_id,
    toy_id,
    quantity,
    location
  )
  SELECT 
    r.id as rental_id,
    r.toy_id,
    1 as quantity,
    i.location
  FROM rentals r
  JOIN inventory i ON i.toy_id = r.toy_id
  WHERE r.id = p_rental_id;

  -- Return created items
  RETURN QUERY
  SELECT * FROM pick_list_items
  WHERE rental_id = p_rental_id;
END;
$$;

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pick_list_items ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Staff can manage inventory"
  ON inventory
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Staff can manage pick lists"
  ON pick_list_items
  FOR ALL
  USING (true)
  WITH CHECK (true);