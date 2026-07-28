import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { SpriteFrame } from './SpriteFrame';
import { RarityBadge } from './RarityBadge';
import { CategoryBadge } from './CategoryBadge';

export function EntityCard({ 
  id, 
  name, 
  subtitle, 
  rarity, 
  category, 
  spriteId, 
  targetPath, 
  stats = [], 
  isCompared = false, 
  onToggleCompare,
  onClick
}) {
  const handleLinkClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(id);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-lg bg-slate-900 p-4 hover:bg-slate-900/80 transition-all duration-200 shadow-sm ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      
      <div>
        {/* Header with Sprite & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <SpriteFrame spriteId={spriteId} alt={name} size="md" />
            <div>
              <Link 
                to={targetPath} 
                onClick={handleLinkClick}
                className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 text-sm sm:text-base"
              >
                {name}
              </Link>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>}
            </div>
          </div>

          {rarity && <RarityBadge rarity={rarity} />}
        </div>

        {/* Category tag */}
        {category && (
          <div className="mt-3">
            <CategoryBadge category={category} />
          </div>
        )}

        {/* Stats grid */}
        {stats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-800/40 pt-3">
            {stats.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-400 bg-slate-950 px-2 py-1 rounded-md">
                <span className="text-slate-400">{st.label}:</span>
                <span className="font-bold text-slate-100">{st.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between">
        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleCompare(id);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
              isCompared 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-950 text-slate-400 hover:text-slate-100'
            }`}
          >
            {isCompared ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
          </button>
        )}

        <Link
          to={targetPath}
          onClick={handleLinkClick}
          className="ml-auto flex items-center space-x-1 text-xs text-indigo-400 font-bold hover:underline group-hover:translate-x-0.5 transition-transform"
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
