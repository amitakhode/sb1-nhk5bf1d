/*
  # Create order function with proper error handling
  
  1. Changes
    - Add proper error handling
    - Return complete order details
    - Handle address and payment info
    - Create rental items
*/

CREATE OR REPLACE FUNCTION create_order(
  p_user_id UUID,
  p_address_id UUID,
  p_items JSONB[],
  p_payment_method TEXT,
  p_upi_id TEXT DEFAULT NULL
)
RETURNS SETOF rentals
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

  -- Start transaction
  BEGIN
    -- Create the order
    INSERT INTO rentals (
      id,
      user_id,
      address_id,
      status,
      payment_method,
      payment_status
    ) VALUES (
      gen_random_uuid(),
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

    -- Return the created order with all details
    RETURN QUERY 
    SELECT * FROM rentals 
    WHERE id = v_order_id;

    -- Commit transaction
    RETURN;
  EXCEPTION WHEN OTHERS THEN
    -- Rollback transaction on error
    RAISE;
  END;
END;
$$;