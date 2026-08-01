import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink, X } from 'lucide-react';
import { useHref } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';

export function PlayerDetailModal({ player, onClose }) {
  const { t, lang } = useTranslation();
  const playerId = player?.id ? String(player.id) : '';
  const embeddedUrl = useHref(`/${lang}/tools/player?player=${encodeURIComponent(playerId)}&embed=true`);
  const fullPageUrl = useHref(`/${lang}/tools/player?player=${encodeURIComponent(playerId)}`);

  useEffect(() => {
    if (!player) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose, player]);

  if (!player) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-2 backdrop-blur-md sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={t('pages.player.detailFrameTitle', { name: player.name })} className="flex h-[calc(100dvh-1rem)] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl sm:h-[92vh]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-black text-slate-100">{player.name}</div>
            <div className="font-mono text-[9px] text-slate-500">#{playerId}</div>
          </div>
          <div className="flex items-center gap-2">
            <a href={fullPageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-[10px] font-bold text-slate-300 hover:text-white">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('pages.player.openFullPage')}</span>
            </a>
            <button type="button" onClick={onClose} aria-label={t('pages.player.closeDetail')} className="rounded-lg bg-slate-800 p-2 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <iframe src={embeddedUrl} title={t('pages.player.detailFrameTitle', { name: player.name })} className="min-h-0 w-full flex-1 border-0 bg-slate-950" />
      </div>
    </div>,
    document.body
  );
}

export default PlayerDetailModal;
