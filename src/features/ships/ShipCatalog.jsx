import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { CompareTray } from '../../components/ui/CompareTray';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function ShipCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('shipLevel');
  const [sortDirection, setSortDirection] = useState('asc');
  const [comparedIds, setComparedIds] = useState([]);

  useEffect(() => {
    fetch('/data/active/ships.json')
      .then(res => res.json())
      .then(data => {
        setShips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load ships.json:', err);
        setLoading(false);
      });
  }, []);

  const toggleCompare = (id) => {
    setComparedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
  };

  // Grouping logic based on base name and race
  const cleanName = (name) => name
    .replace(/\s*\((Light|Medium|Heavy|Class\s+\d+|MKI+|MK\s+\d+|Retro|Special|Refit|Normal|Extended|Ext|Class\s+[A-Z])\)\s*/i, '')
    .replace(/\s+(Light|Medium|Heavy|Class\s+\d+|MKI+|MK\s+\d+|Retro|Special|Refit|Normal|Extended|Ext)$/i, '')
    .trim();

  const groupsMap = {};
  ships.forEach(s => {
    const baseName = cleanName(s.name);
    const key = `${s.raceId}_${baseName.toLowerCase()}`;
    if (!groupsMap[key]) {
      groupsMap[key] = {
        baseName: baseName,
        raceId: s.raceId,
        levels: []
      };
    }
    groupsMap[key].levels.push(s);
  });

  const groupedShips = Object.values(groupsMap).map(g => {
    g.levels.sort((a, b) => {
      if (a.shipLevel !== b.shipLevel) return a.shipLevel - b.shipLevel;
      return a.id - b.id;
    });
    const topLevel = g.levels[g.levels.length - 1];
    const rootLevel = g.levels[0];
    return {
      id: rootLevel.id, // Using root ID as the base/canonical ID
      name: g.baseName, // Group base name (e.g. "Pirate Frigate")
      rootName: rootLevel.name,
      shipLevel: topLevel.shipLevel,
      minLevel: rootLevel.shipLevel,
      maxLevel: topLevel.shipLevel,
      hp: topLevel.hp,
      columns: topLevel.columns,
      rows: topLevel.rows,
      spriteId: topLevel.raw?.ExteriorSpriteId,
      levels: g.levels
    };
  });

  const filteredGroups = groupedShips.filter(g => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return g.levels.some(levelShip => 
      levelShip.name.toLowerCase().includes(query) || 
      String(levelShip.id).includes(query)
    );
  });

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    let valA = a[sortColumn] ?? 0;
    let valB = b[sortColumn] ?? 0;
    if (sortColumn === 'shipLevel') {
      valA = a.maxLevel;
      valB = b.maxLevel;
    }
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const columns = [
    {
      key: 'name',
      header: 'Ship Hull',
      cell: (s) => (
        <div className="flex items-center space-x-3">
          <SpriteFrame spriteId={s.spriteId} alt={s.name} size="sm" />
          <div>
            <div className="font-bold text-slate-100">{s.name}</div>
            <div className="text-[10px] text-slate-400">Levels {s.minLevel}-{s.maxLevel} • Root ID: {s.id}</div>
          </div>
        </div>
      )
    },
    { key: 'shipLevel', header: 'Max Level', cell: (s) => <span className="font-mono text-emerald-400">Level {s.maxLevel}</span> },
    { key: 'hp', header: 'Max HP', cell: (s) => s.hp },
    { key: 'dimensions', header: 'Grid Size', cell: (s) => <span className="font-mono">{s.columns} x {s.rows}</span> }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-100">Ship Hulls Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore and compare player ship hulls across all factions and upgrade levels.
        </p>
      </div>

      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        rarities={null}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => setSearch('')}
        totalResults={sortedGroups.length}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedGroups.map(s => (
            <EntityCard
              key={s.id}
              id={s.id}
              name={s.name}
              subtitle={`${s.levels.length} Levels (Lv ${s.minLevel}-${s.maxLevel})`}
              category={`Grid: ${s.columns}x${s.rows}`}
              spriteId={s.spriteId}
              targetPath={`/${lang}/library/ships/${s.id}`}
              isCompared={comparedIds.includes(s.id)}
              onToggleCompare={toggleCompare}
              stats={[
                { label: 'Max Level', value: s.maxLevel },
                { label: 'Max HP', value: s.hp },
                { label: 'Grid Size', value: `${s.columns}x${s.rows}` }
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedGroups}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            if (sortColumn === col) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
            else { setSortColumn(col); setSortDirection('asc'); }
          }}
          onRowClick={(s) => navigate(`/${lang}/library/ships/${s.id}`)}
        />
      )}

      <CompareTray
        selectedIds={comparedIds}
        type="ships"
        onClear={() => setComparedIds([])}
      />
    </div>
  );
}
