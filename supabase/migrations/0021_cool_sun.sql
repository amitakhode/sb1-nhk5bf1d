/*
  # Fix Order Creation Function
  
  1. Changes
    - Remove explicit transaction handling (Supabase RPC handles transactions automatically)
    - Fix return type to match actual return data
    - Add proper error handling
*/

-- Drop existing versions of the function
DROP FUNCTION IF EXISTS create_order(uuid, jsonb[]);
DROP FUNCTION IF EXISTS create_order(uuid, uuid, jsonb[]);
DROP FUNCTION IF EXISTS create_order(uuid, uuid, jsonb[], text);
DROP FUNCTION IF EXISTS create_order(uuid, uuid, jsonb[], text, text);

-- Create new function with fixed signature
CREATE OR REPLACE FUNCTION create_order(
  p_user_id UUID,
  p_address_id UUID,
  p_items JSONB[],
  p_payment_method TEXT,
  p_upi_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  address_id UUID,
  status text,
  payment_method text,
  payment_status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- Validate inputs
  IF p_address_id IS NULL THEN
    RAISE EXCEPTION 'Delivery address is required';
  END IF;

  IF array_length(p_items, 1) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Create the order
  INSERT INTO rentals (
    user_id,
    address_id,
    status,
    payment_method,
    payment_status
  ) VALUES (
    p_user_id,
    p_address_id,
    'new',
    p_payment_method,
    CASE 
      WHEN p_payment_method = 'cod' THEN 'pending'
      ELSE 'paid'
    END
  )
  RETURNING id INTO v_order_id;

  -- Create rental items
  FOREACH v_item IN ARRAY p_items
  LOOP
    -- Validate toy_id
    IF (v_item->>'toy_id') IS NULL THEN
      RAISE EXCEPTION 'Invalid toy_id in order items';
    END IF;

    -- Insert rental item
    INSERT INTO rental_items (
      rental_id,
      toy_id,
      duration,
      rental_amount,
      deposit_amount
    ) VALUES (
      v_order_id,
      (v_item->>'toy_id')::uuid,
      (v_item->>'duration')::integer,
      (v_item->>'rental_amount')::integer,
      (v_item->>'deposit_amount')::integer
    );

    -- Update toy availability
    UPDATE toys 
    SET available = false 
    WHERE id = (v_item->>'toy_id')::uuid;
  END LOOP;

  -- Return the created order
  RETURN QUERY 
  SELECT 
    r.id,
    r.user_id,
    r.address_id,
    r.status::text,
    r.payment_method,
    r.payment_status,
    r.created_at,
    r.updated_at
  FROM rentals r
  WHERE r.id = v_order_id;
END;
$$;