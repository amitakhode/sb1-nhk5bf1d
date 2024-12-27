/*
  # Insert Initial Toy Catalog

  1. Purpose
    - Populate the toys table with initial sample data
    - Establish baseline catalog for testing and development

  2. Data Structure
    - Each toy entry includes:
      - Basic information (name, description, pricing)
      - Age range recommendations
      - Educational benefits and safety info
      - Availability and ratings

  3. Categories Coverage
    - Educational & STEM toys
    - Arts & Creativity
    - Sports & Outdoor
    - Building & Construction sets
*/

DO $$
BEGIN
  -- Insert toys only if they don't exist
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
  ) 
  SELECT
    'STEM Building Blocks Set',
    'Educational building blocks for creative learning',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800',
    299,
    3,
    12,
    ARRAY['Educational & STEM toys', 'Building & Construction sets']::text[],
    ARRAY['Problem-solving', 'Spatial awareness', 'Creativity']::text[],
    'Made with non-toxic materials, suitable for ages 3+',
    true,
    4.8,
    156
  WHERE NOT EXISTS (
    SELECT 1 FROM toys WHERE name = 'STEM Building Blocks Set'
  );

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
  )
  SELECT
    'Interactive Science Kit',
    'Hands-on experiments for young scientists',
    'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&q=80&w=800',
    259,
    8,
    15,
    ARRAY['Educational & STEM toys']::text[],
    ARRAY['Scientific thinking', 'Experimentation', 'Observation']::text[],
    'Adult supervision required for experiments',
    true,
    4.6,
    142
  WHERE NOT EXISTS (
    SELECT 1 FROM toys WHERE name = 'Interactive Science Kit'
  );

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
  )
  SELECT
    'Art Studio Set',
    'Complete art supplies for creative expression',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    149,
    4,
    16,
    ARRAY['Arts & Creativity']::text[],
    ARRAY['Creative expression', 'Fine motor skills', 'Color theory']::text[],
    'Non-toxic art supplies',
    true,
    4.7,
    128
  WHERE NOT EXISTS (
    SELECT 1 FROM toys WHERE name = 'Art Studio Set'
  );

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
  )
  SELECT
    'Robot Programming Kit',
    'Learn coding with interactive robots',
    'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=800',
    699,
    10,
    17,
    ARRAY['Educational & STEM toys', 'Video Games & Electronics']::text[],
    ARRAY['Programming basics', 'Logic', 'Problem-solving']::text[],
    'Includes small parts, 10+ recommended',
    true,
    4.9,
    98
  WHERE NOT EXISTS (
    SELECT 1 FROM toys WHERE name = 'Robot Programming Kit'
  );

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
  )
  SELECT
    'Outdoor Sports Set',
    'Complete sports equipment for active play',
    'https://images.unsplash.com/photo-1531565637446-32307b194362?auto=format&fit=crop&q=80&w=800',
    299,
    6,
    17,
    ARRAY['Sports & Outdoor']::text[],
    ARRAY['Physical activity', 'Team building', 'Coordination']::text[],
    'Protective gear included',
    true,
    4.5,
    87
  WHERE NOT EXISTS (
    SELECT 1 FROM toys WHERE name = 'Outdoor Sports Set'
  );
END $$;