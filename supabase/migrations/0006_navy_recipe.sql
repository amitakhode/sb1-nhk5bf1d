/*
  # Add deposit system for toys

  1. Changes
    - Add deposit_amount column to toys table
    - Add deposit_terms column to toys table
    - Add deposit_status column to rentals table
    - Add deposit_amount column to rentals table
    - Add deposit_refund_date column to rentals table

  2. Security
    - Maintain existing RLS policies
*/

-- Add deposit-related columns to toys table
ALTER TABLE toys ADD COLUMN IF NOT EXISTS deposit_amount integer NOT NULL DEFAULT 0;
ALTER TABLE toys ADD COLUMN IF NOT EXISTS deposit_terms text;

-- Add deposit-related columns to rentals table
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS deposit_status text CHECK (deposit_status IN ('pending', 'paid', 'refunded', 'withheld')) DEFAULT 'pending';
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS deposit_amount integer NOT NULL DEFAULT 0;
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS deposit_refund_date timestamptz;

-- Update existing toys with deposit information
UPDATE toys SET 
  deposit_amount = price_per_day * 7,
  deposit_terms = 'Deposit will be refunded within 7 days after the toy is returned in good condition. Deductions may apply for damages or missing parts.'
WHERE deposit_amount = 0;