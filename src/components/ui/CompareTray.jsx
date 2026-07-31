import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftRight, Backpack, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export function CompareTray({ selectedIds = [], type = 'crew', onRemove, onClear }) {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isCrewInventory = type === 'crew';

  if (!selectedIds || selectedIds.length === 0) return null;

  const handleGoToCompare = () => {
    if (isCrewInventory && onClear) onClear();
    navigate(isCrewInventory
      ? `/${lang}/inventory?ids=${selectedIds.join(',')}`
      : `/${lang}/compare/${type}?ids=${selectedIds.join(',')}`);
  };
  const TrayIcon = isCrewInventory ? Backpack : ArrowLeftRight;

  return (
    <div className="fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-full max-w-xl -translate-x-1/2 px-2 sm:bottom-4 sm:px-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/95 p-3 text-slate-100 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
        
        <div className="flex min-w-0 items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400">
            <TrayIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-100">
              {isCrewInventory
                ? t('common.inventorySelected', { count: selectedIds.length })
                : t('common.comparing', { count: selectedIds.length, type })}
            </div>
            <div className="truncate text-[10px] text-slate-400 font-mono">
              {t('common.ids', { ids: selectedIds.join(', ') })}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          {onClear && (
            <button 
              onClick={onClear}
              className="flex min-h-10 min-w-10 items-center justify-center rounded-lg bg-slate-950 text-slate-400 transition-colors hover:text-rose-400"
              title={t('common.clearComparison')}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleGoToCompare}
            className="flex min-h-10 flex-1 items-center justify-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-500 sm:flex-none"
          >
            <span>{isCrewInventory ? t('common.addToInventory') : t('common.compareNow')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
