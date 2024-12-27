import React from 'react';
import { PlanetIcon } from '../icons/PlanetIcon';

export const Hero: React.FC = () => (
  <div className="bg-gradient-to-b from-emerald-50 to-white py-16 mb-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="text-emerald-500">
            <PlanetIcon className="w-16 h-16" />
          </div>
          <h1 className="text-5xl font-bold text-primary">PlanetPlay</h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">
          Sustainable toy rentals for a greener future
        </p>
        <div className="flex justify-center space-x-8 text-center">
          <div>
            <p className="text-3xl font-bold text-emerald-600">50%</p>
            <p className="text-sm text-gray-600">Less Waste</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">1000+</p>
            <p className="text-sm text-gray-600">Eco-friendly Toys</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-600">5000+</p>
            <p className="text-sm text-gray-600">Happy Families</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);