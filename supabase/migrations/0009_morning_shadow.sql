/*
  # Add Order Status Workflow Support

  1. Changes
    - Add order status enum type
    - Add temporary status column
    - Migrate existing data
    - Set up status validation

  2. Security
    - Add policy for status updates
*/

-- Create enum for order status
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'new',
    'in_progress', 
    'ready',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add new status column
ALTER TABLE rentals 
ADD COLUMN IF NOT EXISTS status_enum order_status;

-- Migrate existing status data
UPDATE rentals 
SET status_enum = CASE 
  WHEN status = 'pending' THEN 'new'::order_status
  WHEN status = 'active' THEN 'in_progress'::order_status
  WHEN status = 'completed' THEN 'completed'::order_status
  WHEN status = 'cancelled' THEN 'cancelled'::order_status
  ELSE 'new'::order_status
END;

-- Drop old status column
ALTER TABLE rentals 
DROP COLUMN status;

-- Set not null constraint and default value
ALTER TABLE rentals 
ALTER COLUMN status_enum SET NOT NULL,
ALTER COLUMN status_enum SET DEFAULT 'new'::order_status;

-- Rename column
ALTER TABLE rentals 
RENAME COLUMN status_enum TO status;

-- Add function to validate status transitions
CREATE OR REPLACE FUNCTION validate_rental_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow any transition from 'new'
  IF OLD.status = 'new' THEN
    RETURN NEW;
  END IF;

  -- Define valid transitions
  IF (OLD.status = 'in_progress' AND NEW.status = 'ready') OR
     (OLD.status = 'ready' AND NEW.status = 'completed') OR
     (OLD.status = 'in_progress' AND NEW.status = 'cancelled') OR
     (OLD.status = 'ready' AND NEW.status = 'cancelled') THEN
    RETURN NEW;
  END IF;

  -- Invalid transition
  RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status transitions
DROP TRIGGER IF EXISTS rental_status_transition ON rentals;
CREATE TRIGGER rental_status_transition
  BEFORE UPDATE OF status ON rentals
  FOR EACH ROW
  EXECUTE FUNCTION validate_rental_status_transition();

-- Add policy for status updates
DROP POLICY IF EXISTS "Staff can update rental status" ON rentals;
CREATE POLICY "Staff can update rental status"
  ON rentals
  FOR UPDATE
  USING (true)
  WITH CHECK (true);