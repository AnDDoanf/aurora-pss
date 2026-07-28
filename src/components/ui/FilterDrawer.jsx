import React from 'react';
import { Search, RotateCcw, LayoutGrid, Table } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export function FilterDrawer({
  searchQuery,
  onSearchChange,
  selectedRarity,
  onRarityChange,
  rarities = ['All', 'Common', 'Elite', 'Hero', 'Legend', 'Special', 'Unique'],
  viewMode = 'grid',
  onViewModeChange,
  onReset,
  totalResults = 0,
  children
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 bg-slate-900 p-4 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter catalog..."
            className="w-full bg-slate-950 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filters bar */}
        <div className="flex items-center flex-wrap gap-3">
          {rarities && (
            <select
              value={selectedRarity}
              onChange={(e) => onRarityChange(e.target.value)}
              className="bg-slate-950 text-xs text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="All">All Rarities</option>
              {rarities.filter(r => r !== 'All').map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}

          {children}

          {/* View mode toggle */}
          {onViewModeChange && (
            <div className="flex items-center rounded-lg bg-slate-950 p-1 space-x-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Grid Cards View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                title="Dense Table View"
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Reset button */}
          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-indigo-400 px-2 py-1.5 transition-colors font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('common.resetFilters')}</span>
            </button>
          )}
        </div>

      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/40">
        <span>Found <strong className="text-slate-100">{totalResults}</strong> matching entries</span>
      </div>
    </div>
  );
}
