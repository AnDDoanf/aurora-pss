import React, { useState } from 'react';
import { Plus, Copy, Trash2, Clock, Infinity, Layers } from 'lucide-react';
import { useTranslation } from '../../../i18n/useTranslation';

export function SnapshotTimeline({
  snapshots,
  activeSnapshotId,
  onSelectSnapshot,
  onAddSnapshot,
  onCopySnapshotLayout,
  onDeleteSnapshot,
  onUpdateDuration,
  onUpdateName
}) {
  const { t } = useTranslation();
  const [copySourceId, setCopySourceId] = useState('');
  const [showCopyModal, setShowCopyModal] = useState(false);

  const activeSnapshot = snapshots.find(s => s.id === activeSnapshotId) || snapshots[0];

  const handleCopy = () => {
    if (copySourceId && copySourceId !== activeSnapshotId) {
      onCopySnapshotLayout(copySourceId, activeSnapshotId);
      setShowCopyModal(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg backdrop-blur-sm">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-5 w-5 text-indigo-400" />
          <h2 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
            {t('pages.capacity.snapshots')}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 font-mono border border-indigo-800/50">
            {t('pages.capacity.snapshotCount', { count: snapshots.length })}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCopyModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all border border-slate-700/60"
            title={t('pages.capacity.copyHint')}
          >
            <Copy className="h-3.5 w-3.5 text-indigo-400" />
            <span>{t('pages.capacity.copyLayout')}</span>
          </button>

          <button
            onClick={onAddSnapshot}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t('pages.capacity.addSnapshot')}</span>
          </button>
        </div>
      </div>

      {/* Snapshot Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {snapshots.map((snap, index) => {
          const isActive = snap.id === activeSnapshotId;
          const isInfinite = snap.duration === null || snap.duration === undefined || snap.duration === '';
          return (
            <div
              key={snap.id}
              onClick={() => onSelectSnapshot(snap.id)}
              className={`flex items-center space-x-2.5 px-3.5 py-2 rounded-lg cursor-pointer transition-all shrink-0 border ${
                isActive
                  ? 'bg-indigo-600/90 text-white font-bold border-indigo-400 shadow-md shadow-indigo-950/50'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border-slate-800'
              }`}
            >
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-indigo-950/60 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                #{index + 1}
              </span>
              <span className="text-xs font-semibold whitespace-nowrap">{snap.name || t('pages.capacity.snapshotName', { number: index + 1 })}</span>

              <div className="flex items-center space-x-1 text-[11px] opacity-80 pl-1 border-l border-current/20">
                <Clock className="h-3 w-3 shrink-0" />
                {isInfinite ? (
                  <Infinity className="h-3.5 w-3.5 font-bold" />
                ) : (
                  <span className="font-mono">{snap.duration}s</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Snapshot Settings & Controls Bar */}
      {activeSnapshot && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
          <div className="flex flex-col items-stretch gap-1.5 sm:col-span-5 sm:flex-row sm:items-center sm:space-x-2 sm:gap-0">
            <label className="text-xs font-medium text-slate-400 shrink-0">{t('pages.capacity.name')}</label>
            <input
              type="text"
              value={activeSnapshot.name}
              onChange={(e) => onUpdateName(activeSnapshot.id, e.target.value)}
              placeholder={t('pages.capacity.namePlaceholder')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs text-slate-100 font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col items-stretch gap-1.5 sm:col-span-5 sm:flex-row sm:items-center sm:space-x-2 sm:gap-0">
            <label className="text-xs font-medium text-slate-400 shrink-0">{t('pages.capacity.duration')}</label>
            <input
              type="number"
              min="1"
              value={activeSnapshot.duration === null || activeSnapshot.duration === undefined ? '' : activeSnapshot.duration}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateDuration(activeSnapshot.id, val === '' ? null : Math.max(1, Number(val)));
              }}
              placeholder={t('pages.capacity.durationPlaceholder')}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-md px-2.5 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
            {activeSnapshot.duration === null || activeSnapshot.duration === undefined || activeSnapshot.duration === '' ? (
              <span className="text-xs text-amber-400 flex items-center space-x-1 shrink-0 font-medium" title={t('pages.capacity.infiniteHint')}>
                <Infinity className="h-4 w-4" />
                <span>{t('pages.capacity.infinite')}</span>
              </span>
            ) : null}
          </div>

          <div className="flex sm:col-span-2 sm:justify-end">
            {snapshots.length > 1 && (
              <button
                onClick={() => onDeleteSnapshot(activeSnapshot.id)}
                className="flex min-h-10 w-full items-center justify-center space-x-1 rounded border border-rose-800/50 bg-rose-950/60 px-2.5 py-1.5 text-xs text-rose-300 transition-colors hover:bg-rose-900 sm:w-auto"
                title={t('pages.capacity.deleteHint')}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t('pages.capacity.delete')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Copy Layout Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4">
          <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-5">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
              <Copy className="h-4 w-4 text-indigo-400" />
              <span>{t('pages.capacity.copyTitle')}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('pages.capacity.copyDescription', { name: activeSnapshot?.name })}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">{t('pages.capacity.sourceSnapshot')}</label>
              <select
                value={copySourceId}
                onChange={(e) => setCopySourceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">{t('pages.capacity.chooseSource')}</option>
                {snapshots
                  .filter(s => s.id !== activeSnapshotId)
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.duration ? `${s.duration}s` : t('pages.capacity.infinite')})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:items-center sm:justify-end">
              <button
                onClick={() => setShowCopyModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
              >
                {t('pages.capacity.cancel')}
              </button>
              <button
                disabled={!copySourceId}
                onClick={handleCopy}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white transition-all shadow-sm"
              >
                {t('pages.capacity.applyCopy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
