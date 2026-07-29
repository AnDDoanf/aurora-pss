import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { SpriteFrame } from './SpriteFrame';
import { RarityBadge } from './RarityBadge';

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
      className={`group relative flex flex-col items-center justify-between rounded-xl bg-slate-900/90 p-4 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 backdrop-blur-sm w-full ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="w-full flex flex-col items-center gap-3">
        {/* Featured Large Sprite Container */}
        <Link to={targetPath} className="w-full relative block">
          <div className="w-full h-52 sm:h-56 bg-slate-950/60 rounded-lg flex items-center justify-center p-3 overflow-hidden transition-all relative shadow-inner">
            {rarity && (
              <div className="absolute top-2.5 right-2.5 z-10">
                <RarityBadge rarity={rarity} />
              </div>
            )}
            <SpriteFrame 
              spriteId={spriteId} 
              alt={name} 
              size="full" 
              borderless 
              className="w-full h-full max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110" 
            />

            {/* Hover Dark Translucent Info Overlay */}
            {stats.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-end rounded-lg overflow-hidden pointer-events-none">
                <div className="w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-slate-950/90 backdrop-blur-md p-3 space-y-1.5 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    {stats.map((st, idx) => (
                      <div key={idx} className="flex flex-col items-start bg-slate-900/80 px-2.5 py-1.5 rounded">
                        <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">{st.label}</span>
                        <span className="font-bold text-slate-100 text-xs truncate">{st.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Name & Subtitle below sprite container */}
        <div className="text-center w-full min-w-0 pt-1">
          <Link to={targetPath}>
            <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
              {name}
            </h3>
          </Link>
          {(subtitle || category) && (
            <p className="text-xs font-mono text-slate-400 mt-1 truncate">
              {category && <span className="text-indigo-400 font-bold">{category}</span>}
              {category && subtitle && ' · '}
              {subtitle && <span>{subtitle}</span>}
            </p>
          )}
        </div>
      </div>

      {/* Compare Button */}
      {onToggleCompare && (
        <div className="mt-3 w-full flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleCompare(id);
            }}
            className={`flex items-center justify-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCompared 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 shadow-sm hover:shadow'
            }`}
          >
            {isCompared ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
