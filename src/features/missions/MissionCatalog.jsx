import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { CategoryBadge } from '../../components/ui/CategoryBadge';

export function MissionCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('MissionTitle');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('/data/active/missions.json')
      .then(res => res.json())
      .then(data => {
        setMissions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load missions.json:', err);
        setLoading(false);
      });
  }, []);

  const filteredMissions = missions.filter(m => {
    return !search.trim() || 
      (m.MissionTitle || '').toLowerCase().includes(search.toLowerCase()) || 
      (m.MissionDescription || '').toLowerCase().includes(search.toLowerCase()) || 
      String(m.MissionDesignId).includes(search);
  });

  const sortedMissions = [...filteredMissions].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const columns = [
    {
      key: 'MissionTitle',
      header: 'Mission Title',
      cell: (m) => (
        <div>
          <div className="font-bold text-slate-100">{m.MissionTitle || 'Unnamed Mission'}</div>
          <div className="text-[10px] text-slate-400">ID: {m.MissionDesignId}</div>
        </div>
      )
    },
    { key: 'MissionType', header: 'Type', cell: (m) => <CategoryBadge category={m.MissionType || 'Campaign'} /> },
    { key: 'MinShipLevel', header: 'Min Ship Lv', cell: (m) => m.MinShipLevel || 1 }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.missionCatalog.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.missionCatalog.description')}</p>
        </div>
      </div>

      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        rarities={null}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => setSearch('')}
        totalResults={sortedMissions.length}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedMissions.map(m => (
            <EntityCard
              key={m.MissionDesignId}
              id={m.MissionDesignId}
              name={m.MissionTitle || 'Story Mission'}
              subtitle={m.MissionDescription}
              category={m.MissionType}
              targetPath={`/${lang}/library/missions/${m.MissionDesignId}`}
              stats={[
                { label: 'Min Ship Lv', value: m.MinShipLevel || 1 },
                { label: 'Type', value: m.MissionType || 'Campaign' }
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedMissions}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            if (sortColumn === col) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
            else { setSortColumn(col); setSortDirection('asc'); }
          }}
          onRowClick={(m) => navigate(`/${lang}/library/missions/${m.MissionDesignId}`)}
        />
      )}
    </div>
  );
}
