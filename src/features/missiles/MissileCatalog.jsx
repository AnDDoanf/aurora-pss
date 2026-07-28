import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function MissileCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [missiles, setMissiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('MissileName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('/data/active/missiles.json')
      .then(res => res.json())
      .then(data => {
        setMissiles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load missiles.json:', err);
        setLoading(false);
      });
  }, []);

  // Grouping logic based on RootMissileDesignId
  const groupsMap = {};
  missiles.forEach(m => {
    const rootId = m.RootMissileDesignId || m.MissileDesignId;
    if (!groupsMap[rootId]) {
      groupsMap[rootId] = {
        rootId: rootId,
        levels: []
      };
    }
    groupsMap[rootId].levels.push(m);
  });

  const groupedMissiles = Object.values(groupsMap).map(g => {
    g.levels.sort((a, b) => a.MissileDesignId - b.MissileDesignId);
    const topLevel = g.levels[g.levels.length - 1];
    const rootLevel = g.levels[0];
    
    // Extract base name, e.g. "Rocket Lv2" -> "Rocket"
    const baseName = (rootLevel.MissileName || '').replace(/\s+Lv\d+/i, '').trim();

    return {
      id: rootLevel.MissileDesignId,
      name: baseName || topLevel.MissileName || 'Ammunition',
      spriteId: topLevel.SpriteId,
      maxSystemDamage: topLevel.SystemDamage || 0,
      maxShieldDamage: topLevel.ShieldDamage || 0,
      maxCharacterDamage: topLevel.CharacterDamage || 0,
      levels: g.levels
    };
  });

  const filteredGroups = groupedMissiles.filter(m => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return m.levels.some(levelMissile => 
      (levelMissile.MissileName || '').toLowerCase().includes(query) || 
      String(levelMissile.MissileDesignId).includes(query)
    );
  });

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (sortColumn === 'MissileName') {
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
      key: 'MissileName',
      header: 'Missile Name',
      cell: (m) => (
        <div className="flex items-center space-x-3">
          <SpriteFrame spriteId={m.spriteId} alt={m.name} size="sm" />
          <div>
            <div className="font-bold text-slate-100">{m.name}</div>
            <div className="text-[10px] text-slate-400">{m.levels.length} Levels • Root ID: {m.id}</div>
          </div>
        </div>
      )
    },
    { key: 'SystemDamage', header: 'Max Sys Damage', cell: (m) => m.maxSystemDamage || 0 },
    { key: 'ShieldDamage', header: 'Max Shield Damage', cell: (m) => m.maxShieldDamage || 0 },
    { key: 'CharacterDamage', header: 'Max Crew Damage', cell: (m) => m.maxCharacterDamage || 0 }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Missiles & Ammunition Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">
          Catalog of Pixel Starships missiles, torpedoes, ammunition, system damage values, and costs.
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
          {sortedGroups.map(m => (
            <EntityCard
              key={m.id}
              id={m.id}
              name={m.name}
              subtitle={`${m.levels.length} Levels Available`}
              spriteId={m.spriteId}
              targetPath={`/${lang}/library/missiles/${m.id}`}
              stats={[
                { label: 'Max Sys Dmg', value: m.maxSystemDamage || 0 },
                { label: 'Max Shield', value: m.maxShieldDamage || 0 },
                { label: 'Max Crew Dmg', value: m.maxCharacterDamage || 0 }
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
          onRowClick={(m) => navigate(`/${lang}/library/missiles/${m.id}`)}
        />
      )}
    </div>
  );
}
