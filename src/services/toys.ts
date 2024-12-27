import { supabase } from '../lib/supabase';
import { FEATURED_TOYS } from '../data/featuredToys';
import type { Database } from '../lib/supabase-types';

type Toy = Database['public']['Tables']['toys']['Row'];

export const fetchToys = async (
  category?: string,
  minAge?: number,
  maxAge?: number
): Promise<Toy[]> => {
  try {
    let query = supabase
      .from('toys')
      .select('*');

    if (category) {
      query = query.contains('categories', [category]);
    }
    if (minAge !== undefined) {
      query = query.gte('min_age', minAge);
    }
    if (maxAge !== undefined) {
      query = query.lte('max_age', maxAge);
    }

    const { data, error } = await query;
    
    if (error) {
      console.warn('Falling back to featured toys due to Supabase error:', error);
      // Convert featured toys to match Supabase schema
      return FEATURED_TOYS.map(toy => ({
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
      }));
    }

    return data || [];
  } catch (err) {
    console.warn('Falling back to featured toys due to error:', err);
    // Return featured toys as fallback
    return FEATURED_TOYS.map(toy => ({
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
    }));
  }
};

export const fetchToyById = async (id: string): Promise<Toy> => {
  try {
    const { data, error } = await supabase
      .from('toys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      // Fallback to featured toys if Supabase fails
      const featuredToy = FEATURED_TOYS.find(t => t.id === id);
      if (!featuredToy) throw new Error('Toy not found');
      
      return {
        id: featuredToy.id,
        name: featuredToy.name,
        description: featuredToy.description,
        image_url: featuredToy.imageUrl,
        price_per_day: featuredToy.pricePerDay,
        min_age: featuredToy.ageRange.min,
        max_age: featuredToy.ageRange.max,
        categories: featuredToy.category,
        educational_benefits: featuredToy.educationalBenefits,
        safety_info: featuredToy.safetyInfo,
        available: featuredToy.available,
        average_rating: featuredToy.averageRating,
        rent_count: featuredToy.rentCount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    return data;
  } catch (err) {
    // Fallback to featured toys
    const featuredToy = FEATURED_TOYS.find(t => t.id === id);
    if (!featuredToy) throw new Error('Toy not found');
    
    return {
      id: featuredToy.id,
      name: featuredToy.name,
      description: featuredToy.description,
      image_url: featuredToy.imageUrl,
      price_per_day: featuredToy.pricePerDay,
      min_age: featuredToy.ageRange.min,
      max_age: featuredToy.ageRange.max,
      categories: featuredToy.category,
      educational_benefits: featuredToy.educationalBenefits,
      safety_info: featuredToy.safetyInfo,
      available: featuredToy.available,
      average_rating: featuredToy.averageRating,
      rent_count: featuredToy.rentCount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};