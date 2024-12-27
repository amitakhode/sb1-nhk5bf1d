import React from 'react';
import { Lightbulb } from 'lucide-react';

interface BenefitsProps {
  benefits: string[];
}

export const Benefits: React.FC<BenefitsProps> = ({ benefits }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-primary">
        <Lightbulb className="w-5 h-5 mr-2" />
        <span className="font-medium">Educational Benefits</span>
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
};