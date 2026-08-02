import React, { useRef } from 'react';
import { publicUrl } from '../../../utils/publicUrl';
import { TILE_SIZE } from '../layoutModel';

export function RoomTile({ room, design, issues, selected, zoom, onSelect, onMoveStart, onMove, onDragEnd }) {
  const drag = useRef(null);

  if (!design) {
    return (
      <button
        type="button"
        data-ship-room="true"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={() => onSelect(room.uid)}
        className="absolute z-20 flex items-center justify-center bg-rose-950/90 text-[8px] font-bold text-rose-200"
        style={{
          left: room.column * TILE_SIZE * zoom,
          top: room.row * TILE_SIZE * zoom,
          width: TILE_SIZE * zoom,
          height: TILE_SIZE * zoom
        }}
      >
        {room.roomDesignId}
      </button>
    );
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      column: room.column,
      row: room.row,
      latestColumn: room.column,
      latestRow: room.row
    };
    onMoveStart();
    onSelect(room.uid);
  };

  const handlePointerMove = (event) => {
    if (!drag.current) return;
    const column = drag.current.column + Math.round((event.clientX - drag.current.x) / (TILE_SIZE * zoom));
    const row = drag.current.row + Math.round((event.clientY - drag.current.y) / (TILE_SIZE * zoom));
    drag.current.latestColumn = column;
    drag.current.latestRow = row;
    onMove(room.uid, column, row);
  };

  const finishDragging = () => {
    if (drag.current) onDragEnd(room.uid, drag.current.latestColumn, drag.current.latestRow, design);
    drag.current = null;
  };

  const cancelDragging = () => {
    drag.current = null;
  };

  return (
    <button
      type="button"
      data-ship-room="true"
      title={`${design.name} · ${room.column},${room.row}${issues?.length ? ` · ${issues.join(', ')}` : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDragging}
      onPointerCancel={cancelDragging}
      className={`absolute z-10 touch-none select-none overflow-hidden transition-[filter,box-shadow] ${
        issues?.length
          ? 'ring-2 ring-inset ring-rose-500 brightness-110'
          : selected
            ? 'ring-2 ring-inset ring-cyan-300 brightness-110'
            : 'hover:brightness-110'
      }`}
      style={{
        left: room.column * TILE_SIZE * zoom,
        top: room.row * TILE_SIZE * zoom,
        width: Number(design.columns || 1) * TILE_SIZE * zoom,
        height: Number(design.rows || 1) * TILE_SIZE * zoom
      }}
    >
      <img
        src={publicUrl(`/assets/sprites/${design.imageSpriteId}.webp`)}
        alt={design.name}
        draggable="false"
        className="h-full w-full object-fill [image-rendering:pixelated]"
      />
    </button>
  );
}

