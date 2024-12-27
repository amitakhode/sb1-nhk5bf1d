import React from 'react';
import { Link } from 'react-router-dom';
import { PlanetIcon } from './icons/PlanetIcon';
import { LeafPlanetIcon } from './icons/LeafPlanetIcon';
import { CustomLogo } from './icons/CustomLogo';

interface LogoProps {
  variant?: 'default' | 'eco' | 'custom';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'default', className = '' }) => (
  <Link to="/" className={`flex items-center space-x-2 text-xl font-bold ${className}`}>
    <div className="text-emerald-500">
      {variant === 'custom' ? (
        <CustomLogo className="w-8 h-8" />
      ) : variant === 'eco' ? (
        <LeafPlanetIcon className="w-8 h-8" />
      ) : (
        <PlanetIcon className="w-8 h-8" />
      )}
    </div>
    <span className="text-primary">PlanetPlay</span>
  </Link>
);