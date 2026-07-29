import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { CategoryBadge } from '../../components/ui/CategoryBadge';

export function ResearchCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('ResearchName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('/data/active/research.json')
      .then(res => res.json())
      .then(data => {
        setResearchList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load research.json:', err);
        setLoading(false);
      });
  }, []);

  // Grouping logic based on RootResearchDesignId
  const groupsMap = {};
  researchList.forEach(r => {
    const rootId = r.RootResearchDesignId || r.ResearchDesignId;
    if (!groupsMap[rootId]) {
      groupsMap[rootId] = {
        rootId: rootId,
        levels: []
      };
    }
    groupsMap[rootId].levels.push(r);
  });

  const groupedResearch = Object.values(groupsMap).map(g => {
    g.levels.sort((a, b) => a.ResearchDesignId - b.ResearchDesignId);
    const topLevel = g.levels[g.levels.length - 1];
    const rootLevel = g.levels[0];
    
    // Extract base name, e.g. "Rocket Lv2" -> "Rocket"
    const baseName = (rootLevel.ResearchName || '').replace(/\s+Lv\d+/i, '').trim();

    return {
      id: rootLevel.ResearchDesignId,
      name: baseName || topLevel.ResearchName || 'Research Node',
      researchType: topLevel.ResearchType || topLevel.ResearchDesignType || 'General',
      spriteId: topLevel.SpriteId || topLevel.LogoSpriteId || topLevel.ImageSpriteId,
      maxGasCost: topLevel.GasCost || 0,
      maxStarbuxCost: topLevel.StarbuxCost || 0,
      maxResearchTime: topLevel.ResearchTime || 0,
      levels: g.levels
    };
  });

  const filteredResearch = groupedResearch.filter(r => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    return r.levels.some(levelResearch => 
      (levelResearch.ResearchName || '').toLowerCase().includes(query) || 
      String(levelResearch.ResearchDesignId).includes(query)
    );
  });

  const sortedResearch = [...filteredResearch].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (sortColumn === 'ResearchName') {
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
      key: 'ResearchName',
      header: 'Research Technology',
      cell: (r) => (
        <div className="flex items-center space-x-3">
          <SpriteFrame spriteId={r.spriteId} alt={r.name} size="sm" />
          <div>
            <div className="font-bold text-slate-100">{r.name}</div>
            <div className="text-[10px] text-slate-400">{r.levels.length} Levels • Root ID: {r.id}</div>
          </div>
        </div>
      )
    },
    { key: 'ResearchType', header: 'Category', cell: (r) => <CategoryBadge category={r.researchType || 'General'} /> },
    { key: 'GasCost', header: 'Max Gas Cost', cell: (r) => `${r.maxGasCost?.toLocaleString() || 0} Gas` },
    { key: 'ResearchTime', header: 'Max Duration', cell: (r) => `${Math.round((r.maxResearchTime || 0) / 60)} min` }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.researchCatalog.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.researchCatalog.description')}</p>
        </div>
      </div>

      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        rarities={null}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => setSearch('')}
        totalResults={sortedResearch.length}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedResearch.map(r => (
            <EntityCard
              key={r.id}
              id={r.id}
              name={r.name}
              subtitle={`${r.levels.length} Levels Available`}
              spriteId={r.spriteId}
              targetPath={`/${lang}/library/research/${r.id}`}
              stats={[
                { label: 'Max Gas Cost', value: `${r.maxGasCost || 0}` },
                { label: 'Starbux', value: `${r.maxStarbuxCost || 0}` },
                { label: 'Max Duration', value: `${Math.round((r.maxResearchTime || 0) / 60)}m` }
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedResearch}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            if (sortColumn === col) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
            else { setSortColumn(col); setSortDirection('asc'); }
          }}
          onRowClick={(r) => navigate(`/${lang}/library/research/${r.id}`)}
        />
      )}
    </div>
  );
}
