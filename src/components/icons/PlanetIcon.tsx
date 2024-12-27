import React from 'react';

export const PlanetIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M7 12a10 10 0 0 1 10 0" />
    <path d="M16 8a10 10 0 0 1 0 8" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
  </svg>
);