import React from 'react';
import { Calendar } from 'lucide-react';
import { formatPrice } from '../utils/format';

interface RentalDurationProps {
  pricePerDay: number;
  duration: number;
  setDuration: (duration: number) => void;
}

export const RentalDuration: React.FC<RentalDurationProps> = ({
  pricePerDay,
  duration,
  setDuration,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-primary">
        <Calendar className="w-5 h-5 mr-2" />
        <span className="font-medium">Rental Duration</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="block w-32 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-accent-yellow"
        >
          {[1, 3, 7, 14, 30].map((days) => (
            <option key={days} value={days}>
              {days} {days === 1 ? 'day' : 'days'}
            </option>
          ))}
        </select>
        
        <div className="flex-1 text-right">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(pricePerDay * duration)}
          </div>
          <div className="text-sm text-gray-500">
            {formatPrice(pricePerDay)}/day × {duration} days
          </div>
        </div>
      </div>
    </div>
  );
};