import React from 'react';
import { Shield } from 'lucide-react';

interface SafetyInfoProps {
  info: string;
}

export const SafetyInfo: React.FC<SafetyInfoProps> = ({ info }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-primary">
        <Shield className="w-5 h-5 mr-2" />
        <span className="font-medium">Safety Information</span>
      </div>
      <p className="text-gray-600">{info}</p>
    </div>
  );
};