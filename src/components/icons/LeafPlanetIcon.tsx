import React from 'react';

export const LeafPlanetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4c0 0 3 4 3 8-3-4-6 0-6 4 0-4 3-8 3-12z" />
    <path d="M8 12s2 2 4 2 4-2 4-2" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
  </svg>
);