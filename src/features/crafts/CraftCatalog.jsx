import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function CraftCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('CraftName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('/data/active/crafts.json')
      .then(res => res.json())
      .then(data => {
        setCrafts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load crafts.json:', err);
        setLoading(false);
      });
  }, []);

  // Grouping logic based on RootCraftDesignId
  const groupsMap = {};
  crafts.forEach(c => {
    const rootId = c.RootCraftDesignId || c.CraftDesignId;
    if (!groupsMap[rootId]) {
      groupsMap[rootId] = {
        rootId: rootId,
        levels: []
      };
    }
    groupsMap[rootId].levels.push(c);
  });

  const groupedCrafts = Object.values(groupsMap).map(g => {
    g.levels.sort((a, b) => a.CraftDesignId - b.CraftDesignId);
    const topLevel = g.levels[g.levels.length - 1];
    const rootLevel = g.levels[0];
    
    // Extract a base name, e.g. "Interceptor Lv1" -> "Interceptor"
    const baseName = (rootLevel.CraftName || '').replace(/\s+Lv\d+/i, '').trim();

    return {
      id: rootLevel.CraftDesignId,
      name: baseName || topLevel.CraftName || 'Deployable Craft',
      spriteId: topLevel.SpriteId,
      maxSpeed: topLevel.FlightSpeed || 0,
      maxHp: topLevel.Hp || 0,
      reloadTime: topLevel.ReloadTime || topLevel.Reload || 0,
      levels: g.levels
    };
  });

  const filteredGroups = groupedCrafts.filter(c => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return c.levels.some(levelCraft => 
      (levelCraft.CraftName || '').toLowerCase().includes(query) || 
      String(levelCraft.CraftDesignId).includes(query)
    );
  });

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (sortColumn === 'CraftName') {
      valA = a.name;
      valB = b.name;
    }
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const columns = [
    {
      key: 'CraftName',
      header: 'Craft Name',
      cell: (c) => (
        <div className="flex items-center space-x-3">
          <SpriteFrame spriteId={c.spriteId} alt={c.name} size="sm" />
          <div>
            <div className="font-bold text-slate-100">{c.name}</div>
            <div className="text-[10px] text-slate-400">{c.levels.length} Levels • Root ID: {c.id}</div>
          </div>
        </div>
      )
    },
    { key: 'Hp', header: 'Max HP', cell: (c) => c.maxHp || 0 },
    { key: 'FlightSpeed', header: 'Max Speed', cell: (c) => c.maxSpeed || 0 },
    { key: 'ReloadTime', header: 'Max Reload', cell: (c) => `${c.reloadTime || 0}s` }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Deployable Crafts & Drones Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">
          Reference list of Pixel Starships deployable crafts, interceptors, repair drones, and bombers.
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
          {sortedGroups.map(c => (
            <EntityCard
              key={c.id}
              id={c.id}
              name={c.name}
              subtitle={`${c.levels.length} Levels Available`}
              spriteId={c.spriteId}
              targetPath={`/${lang}/library/crafts/${c.id}`}
              stats={[
                { label: 'Max HP', value: c.maxHp || 0 },
                { label: 'Max Speed', value: c.maxSpeed || 0 },
                { label: 'Max Reload', value: `${c.reloadTime || 0}s` }
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
          onRowClick={(c) => navigate(`/${lang}/library/crafts/${c.id}`)}
        />
      )}
    </div>
  );
}
