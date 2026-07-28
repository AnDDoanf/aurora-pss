import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftRight, Trash2 } from 'lucide-react';

export function CompareTray({ selectedIds = [], type = 'crew', onRemove, onClear }) {
  const { lang } = useParams();
  const navigate = useNavigate();

  if (!selectedIds || selectedIds.length === 0) return null;

  const handleGoToCompare = () => {
    navigate(`/${lang}/compare/${type}?ids=${selectedIds.join(',')}`);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
      <div className="flex items-center justify-between rounded-lg bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl text-slate-100 border border-slate-800">
        
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">
              Comparing {selectedIds.length} {type} (max 4)
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              IDs: {selectedIds.join(', ')}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onClear && (
            <button 
              onClick={onClear}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear Comparison Selection"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleGoToCompare}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow-sm"
          >
            <span>Compare Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
