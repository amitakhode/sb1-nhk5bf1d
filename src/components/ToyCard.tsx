import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import type { Database } from '../lib/supabase-types';
import { formatPricePerDay } from '../utils/format';
import { SustainabilityBadge } from './SustainabilityBadge';

type Toy = Database['public']['Tables']['toys']['Row'];

interface ToyCardProps {
  toy: Toy;
}

export const ToyCard: React.FC<ToyCardProps> = ({ toy }) => {
  return (
    <div className="bg-background-card rounded-2xl shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden">
      <img
        src={toy.image_url || ''}
        alt={toy.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-primary">{toy.name}</h3>
          <SustainabilityBadge type="eco-friendly" />
        </div>
        
        <div className="flex items-center mb-3">
          <Star className="w-5 h-5 text-secondary" />
          <span className="ml-2 text-primary">{toy.average_rating?.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-primary-light" />
          <span className="ml-2 text-primary-light font-medium">
            {formatPricePerDay(toy.price_per_day)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            toy.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {toy.available ? 'Available' : 'Rented'}
          </span>
          <Link
            to={`/toy/${toy.id}`}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium hover:bg-emerald-700 transition-colors duration-300"
          >
            Rent Now
          </Link>
        </div>
      </div>
    </div>
  );
};