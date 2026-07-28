import React from 'react';

const RARITY_STYLES = {
  Common: 'bg-slate-800/80 text-slate-300',
  Elite: 'bg-indigo-950/80 text-indigo-300',
  Unique: 'bg-emerald-950/80 text-emerald-300',
  Epic: 'bg-amber-950/80 text-amber-300',
  Hero: 'bg-purple-950/80 text-purple-300',
  Special: 'bg-pink-950/80 text-pink-300',
  Legendary: 'bg-orange-950/80 text-orange-300',
  Legend: 'bg-orange-950/80 text-orange-300'
};

export function RarityBadge({ rarity = 'Common', className = '' }) {
  const style = RARITY_STYLES[rarity] || RARITY_STYLES.Common;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${style} ${className}`}>
      {rarity}
    </span>
  );
}
