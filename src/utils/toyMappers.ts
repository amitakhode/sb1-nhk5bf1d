import type { Database } from '../lib/supabase-types';

type SupabaseToy = Database['public']['Tables']['toys']['Row'];
type FeaturedToy = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ageRange: { min: number; max: number };
  category: string[];
  pricePerDay: number;
  available: boolean;
  educationalBenefits: string[];
  safetyInfo: string;
  averageRating: number;
  rentCount: number;
};

export const mapFeaturedToSupabaseToy = (toy: FeaturedToy): SupabaseToy => ({
  id: toy.id,
  name: toy.name,
  description: toy.description,
  image_url: toy.imageUrl,
  price_per_day: toy.pricePerDay,
  min_age: toy.ageRange.min,
  max_age: toy.ageRange.max,
  categories: toy.category,
  educational_benefits: toy.educationalBenefits,
  safety_info: toy.safetyInfo,
  available: toy.available,
  average_rating: toy.averageRating,
  rent_count: toy.rentCount,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});