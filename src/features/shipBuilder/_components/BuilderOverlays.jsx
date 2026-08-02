import React from 'react';
import { Trash2 } from 'lucide-react';
import { publicUrl } from '../../../utils/publicUrl';

export function HullChangePrompt({ pendingHullId, rooms, ships, onCancel, onConfirm, t }) {
  if (pendingHullId == null) return null;
  const hullName = ships.find((entry) => Number(entry.id) === pendingHullId)?.name
    || t('shipBuilder.fallbackHull', { id: pendingHullId });

  return (
    <div role="alertdialog" aria-live="assertive" aria-label={t('shipBuilder.confirmHullChange')} className="fixed bottom-3 left-3 right-3 z-[100] flex flex-col gap-3 rounded-xl bg-[var(--bg-card-header)] p-4 text-[var(--text-main)] shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[28rem]">
      <div>
        <div className="text-sm font-black">{t('shipBuilder.removeAllRooms')}</div>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {t(rooms.length === 1 ? 'shipBuilder.changeHullWarningOne' : 'shipBuilder.changeHullWarning', { hull: hullName, count: rooms.length })}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg bg-[var(--bg-input)] px-3 py-2 text-xs font-bold text-[var(--text-main)] hover:brightness-105">
          {t('shipBuilder.keepLayout')}
        </button>
        <button type="button" onClick={onConfirm} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-500">
          <Trash2 className="h-4 w-4" /> {t('shipBuilder.removeRooms')}
        </button>
      </div>
    </div>
  );
}

export function TouchRoomPreview({ drag, tileSize, zoom }) {
  if (!drag) return null;
  return (
    <div
      className="pointer-events-none fixed z-[110] flex items-center justify-center opacity-90 drop-shadow-2xl"
      style={{
        left: drag.x,
        top: drag.y,
        width: Number(drag.design.columns || 1) * tileSize * zoom,
        height: Number(drag.design.rows || 1) * tileSize * zoom,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <img src={publicUrl(`/assets/sprites/${drag.design.imageSpriteId}.webp`)} alt="" className="h-full w-full object-fill [image-rendering:pixelated]" />
    </div>
  );
}

