import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { CompareTray } from '../../components/ui/CompareTray';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { CategoryBadge } from '../../components/ui/CategoryBadge';

function RoomCard({ room, isCompared, onToggleCompare, targetPath }) {
  const topLevel = room.levels[room.levels.length - 1] || room.levels[0];
  const firstLevel = room.levels[0];

  return (
    <div className="group relative flex flex-col items-center gap-3 bg-slate-900 border border-slate-800/60 p-4 rounded-xl shadow-sm hover:border-slate-700/80 transition-all w-full">

      {/* Sprite Container — scaled to fit within the card */}
      <Link to={targetPath} className="w-full relative block">
        <div className="w-full h-44 bg-slate-950/50 rounded-lg border border-slate-800 flex items-center justify-center p-3 overflow-hidden group-hover:border-indigo-500/40 transition-colors">
          <SpriteFrame 
            spriteId={topLevel?.imageSpriteId} 
            alt={room.name} 
            size="full" 
            borderless 
            className="w-full h-full max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </div>

        {/* Stat Overlay — slides up from bottom on hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-end rounded-lg overflow-hidden pointer-events-none">
          <div className="w-full translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-slate-950/90 backdrop-blur-sm px-2 py-2 space-y-1 text-[10px] font-mono">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-center">
              <div className="flex justify-between">
                <span className="text-slate-400">Power:</span>
                <span className="font-bold text-amber-400">{topLevel.powerRequested || 0}kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CD:</span>
                <span className="font-bold text-slate-200">{topLevel.cooldown || 0}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min Lv:</span>
                <span className="font-bold text-indigo-400">{firstLevel.minShipLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Levels:</span>
                <span className="font-bold text-slate-200">{room.levels.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Name & Grid below the sprite */}
      <div className="text-center w-full min-w-0">
        <Link to={targetPath}>
          <h3 className="font-extrabold text-xs text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
            {room.name}
          </h3>
        </Link>
        <p className="text-[10px] font-mono text-slate-500 mt-1">
          <span className="text-indigo-400 font-bold">{firstLevel.columns}×{firstLevel.rows}</span>
          {' · '}{room.type}
        </p>
      </div>

      {/* Compare toggle */}
      {onToggleCompare && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleCompare(room.rootId); }}
          className={`flex items-center space-x-1 px-3 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold transition-all ${
            isCompared 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow' 
              : 'text-slate-400 hover:text-indigo-400 hover:border-slate-700'
          }`}
        >
          {isCompared ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          <span>{isCompared ? 'Compared' : 'Compare'}</span>
        </button>
      )}
    </div>
  );
}

export function RoomCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [comparedIds, setComparedIds] = useState([]);

  useEffect(() => {
    fetch('/data/active/rooms.json')
      .then(res => res.json())
      .then(data => { setRooms(data); setLoading(false); })
      .catch(err => { console.error('Failed to load rooms.json:', err); setLoading(false); });
  }, []);

  const toggleCompare = (rootId) => {
    setComparedIds(prev =>
      prev.includes(rootId) ? prev.filter(i => i !== rootId) : (prev.length < 4 ? [...prev, rootId] : prev)
    );
  };

  const filteredRooms = rooms.filter(r =>
    !search.trim() ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.type.toLowerCase().includes(search.toLowerCase()) ||
    String(r.rootId).includes(search)
  );

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (typeof valA === 'string') return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const columns = [
    {
      key: 'name',
      header: 'Room System',
      cell: (r) => {
        const topLevel = r.levels[r.levels.length - 1] || r.levels[0];
        return (
          <div className="flex items-center space-x-3">
            <SpriteFrame spriteId={topLevel?.imageSpriteId} alt={r.name} size="sm" />
            <div>
              <div className="font-bold text-slate-100">{r.name}</div>
              <div className="text-[10px] text-slate-400">{r.levels.length} Levels Available</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'type',
      header: 'Type / Category',
      cell: (r) => (
        <div className="space-x-1">
          <CategoryBadge category={r.type} />
          {r.category && <CategoryBadge category={r.category} />}
        </div>
      )
    },
    {
      key: 'dimensions',
      header: 'Grid Dimensions',
      cell: (r) => {
        const first = r.levels[0];
        return <span className="font-mono text-slate-300">{first?.columns} x {first?.rows}</span>;
      }
    },
    {
      key: 'minShipLevel',
      header: 'Min Ship Lv',
      cell: (r) => <span className="font-mono text-indigo-400">{r.levels[0]?.minShipLevel}</span>
    }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Room Systems Catalog</h1>
      </div>

      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        rarities={null}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => setSearch('')}
        totalResults={sortedRooms.length}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRooms.map(r => (
            <RoomCard
              key={r.rootId}
              room={r}
              isCompared={comparedIds.includes(r.rootId)}
              onToggleCompare={toggleCompare}
              targetPath={`/${lang}/library/rooms/${r.rootId}`}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedRooms}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            if (sortColumn === col) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
            else { setSortColumn(col); setSortDirection('asc'); }
          }}
          onRowClick={(r) => navigate(`/${lang}/library/rooms/${r.rootId}`)}
        />
      )}

      <CompareTray selectedIds={comparedIds} type="rooms" onClear={() => setComparedIds([])} />
    </div>
  );
}
