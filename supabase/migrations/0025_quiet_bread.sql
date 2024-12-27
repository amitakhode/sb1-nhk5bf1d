/*
  # Fix Transaction Handling in Order Creation

  1. Changes
    - Fix transaction handling to properly commit/rollback
    - Add explicit column references to avoid ambiguity
    - Add better error handling and validation
    - Fix NULL handling for end_date updates
*/

-- Drop existing function
DROP FUNCTION IF EXISTS create_order(uuid, uuid, jsonb[], text, text);

-- Create new function with proper transaction handling
CREATE OR REPLACE FUNCTION create_order(
  p_user_id UUID,
  p_address_id UUID,
  p_items JSONB[],
  p_payment_method TEXT,
  p_upi_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  rental_id UUID,
  rental_user_id UUID,
  rental_address_id UUID,
  rental_status text,
  rental_payment_method text,
  rental_payment_status text,
  rental_created_at timestamptz,
  rental_updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
  v_start_date date;
  v_end_date date;
  v_toy_id UUID;
  v_max_end_date date;
BEGIN
  -- Validate inputs
  IF p_address_id IS NULL THEN
    RAISE EXCEPTION 'Delivery address is required';
  END IF;

  IF array_length(p_items, 1) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- Set rental dates
  v_start_date := CURRENT_DATE;
  v_max_end_date := v_start_date;

  -- Create the order
  INSERT INTO rentals (
    user_id,
    address_id,
    status,
    payment_method,
    payment_status,
    start_date,
    end_date
  ) VALUES (
    p_user_id,
    p_address_id,
    'new',
    p_payment_method,
    CASE 
      WHEN p_payment_method = 'cod' THEN 'pending'
      ELSE 'paid'
    END,
    v_start_date,
    v_start_date  -- Initial value, will be updated later
  )
  RETURNING rentals.id INTO v_order_id;

  -- Process each item
  FOREACH v_item IN ARRAY p_items
  LOOP
    -- Validate toy_id
    v_toy_id := (v_item->>'toy_id')::uuid;
    IF v_toy_id IS NULL THEN
      RAISE EXCEPTION 'Invalid toy_id in order items';
    END IF;

    -- Calculate end date for this item
    v_end_date := v_start_date + ((v_item->>'duration')::integer * INTERVAL '1 day');
    
    -- Update max end date if necessary
    IF v_end_date > v_max_end_date THEN
      v_max_end_date := v_end_date;
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
      v_toy_id,
      (v_item->>'duration')::integer,
      (v_item->>'rental_amount')::integer,
      (v_item->>'deposit_amount')::integer
    );

    -- Update toy availability
    UPDATE toys 
    SET available = false 
    WHERE toys.id = v_toy_id;
  END LOOP;

  -- Update rental with final end date
  UPDATE rentals 
  SET end_date = v_max_end_date
  WHERE rentals.id = v_order_id;

  -- Return the created order
  RETURN QUERY 
  SELECT 
    r.id AS rental_id,
    r.user_id AS rental_user_id,
    r.address_id AS rental_address_id,
    r.status::text AS rental_status,
    r.payment_method AS rental_payment_method,
    r.payment_status AS rental_payment_status,
    r.created_at AS rental_created_at,
    r.updated_at AS rental_updated_at
  FROM rentals r
  WHERE r.id = v_order_id;
END;
$$;