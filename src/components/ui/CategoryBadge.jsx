import React from 'react';

export function CategoryBadge({ category, className = '' }) {
  if (!category) return null;

  return (
    <span className={`inline-flex items-center rounded-md bg-indigo-950/60 text-indigo-300 px-2 py-0.5 text-xs font-mono font-bold ${className}`}>
      {category}
    </span>
  );
}
