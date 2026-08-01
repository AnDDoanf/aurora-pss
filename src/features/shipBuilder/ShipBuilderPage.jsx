import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Check, Clipboard, Copy, Grid3X3, MousePointer2, Plus,
  Search, Trash2, Upload, X
} from 'lucide-react';
import { publicUrl } from '../../utils/publicUrl';
import {
  buildBuilderSearch,
  buildPixelPrestigeUrl,
  parseShipBuilderInput
} from './shipBuilderUrl';
import {
  deploymentLimitForDesign,
  findFirstPlacement,
  flattenRoomCatalog,
  gridPositionFromPointer,
  isPlayerShipRoomDesign,
  isRoomOutsideHull,
  TILE_SIZE,
  validateLayout
} from './layoutModel';

const EMPTY_LAYOUT_URL = 'https://pixel-prestige.com/ship-builder.php?ship=386&rooms=';

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement('textarea');
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

function RoomTile({ room, design, issues, selected, zoom, onSelect, onMove, onDragEnd }) {
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

export function ShipBuilderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ships, setShips] = useState([]);
  const [roomCatalog, setRoomCatalog] = useState([]);
  const [roomPurchases, setRoomPurchases] = useState([]);
  const [shipId, setShipId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [sourceInput, setSourceInput] = useState(EMPTY_LAYOUT_URL);
  const [selectedUid, setSelectedUid] = useState(null);
  const [roomSearch, setRoomSearch] = useState('');
  const [zoom, setZoom] = useState(0.75);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [dropActive, setDropActive] = useState(false);
  const [canvasPanning, setCanvasPanning] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [pendingHullId, setPendingHullId] = useState(null);
  const uidCounter = useRef(10000);
  const canvasPan = useRef(null);

  useEffect(() => {
    setCanvasOffset({ x: 0, y: 0 });
  }, [shipId]);

  useEffect(() => {
    Promise.all([
      fetch('/data/active/ships.json').then((response) => response.json()),
      fetch('/data/active/rooms.json').then((response) => response.json()),
      fetch('/data/active/roomPurchases.json').then((response) => response.json())
    ])
      .then(([shipData, roomGroups, purchaseData]) => {
        const catalog = flattenRoomCatalog(roomGroups);
        const playerCatalog = catalog.filter((design) => isPlayerShipRoomDesign(design, purchaseData));
        const playerDesignIds = new Set(playerCatalog.map((design) => Number(design.id)));
        setShips(shipData);
        setRoomCatalog(playerCatalog);
        setRoomPurchases(purchaseData);

        const query = searchParams.toString();
        if (searchParams.get('ship')) {
          const parsed = parseShipBuilderInput(query);
          setShipId(parsed.shipId);
          setRooms(parsed.rooms.filter((room) => playerDesignIds.has(Number(room.roomDesignId))));
          setSourceInput(buildPixelPrestigeUrl(parsed.shipId, parsed.rooms));
        } else {
          setShipId(shipData.some((ship) => ship.id === 386) ? 386 : shipData[0]?.id);
        }
      })
      .catch((loadError) => setError(loadError.message || 'Could not load ship-builder data.'))
      .finally(() => setLoading(false));
    // Initial URL import only. Later edits stay local until Share is selected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ship = useMemo(
    () => ships.find((entry) => Number(entry.id) === Number(shipId)) || null,
    [ships, shipId]
  );
  const roomById = useMemo(
    () => new Map(roomCatalog.map((entry) => [Number(entry.id), entry])),
    [roomCatalog]
  );
  const issues = useMemo(
    () => validateLayout(ship, rooms, roomById, roomPurchases),
    [ship, rooms, roomById, roomPurchases]
  );
  const selectedRoom = rooms.find((room) => room.uid === selectedUid) || null;
  const selectedDesign = selectedRoom ? roomById.get(Number(selectedRoom.roomDesignId)) : null;
  const selectedIssues = selectedRoom ? issues.get(selectedRoom.uid) || [] : [];
  const invalidCount = issues.size;

  const paletteRooms = useMemo(() => {
    const query = roomSearch.trim().toLowerCase();
    const availableCatalog = roomCatalog.filter((entry) => Number(entry.minShipLevel || 1) <= Number(ship?.shipLevel || 0));
    if (query) {
      return availableCatalog
        .filter((entry) => String(entry.id) === query || entry.name.toLowerCase().includes(query))
        .sort((a, b) => b.level - a.level || a.name.localeCompare(b.name))
        .slice(0, 80);
    }

    const latestByRoot = new Map();
    availableCatalog.forEach((entry) => {
      const rootId = Number(entry.rootId || entry.id);
      const current = latestByRoot.get(rootId);
      if (!current || Number(entry.level) > Number(current.level)) latestByRoot.set(rootId, entry);
    });
    return [...latestByRoot.values()].sort((a, b) => (
      String(a.raw?.CategoryType || '').localeCompare(String(b.raw?.CategoryType || ''))
      || a.name.localeCompare(b.name)
    ));
  }, [roomCatalog, roomSearch, ship]);

  const importLayout = () => {
    try {
      const parsed = parseShipBuilderInput(sourceInput);
      if (!ships.some((entry) => Number(entry.id) === parsed.shipId)) {
        throw new Error(`Ship design #${parsed.shipId} is not available in the active snapshot.`);
      }
      setShipId(parsed.shipId);
      setRooms(parsed.rooms.filter((room) => roomById.has(Number(room.roomDesignId))));
      setSelectedUid(null);
      setError('');
      setSearchParams(buildBuilderSearch(parsed.shipId, parsed.rooms), { replace: true });
    } catch (importError) {
      setError(importError.message || 'The layout URL could not be imported.');
    }
  };

  const moveRoom = (uid, column, row) => {
    setRooms((current) => current.map((entry) => (
      entry.uid === uid ? { ...entry, column, row } : entry
    )));
  };

  const changeHull = (nextShipId) => {
    if (Number(nextShipId) === Number(shipId)) return;
    if (rooms.length) {
      setPendingHullId(Number(nextShipId));
      return;
    }
    setShipId(Number(nextShipId));
    setRooms([]);
    setSelectedUid(null);
  };

  const confirmHullChange = () => {
    if (pendingHullId == null) return;
    setShipId(pendingHullId);
    setRooms([]);
    setSelectedUid(null);
    setPendingHullId(null);
  };

  const finishRoomDrag = (uid, column, row, design) => {
    if (!isRoomOutsideHull(ship, { column, row }, design)) return;
    setRooms((current) => current.filter((entry) => entry.uid !== uid));
    setSelectedUid((current) => (current === uid ? null : current));
  };

  const addRoomAt = (design, placement) => {
    const rootId = Number(design.rootId || design.id);
    const deployed = rooms.filter((room) => {
      const deployedDesign = roomById.get(Number(room.roomDesignId));
      return Number(deployedDesign?.rootId || deployedDesign?.id) === rootId;
    }).length;
    if (deployed >= deploymentLimitForDesign(ship, design, roomPurchases)) return false;

    uidCounter.current += 1;
    const next = {
      uid: `added-${uidCounter.current}`,
      roomDesignId: design.id,
      ...placement
    };
    setRooms((current) => [...current, next]);
    setSelectedUid(next.uid);
    setRoomSearch('');
    return true;
  };

  const addRoom = (design) => {
    addRoomAt(design, findFirstPlacement(ship, rooms, design, roomById, roomPurchases));
  };

  const startPaletteDrag = (event, design) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-pss-room-design', String(design.id));
    event.dataTransfer.setData('text/plain', String(design.id));
  };

  const dropPaletteRoom = (event) => {
    event.preventDefault();
    setDropActive(false);
    const designId = Number(
      event.dataTransfer.getData('application/x-pss-room-design')
      || event.dataTransfer.getData('text/plain')
    );
    const design = roomById.get(designId);
    if (!design || !ship) return;
    const placement = gridPositionFromPointer(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
      zoom,
      design,
      ship
    );
    addRoomAt(design, placement);
  };

  const removeSelected = () => {
    if (!selectedUid) return;
    setRooms((current) => current.filter((entry) => entry.uid !== selectedUid));
    setSelectedUid(null);
  };

  const copyExport = async (type) => {
    const value = type === 'share'
      ? `${window.location.origin}${window.location.pathname}?${buildBuilderSearch(shipId, rooms)}`
      : buildPixelPrestigeUrl(shipId, rooms);
    await copyText(value);
    if (type === 'share') setSearchParams(buildBuilderSearch(shipId, rooms), { replace: true });
    setCopied(type);
    window.setTimeout(() => setCopied(''), 1600);
  };

  const startCanvasPan = (event) => {
    if (event.button !== 0 || event.target.closest('[data-ship-room="true"], [data-canvas-control="true"]')) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    canvasPan.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: canvasOffset.x,
      offsetY: canvasOffset.y
    };
    setCanvasPanning(true);
  };

  const moveCanvasPan = (event) => {
    if (!canvasPan.current) return;
    setCanvasOffset({
      x: canvasPan.current.offsetX + event.clientX - canvasPan.current.x,
      y: canvasPan.current.offsetY + event.clientY - canvasPan.current.y
    });
  };

  const stopCanvasPan = () => {
    canvasPan.current = null;
    setCanvasPanning(false);
  };

  const wideHull = Number(ship?.columns || 0) > 50;
  const renderRoomPalette = (layout) => (
    <div className={layout === 'rows'
      ? 'ship-builder-scrollbar grid min-h-36 w-full grid-flow-col grid-rows-2 auto-cols-max items-center gap-2 overflow-x-auto pb-2'
      : 'ship-builder-scrollbar grid w-56 grid-cols-2 content-start items-center gap-2 overflow-y-auto p-2'}>
      {paletteRooms.length ? paletteRooms.map((entry) => (
        (() => {
          const rootId = Number(entry.rootId || entry.id);
          const deployed = rooms.filter((room) => {
            const deployedDesign = roomById.get(Number(room.roomDesignId));
            return Number(deployedDesign?.rootId || deployedDesign?.id) === rootId;
          }).length;
          const limit = deploymentLimitForDesign(ship, entry, roomPurchases);
          const capped = deployed >= limit;
          const capLabel = Number.isFinite(limit) ? ` · ${deployed}/${limit} deployed` : '';
          return (
        <button
          type="button"
          key={entry.id}
          draggable={!capped}
          disabled={capped}
          title={`${entry.name} · design #${entry.id} · ${entry.columns}×${entry.rows}${capLabel}`}
          onDragStart={(event) => startPaletteDrag(event, entry)}
          onDragEnd={() => setDropActive(false)}
          onClick={() => addRoom(entry)}
          className="group flex h-16 min-w-16 shrink-0 cursor-grab items-center justify-center bg-transparent p-1 transition hover:brightness-125 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:brightness-100"
        >
          <img src={publicUrl(`/assets/sprites/${entry.imageSpriteId}.webp`)} alt={entry.name} className="max-h-16 max-w-full object-contain [image-rendering:pixelated]" />
        </button>
          );
        })()
      )) : <div className="col-span-2 flex items-center justify-center text-xs text-slate-500">No rooms found.</div>}
    </div>
  );

  if (loading) {
    return <div className="p-12 text-center font-mono text-sm text-slate-400">Loading ship builder assets...</div>;
  }

  return (
    <div className="w-full space-y-4 py-1 text-[var(--text-main)]">
      {pendingHullId != null && (
        <div
          role="alertdialog"
          aria-live="assertive"
          aria-label="Confirm hull change"
          className="fixed bottom-3 left-3 right-3 z-[100] flex flex-col gap-3 rounded-xl bg-[var(--bg-card-header)] p-4 text-[var(--text-main)] shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 sm:w-[28rem]"
        >
          <div>
            <div className="text-sm font-black">Remove all rooms?</div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Changing to {ships.find((entry) => Number(entry.id) === pendingHullId)?.name || `hull #${pendingHullId}`} will remove all {rooms.length} placed room{rooms.length === 1 ? '' : 's'}.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setPendingHullId(null)} className="rounded-lg bg-[var(--bg-input)] px-3 py-2 text-xs font-bold text-[var(--text-main)] hover:brightness-105">
              Keep layout
            </button>
            <button type="button" onClick={confirmHullChange} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-500">
              <Trash2 className="h-4 w-4" /> Remove rooms
            </button>
          </div>
        </div>
      )}
      <section className="overflow-hidden rounded-2xl bg-[var(--bg-card)]">
        <div className="bg-[var(--bg-card-header)] p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                <Grid3X3 className="h-4 w-4" /> Client-side layout editor
              </div>
              <h1 className="text-2xl font-black text-[var(--text-main)] sm:text-4xl">Pixel Starships Ship Builder</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
                Paste a Pixel Prestige link, inspect the imported layout, then drag rooms on the 25-pixel ship grid.
                No player login or access token is required.
              </p>
            </div>
            <div className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-bold ${
              invalidCount ? 'ship-builder-status-error' : 'ship-builder-status-valid'
            }`}>
              {invalidCount ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              {invalidCount ? `${invalidCount} invalid room${invalidCount === 1 ? '' : 's'}` : 'Layout valid'}
            </div>
          </div>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-[1fr_auto] sm:p-5">
          <label className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Pixel Prestige URL or query string</span>
            <textarea
              value={sourceInput}
              onChange={(event) => setSourceInput(event.target.value)}
              rows={3}
              spellCheck="false"
              className="w-full resize-y rounded-xl bg-[var(--bg-input)] px-4 py-3 font-mono text-xs leading-5 text-[var(--text-main)] outline-none transition focus:ring-2 focus:ring-indigo-500"
              placeholder={EMPTY_LAYOUT_URL}
            />
          </label>
          <button
            type="button"
            onClick={importLayout}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-end rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
          >
            <Upload className="h-4 w-4" /> Import layout
          </button>
        </div>
        {error && <div className="mx-5 mb-5 rounded-lg bg-rose-950/60 px-4 py-3 text-sm text-rose-300">{error}</div>}
      </section>

      <section className="w-full overflow-hidden rounded-2xl bg-[var(--bg-card)]">
        <div className="shrink-0 bg-[var(--bg-card-header)] p-3">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-[var(--text-main)]">Rooms</h2>
              <span className="text-[10px] text-[var(--text-muted)]">Drag a sprite onto the ship · click to auto-place</span>
            </div>
            <div className="relative ml-auto w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                value={roomSearch}
                onChange={(event) => setRoomSearch(event.target.value)}
                placeholder="Filter rooms by name or ID..."
                className="w-full rounded-lg bg-[var(--bg-input)] py-2 pl-9 pr-3 text-xs text-[var(--text-main)] outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

        </div>

        <div className="flex h-[calc(100dvh-9rem)] min-h-0 flex-col overflow-hidden">
        <div className="flex shrink-0 flex-wrap items-end gap-3 bg-[var(--bg-card)] p-3">
          <label className="min-w-[260px] flex-1">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-500">Hull</span>
            <select
              value={shipId || ''}
              onChange={(event) => changeHull(event.target.value)}
              className="w-full max-w-2xl rounded-lg bg-[var(--bg-input)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {ships.map((entry) => (
                <option key={entry.id} value={entry.id}>#{entry.id} · {entry.name} · Lv {entry.shipLevel}</option>
              ))}
            </select>
          </label>

          <label className="w-40">
            <span className="mb-1 flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-500">
              <span>Zoom</span><span>{Math.round(zoom * 100)}%</span>
            </span>
            <input type="range" min="0.4" max="1.25" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="w-full accent-indigo-500" />
          </label>

          <div className="ml-auto flex gap-2">
            <button type="button" onClick={() => copyExport('pixel')} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-indigo-500">
              {copied === 'pixel' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied === 'pixel' ? 'Copied' : 'Pixel Prestige URL'}</span>
            </button>
            <button type="button" onClick={() => copyExport('share')} className="inline-flex items-center gap-2 rounded-lg bg-[var(--bg-input)] px-3 py-2.5 text-xs font-bold text-[var(--text-main)] hover:brightness-105">
              {copied === 'share' ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              <span className="hidden sm:inline">{copied === 'share' ? 'Copied' : 'Share builder'}</span>
            </button>
          </div>
        </div>

        <div className="flex min-h-0 w-full flex-1 overflow-hidden border border-[var(--border-color)] bg-transparent">
          <div
            onPointerDown={startCanvasPan}
            onPointerMove={moveCanvasPan}
            onPointerUp={stopCanvasPan}
            onPointerCancel={stopCanvasPan}
            className={`relative h-full min-w-0 flex-1 touch-none overflow-hidden p-4 sm:p-7 ${
              canvasPanning ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {selectedRoom && (
              <div data-canvas-control="true" className="absolute right-3 top-3 z-50 flex min-w-0 flex-wrap items-center gap-2 rounded-xl bg-[var(--bg-card-header)] p-2 shadow-xl">
                {selectedDesign && <img src={publicUrl(`/assets/sprites/${selectedDesign.imageSpriteId}.webp`)} alt="" className="h-9 w-9 object-contain [image-rendering:pixelated]" />}
                <div className="max-w-40">
                  <div className="truncate text-[11px] font-bold text-[var(--text-main)]">{selectedDesign?.name || `Unknown #${selectedRoom.roomDesignId}`}</div>
                  <div className="font-mono text-[9px] text-[var(--text-muted)]">#{selectedRoom.roomDesignId}</div>
                </div>
                {['column', 'row'].map((field) => (
                  <label key={field} className="w-14 rounded-md bg-[var(--bg-input)] px-2 py-1">
                    <span className="block text-[8px] font-bold uppercase text-[var(--text-muted)]">{field === 'column' ? 'Col' : 'Row'}</span>
                    <input
                      type="number"
                      value={selectedRoom[field]}
                      onChange={(event) => moveRoom(selectedRoom.uid,
                        field === 'column' ? Number(event.target.value) : selectedRoom.column,
                        field === 'row' ? Number(event.target.value) : selectedRoom.row)}
                      className="w-full bg-transparent font-mono text-xs font-bold text-indigo-500 outline-none"
                    />
                  </label>
                ))}
                <button type="button" onClick={removeSelected} title="Remove selected room" className="rounded-lg bg-rose-950 p-2 text-rose-300 hover:bg-rose-900">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
            {selectedIssues.length > 0 && (
              <div className={`pointer-events-none absolute left-3 right-3 z-50 flex h-9 flex-nowrap items-center gap-2 overflow-hidden rounded-lg bg-rose-950/90 px-3 shadow-lg ${selectedRoom ? 'top-20' : 'top-3'}`}>
                {selectedIssues.map((issue) => <span key={issue} className="shrink-0 text-[10px] font-bold text-rose-300">{issue}</span>)}
              </div>
            )}
            {ship ? (
              <div
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
                setDropActive(true);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setDropActive(false);
              }}
              onDrop={dropPaletteRoom}
              className={`relative shrink-0 overflow-hidden bg-transparent transition-shadow ${
                dropActive ? 'ring-4 ring-cyan-400 ring-offset-4 ring-offset-transparent' : ''
              }`}
              style={{
                width: ship.columns * TILE_SIZE * zoom,
                height: ship.rows * TILE_SIZE * zoom,
                marginInline: 'auto',
                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
              }}
            >
              <img src={publicUrl(`/assets/sprites/${ship.raw?.InteriorSpriteId}.webp`)} alt={`${ship.name} interior`} draggable="false" className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill [image-rendering:pixelated]" />
              {rooms.map((room) => (
                <RoomTile key={room.uid} room={room} design={roomById.get(Number(room.roomDesignId))} issues={issues.get(room.uid)} selected={room.uid === selectedUid} zoom={zoom} onSelect={setSelectedUid} onMove={moveRoom} onDragEnd={finishRoomDrag} />
              ))}
              {dropActive && (
                <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-cyan-950/25">
                  <div className="rounded-xl bg-[var(--bg-card)] px-5 py-3 text-sm font-black text-cyan-500 shadow-2xl">Drop room on the grid</div>
                </div>
              )}
              </div>
            ) : <div className="p-12 text-center text-sm text-rose-300">Hull #{shipId} was not found.</div>}
          </div>
          {!wideHull && (
            <aside className="hidden h-full w-56 shrink-0 overflow-hidden bg-transparent sm:flex">
              {renderRoomPalette('columns')}
            </aside>
          )}
        </div>

        <div className={`${wideHull ? 'block' : 'block sm:hidden'} shrink-0 bg-transparent px-3 pt-2`}>
            {renderRoomPalette('rows')}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 bg-[var(--bg-card-header)] p-3 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2"><MousePointer2 className="h-4 w-4 text-cyan-400" /> Drag palette sprites onto the ship, then drag placed rooms to reposition.</span>
          <span className="font-mono">{rooms.length} rooms · {ship?.columns || 0}×{ship?.rows || 0} grid · hull #{shipId}</span>
        </div>
        </div>
      </section>
    </div>
  );
}
