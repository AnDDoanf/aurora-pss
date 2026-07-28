import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { CompareTray } from '../../components/ui/CompareTray';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { RarityBadge } from '../../components/ui/RarityBadge';

export function ItemCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [comparedIds, setComparedIds] = useState([]);

  useEffect(() => {
    fetch('/data/active/items.json')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load items.json:', err);
        setLoading(false);
      });
  }, []);

  const toggleCompare = (id) => {
    setComparedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : (prev.length < 4 ? [...prev, id] : prev)
    );
  };

  const romanToNum = (roman) => {
    const map = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
    return map[roman.toLowerCase()] || 1;
  };

  // Group Android items by family name, keep other items individual
  const groupsMap = {};
  items.forEach(item => {
    if (item.itemType === 'Android') {
      const baseName = item.name.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
      if (!groupsMap[baseName]) {
        groupsMap[baseName] = {
          name: baseName,
          isAndroidGroup: true,
          levels: []
        };
      }
      groupsMap[baseName].levels.push(item);
    } else {
      groupsMap[item.id] = {
        name: item.name,
        isAndroidGroup: false,
        levels: [item]
      };
    }
  });

  const groupedItems = Object.values(groupsMap).map(g => {
    g.levels.sort((a, b) => {
      const matchA = a.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
      const matchB = b.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
      const lvlA = matchA ? romanToNum(matchA[1]) : 1;
      const lvlB = matchB ? romanToNum(matchB[1]) : 1;
      return lvlA - lvlB;
    });

    const rootLevel = g.levels[0];
    const topLevel = g.levels[g.levels.length - 1];

    return {
      id: rootLevel.id,
      name: g.isAndroidGroup ? g.name : rootLevel.name,
      itemType: rootLevel.itemType,
      itemSubType: rootLevel.itemSubType,
      rarity: topLevel.rarity,
      imageSpriteId: topLevel.imageSpriteId,
      rank: topLevel.rank,
      enhancementType: topLevel.enhancementType,
      enhancementValue: topLevel.enhancementValue,
      fairPrice: topLevel.fairPrice,
      isAndroidGroup: g.isAndroidGroup,
      levels: g.levels
    };
  });

  const filteredItems = groupedItems.filter(item => {
    const matchesSearch = !search.trim() || 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.levels.some(l => String(l.id).includes(search) || l.name.toLowerCase().includes(search.toLowerCase()));
    const matchesRarity = selectedRarity === 'All' || item.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const columns = [
    {
      key: 'name',
      header: 'Item Name',
      cell: (item) => (
        <div className="flex items-center space-x-3">
          <SpriteFrame spriteId={item.imageSpriteId} alt={item.name} size="sm" />
          <div>
            <div className="font-bold text-slate-100">{item.name}</div>
            <div className="text-[10px] text-slate-400">
              {item.isAndroidGroup ? `${item.levels.length} Grades • Root ID: ${item.id}` : `ID: ${item.id}`}
            </div>
          </div>
        </div>
      )
    },
    { key: 'rarity', header: 'Rarity', cell: (item) => <RarityBadge rarity={item.rarity} /> },
    { key: 'itemType', header: 'Type / SubType', cell: (item) => `${item.itemType || 'Item'} (${item.itemSubType || 'Default'})` },
    { key: 'enhancementValue', header: 'Enhancement', cell: (item) => item.enhancementType ? `${item.enhancementType}: +${item.enhancementValue}` : 'None' },
    { key: 'fairPrice', header: 'Fair Price', cell: (item) => <span className="font-mono text-amber-400">{item.fairPrice?.toLocaleString() || 0}</span> }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Item & Equipment Reference Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">
          Search items, equipment modules, gear, crafting ingredients, and fair market estimates.
        </p>
      </div>

      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        selectedRarity={selectedRarity}
        onRarityChange={setSelectedRarity}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => { setSearch(''); setSelectedRarity('All'); }}
        totalResults={sortedItems.length}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems.map(item => (
            <EntityCard
              key={item.id}
              id={item.id}
              name={item.name}
              subtitle={item.isAndroidGroup ? `${item.levels.length} Grades Available` : (item.itemType || 'Equipment')}
              rarity={item.rarity}
              category={item.itemSubType}
              spriteId={item.imageSpriteId}
              targetPath={`/${lang}/library/items/${item.id}`}
              isCompared={comparedIds.includes(item.id)}
              onToggleCompare={toggleCompare}
              stats={[
                { label: 'Rank', value: item.rank || 0 },
                { label: 'Enhance', value: item.enhancementType ? `+${item.enhancementValue}` : '-' },
                { label: 'Fair Price', value: item.fairPrice?.toLocaleString() || 0 }
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedItems}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            if (sortColumn === col) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
            else { setSortColumn(col); setSortDirection('asc'); }
          }}
          onRowClick={(item) => navigate(`/${lang}/library/items/${item.id}`)}
        />
      )}

      <CompareTray
        selectedIds={comparedIds}
        type="items"
        onClear={() => setComparedIds([])}
      />
    </div>
  );
}
