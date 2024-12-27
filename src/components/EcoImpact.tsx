import React from 'react';
import { Recycle } from 'lucide-react';

interface EcoImpactProps {
  wasteReduced: number; // in kg
  treesPreserved: number;
}

export const EcoImpact: React.FC<EcoImpactProps> = ({ wasteReduced, treesPreserved }) => (
  <div className="bg-emerald-50 rounded-lg p-4 space-y-2">
    <div className="flex items-center text-emerald-700">
      <Recycle className="w-5 h-5 mr-2" />
      <span className="font-medium">Environmental Impact</span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-2xl font-bold text-emerald-600">{wasteReduced}kg</p>
        <p className="text-sm text-emerald-700">Waste Reduced</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-emerald-600">{treesPreserved}</p>
        <p className="text-sm text-emerald-700">Trees Preserved</p>
      </div>
    </div>
  </div>
);