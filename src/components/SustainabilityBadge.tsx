import React from 'react';
import { Leaf } from 'lucide-react';

interface SustainabilityBadgeProps {
  type: 'eco-friendly' | 'recycled' | 'sustainable';
}

export const SustainabilityBadge: React.FC<SustainabilityBadgeProps> = ({ type }) => {
  const badges = {
    'eco-friendly': {
      color: 'bg-green-100 text-green-800',
      icon: <Leaf className="w-4 h-4" />,
      text: 'Eco-Friendly'
    },
    'recycled': {
      color: 'bg-blue-100 text-blue-800',
      icon: <Leaf className="w-4 h-4" />,
      text: 'Recycled'
    },
    'sustainable': {
      color: 'bg-emerald-100 text-emerald-800',
      icon: <Leaf className="w-4 h-4" />,
      text: 'Sustainable'
    }
  };

  const badge = badges[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
      {badge.icon}
      <span className="ml-1">{badge.text}</span>
    </span>
  );
};