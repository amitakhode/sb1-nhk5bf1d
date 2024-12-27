/*
  # Fix inventory update function

  1. Changes
    - Drop all versions of the function to avoid conflicts
    - Create new function with proper parameter types
    - Add proper error handling and validation
*/

-- Drop all versions of the function
DROP FUNCTION IF EXISTS update_inventory_quantity(uuid, integer);
DROP FUNCTION IF EXISTS update_inventory_quantity(uuid, integer, text);
DROP FUNCTION IF EXISTS update_inventory_quantity(uuid, integer, text, text);
DROP FUNCTION IF EXISTS update_inventory_quantity(p_toy_id uuid, p_quantity_change integer, p_reason text, p_notes text);

-- Create new function with proper return type and error handling
CREATE OR REPLACE FUNCTION update_inventory_quantity(
  p_toy_id uuid,
  p_quantity_change integer,
  p_reason text,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inventory record;
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check if inventory record exists
  SELECT * INTO v_inventory
  FROM inventory
  WHERE toy_id = p_toy_id;

  IF NOT FOUND THEN
    -- Create new inventory record
    INSERT INTO inventory (
      toy_id,
      quantity,
      available_quantity,
      reserved_quantity,
      location,
      status
    ) VALUES (
      p_toy_id,
      p_quantity_change,
      p_quantity_change,
      0,
      COALESCE(
        (SELECT substring(p_notes from 'Location: ([^\.]+)'))::text,
        'Default'
      ),
      CASE
        WHEN p_quantity_change <= 0 THEN 'out_of_stock'
        WHEN p_quantity_change <= 5 THEN 'low_stock'
        ELSE 'in_stock'
      END
    )
    RETURNING * INTO v_inventory;
  ELSE
    -- Update existing inventory record
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
  END IF;

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

  -- Return inventory record with toy details as JSONB
  RETURN (
    SELECT jsonb_build_object(
      'id', i.id,
      'toy_id', i.toy_id,
      'quantity', i.quantity,
      'available_quantity', i.available_quantity,
      'reserved_quantity', i.reserved_quantity,
      'location', i.location,
      'status', i.status,
      'last_checked', i.last_checked,
      'created_at', i.created_at,
      'updated_at', i.updated_at,
      'toy', jsonb_build_object(
        'name', t.name,
        'image_url', t.image_url
      )
    )
    FROM inventory i
    JOIN toys t ON t.id = i.toy_id
    WHERE i.id = v_inventory.id
  );
END;
$$;