/*
  # Initialize inventory data
  
  1. New Data
    - Add sample inventory records for existing toys
    - Set initial quantities and locations
  
  2. Changes
    - Insert inventory records with proper toy references
    - Set default status based on quantity
*/

-- Insert inventory records for existing toys
INSERT INTO inventory (toy_id, quantity, available_quantity, reserved_quantity, location, status)
SELECT 
  id as toy_id,
  10 as quantity,
  10 as available_quantity,
  0 as reserved_quantity,
  CASE 
    WHEN categories && ARRAY['Educational & STEM toys']::text[] THEN 'Section A'
    WHEN categories && ARRAY['Arts & Creativity']::text[] THEN 'Section B'
    WHEN categories && ARRAY['Sports & Outdoor']::text[] THEN 'Section C'
    ELSE 'Section D'
  END as location,
  'in_stock' as status
FROM toys
WHERE NOT EXISTS (
  SELECT 1 FROM inventory WHERE inventory.toy_id = toys.id
);

-- Update status based on quantity
UPDATE inventory
SET status = CASE
  WHEN available_quantity = 0 THEN 'out_of_stock'
  WHEN available_quantity <= 5 THEN 'low_stock'
  ELSE 'in_stock'
END;