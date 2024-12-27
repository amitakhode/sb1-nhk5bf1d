/*
  # Load initial toy data
  
  1. Purpose
    - Loads sample toy data into the database
    - Ensures data exists for testing and development
  
  2. Changes
    - Inserts 5 sample toys if they don't exist
*/

DO $$
BEGIN
  -- Insert sample toys if they don't exist
  INSERT INTO toys (
    name,
    description,
    image_url,
    price_per_day,
    min_age,
    max_age,
    categories,
    educational_benefits,
    safety_info,
    available,
    average_rating,
    rent_count
  ) VALUES
  (
    'STEM Building Blocks Set',
    'Educational building blocks for creative learning',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800',
    299,
    3,
    12,
    ARRAY['Educational & STEM toys', 'Building & Construction sets'],
    ARRAY['Problem-solving', 'Spatial awareness', 'Creativity'],
    'Made with non-toxic materials, suitable for ages 3+',
    true,
    4.8,
    156
  )
  ON CONFLICT (id) DO NOTHING;
END $$;