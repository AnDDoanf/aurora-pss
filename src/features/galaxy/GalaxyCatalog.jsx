import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';

export function GalaxyCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('StarSystemName');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetch('/data/active/galaxy.json')
      .then(res => res.json())
      .then(data => {
        setSystems(data.starSystems || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load galaxy.json:', err);
        setLoading(false);
      });
  }, []);

  const filteredSystems = systems.filter(s => {
    return !search.trim() || 
      (s.StarSystemName || '').toLowerCase().includes(search.toLowerCase()) || 
      String(s.StarSystemId).includes(search);
  });

  const sortedSystems = [...filteredSystems].sort((a, b) => {
    let valA = a[sortColumn] ?? '';
    let valB = b[sortColumn] ?? '';
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const columns = [
    {
      key: 'StarSystemName',
      header: 'Star System',
      cell: (s) => (
        <div>
          <div className="font-bold text-slate-100">{s.StarSystemName || 'Star System'}</div>
          <div className="text-[10px] text-slate-400">ID: {s.StarSystemId}</div>
        </div>
      )
    },
    { key: 'SystemType', header: 'Type', cell: (s) => s.SystemType || 'Normal' },
    { key: 'Level', header: 'System Level', cell: (s) => s.Level || 1 }
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.galaxyCatalog.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.galaxyCatalog.description')}</p>
        </div>
      </div>

      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        rarities={null}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => setSearch('')}
        totalResults={sortedSystems.length}
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedSystems.map(s => (
            <EntityCard
              key={s.StarSystemId}
              id={s.StarSystemId}
              name={s.StarSystemName || 'Star System'}
              subtitle={s.SystemType || 'Sector'}
              targetPath={`/${lang}/library/galaxy/${s.StarSystemId}`}
              stats={[
                { label: 'System ID', value: s.StarSystemId },
                { label: 'Level', value: s.Level || 1 }
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedSystems}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            if (sortColumn === col) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
            else { setSortColumn(col); setSortDirection('asc'); }
          }}
          onRowClick={(s) => navigate(`/${lang}/library/galaxy/${s.StarSystemId}`)}
        />
      )}
    </div>
  );
}
