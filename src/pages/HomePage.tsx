import React, { useState, useEffect } from 'react';
import { ToyCard } from '../components/ToyCard';
import { useToys } from '../hooks/useToys';
import { Loader } from '../components/Loader';
import { Filter } from 'lucide-react';
import { Hero } from '../components/HomePage/Hero';

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [ageRange, setAgeRange] = useState<{ min?: number; max?: number }>({});
  const { toys, loading, error } = useToys(selectedCategory, ageRange.min, ageRange.max);

  useEffect(() => {
    if (toys) {
      console.log('Toys loaded:', toys.length);
    }
  }, [toys]);

  if (error) {
    console.error('Error loading toys:', error);
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading toys: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary">Featured Toys</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {loading ? (
          <Loader />
        ) : toys.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-600">No toys found. Please try different filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toys.map((toy) => (
              <ToyCard key={toy.id} toy={toy} />
            ))}
          </div>
        )}

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-primary mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              'Educational & STEM toys',
              'Arts & Creativity',
              'Sports & Outdoor',
              'Board Games & Puzzles',
              'Video Games & Electronics',
              'Building & Construction sets'
            ].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-8 rounded-2xl transition-all duration-300 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-background-card hover:bg-emerald-50'
                }`}
              >
                <h3 className="text-lg font-semibold">{category}</h3>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};