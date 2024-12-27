-- Create a function to handle order creation in a transaction
CREATE OR REPLACE FUNCTION create_order(
  p_user_id UUID,
  p_items JSONB[],
  p_payment_method TEXT
) RETURNS SETOF rentals
LANGUAGE plpgsql
AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Create rentals for each item
    FOR i IN 1..array_length(p_items, 1) LOOP
      -- Calculate dates
      WITH dates AS (
        SELECT 
          NOW() as start_date,
          NOW() + ((p_items[i]->>'duration')::integer * INTERVAL '1 day') as end_date
      )
      INSERT INTO rentals (
        user_id,
        toy_id,
        start_date,
        end_date,
        total_amount,
        deposit_amount,
        status,
        payment_status,
        payment_method
      )
      SELECT
        p_user_id,
        (p_items[i]->>'toy_id')::uuid,
        d.start_date,
        d.end_date,
        (p_items[i]->>'rental_amount')::integer + 
        ROUND((p_items[i]->>'rental_amount')::integer * 0.18) +
        (p_items[i]->>'deposit_amount')::integer,
        (p_items[i]->>'deposit_amount')::integer,
        'pending',
        CASE WHEN p_payment_method = 'cod' THEN 'pending' ELSE 'paid' END,
        p_payment_method
      FROM dates d;

      -- Update toy availability
      UPDATE toys 
      SET available = false 
      WHERE id = (p_items[i]->>'toy_id')::uuid;
    END LOOP;

    -- Return created rentals
    RETURN QUERY 
    SELECT * FROM rentals 
    WHERE user_id = p_user_id 
    ORDER BY created_at DESC 
    LIMIT array_length(p_items, 1);
  END;
END;
$$;