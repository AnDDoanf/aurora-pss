import React from 'react';
import { publicUrl } from '../../../utils/publicUrl';
import { deploymentLimitForDesign, hasConflictingSuperWeapon } from '../layoutModel';

export function RoomPalette({
  activeLineDesignId, cancelPointerDrag, entries, finishPointerDrag, layout,
  movePointerDrag, onDragEnd, onDragStart, onPointerDown, onSelect, roomById,
  roomPurchases, rooms, selectedPaletteDesignId, ship, t
}) {
  return (
    <div className={layout === 'rows'
      ? 'ship-builder-scrollbar grid min-h-20 w-full grid-flow-col grid-rows-1 auto-cols-max items-center gap-2 overflow-x-auto pb-2 sm:min-h-36 sm:grid-rows-2'
      : 'ship-builder-scrollbar grid w-56 grid-cols-2 content-start items-center gap-2 overflow-y-auto p-2'}>
      {entries.length ? entries.map((entry) => {
        const rootId = Number(entry.rootId || entry.id);
        const deployed = rooms.filter((room) => {
          const deployedDesign = roomById.get(Number(room.roomDesignId));
          return Number(deployedDesign?.rootId || deployedDesign?.id) === rootId;
        }).length;
        const limit = deploymentLimitForDesign(ship, entry, roomPurchases);
        const capped = hasConflictingSuperWeapon(rooms, entry, roomById) || deployed >= limit;
        const capLabel = Number.isFinite(limit)
          ? t('shipBuilder.deploymentCap', { deployed, limit })
          : '';

        return (
          <button
            type="button"
            key={entry.id}
            draggable={!capped}
            aria-disabled={capped}
            title={t('shipBuilder.designTooltip', {
              name: entry.name, id: entry.id, columns: entry.columns, rows: entry.rows, cap: capLabel
            })}
            onDragStart={(event) => onDragStart(event, entry)}
            onDragEnd={onDragEnd}
            onPointerDown={(event) => onPointerDown(event, entry)}
            onPointerMove={movePointerDrag}
            onPointerUp={finishPointerDrag}
            onPointerCancel={cancelPointerDrag}
            onClick={() => onSelect(entry)}
            className={`group flex h-16 min-w-16 shrink-0 touch-pan-x items-center justify-center bg-transparent p-1 transition hover:brightness-125 ${capped ? 'cursor-default opacity-30' : 'cursor-grab active:cursor-grabbing'} ${
              Number(activeLineDesignId) === Number(entry.id)
                ? 'ring-2 ring-inset ring-cyan-400'
                : Number(selectedPaletteDesignId) === Number(entry.id) ? 'ring-2 ring-inset ring-indigo-400' : ''
            }`}
          >
            <img src={publicUrl(`/assets/sprites/${entry.imageSpriteId}.webp`)} alt={entry.name} className="max-h-16 max-w-full object-contain [image-rendering:pixelated]" />
          </button>
        );
      }) : <div className="col-span-2 flex items-center justify-center text-xs text-slate-500">{t('shipBuilder.noRooms')}</div>}
    </div>
  );
}

