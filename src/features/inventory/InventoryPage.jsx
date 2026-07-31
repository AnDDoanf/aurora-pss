import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Backpack, Search, Trash2, UserPlus } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { TRAINING_STATS, clampTrainingAllocation, getTrainingCapacity } from '../training/trainingCalculations';
import { InventoryCard } from './InventoryCard';
import { InventoryEditor } from './InventoryEditor';
import {
  calculateInventoryStats,
  createInventoryEntry,
  getCrewEquipmentSlots,
  loadInventory,
  normalizeInventoryEntry,
  saveInventory
} from './inventoryUtils';

const formatNumber = (value) => new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1
}).format(Number(value) || 0);

export function InventoryPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [crews, setCrews] = useState([]);
  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState(loadInventory);
  const [crewSearch, setCrewSearch] = useState('');
  const [selectedCrewId, setSelectedCrewId] = useState('');
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const importedQueryRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/data/active/crew.json').then((response) => response.json()),
      fetch('/data/active/items.json').then((response) => response.json())
    ]).then(([crewData, itemData]) => {
      if (cancelled) return;
      setCrews(crewData);
      setItems(itemData.filter((item) => (
        item.itemType === 'Equipment' && item.itemSubType !== 'Module'
      )));
      const crewById = new Map(crewData.map((crew) => [String(crew.id), crew]));
      setEntries((current) => current
        .filter((entry) => crewById.has(String(entry.crewId)))
        .map((entry) => normalizeInventoryEntry(entry, crewById.get(String(entry.crewId)))));
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    saveInventory(entries);
  }, [entries]);

  const crewById = useMemo(
    () => new Map(crews.map((crew) => [String(crew.id), crew])),
    [crews]
  );
  const itemById = useMemo(
    () => new Map(items.map((item) => [String(item.id), item])),
    [items]
  );
  const itemsBySubtype = useMemo(() => {
    const grouped = new Map();
    for (const item of items) {
      const group = grouped.get(item.itemSubType) || [];
      group.push(item);
      grouped.set(item.itemSubType, group);
    }
    for (const group of grouped.values()) {
      group.sort((a, b) => a.name.localeCompare(b.name) || Number(b.rank) - Number(a.rank));
    }
    return grouped;
  }, [items]);

  useEffect(() => {
    if (loading || importedQueryRef.current) return;
    const importedIds = (searchParams.get('ids') || '').split(',').filter((id) => crewById.has(id));
    if (importedIds.length > 0) {
      setEntries((current) => [...current, ...importedIds.map(createInventoryEntry)]);
    }
    importedQueryRef.current = true;
    if (searchParams.has('ids')) setSearchParams({}, { replace: true });
  }, [crewById, loading, searchParams, setSearchParams]);

  const filteredCrews = useMemo(() => {
    const query = crewSearch.trim().toLowerCase();
    return crews
      .filter((crew) => !query || crew.name.toLowerCase().includes(query) || String(crew.id).includes(query))
      .slice(0, 100);
  }, [crewSearch, crews]);

  useEffect(() => {
    if (!selectedCrewId || !filteredCrews.some((crew) => String(crew.id) === selectedCrewId)) {
      setSelectedCrewId(filteredCrews[0] ? String(filteredCrews[0].id) : '');
    }
  }, [filteredCrews, selectedCrewId]);

  useEffect(() => {
    if (!activeEntryId) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveEntryId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEntryId]);

  const updateEntry = (instanceId, updater) => {
    setEntries((current) => current.map((entry) => (
      entry.instanceId === instanceId ? updater(entry) : entry
    )));
  };

  const addCrew = () => {
    if (!selectedCrewId) return;
    setEntries((current) => [...current, createInventoryEntry(selectedCrewId)]);
  };

  const duplicateCrew = (source) => {
    const duplicate = createInventoryEntry(source.crewId);
    duplicate.nickname = source.nickname;
    duplicate.crisprCount = source.crisprCount;
    duplicate.training = { ...source.training };
    duplicate.equipment = { ...source.equipment };
    duplicate.secondaryStats = Object.fromEntries(
      Object.entries(source.secondaryStats || {}).map(([slot, bonus]) => [slot, { ...bonus }])
    );
    setEntries((current) => [...current, duplicate]);
  };

  const removeCrew = (instanceId) => {
    setEntries((current) => current.filter((entry) => entry.instanceId !== instanceId));
    if (activeEntryId === instanceId) setActiveEntryId(null);
  };

  const updateTraining = (entry, statKey, nextValue) => {
    const crew = crewById.get(String(entry.crewId));
    const capacity = getTrainingCapacity(crew, entry.crisprCount);
    const otherSpent = TRAINING_STATS.reduce((sum, stat) => (
      stat.key === statKey ? sum : sum + (Number(entry.training?.[stat.key]) || 0)
    ), 0);
    const value = Math.min(Math.max(Math.round(Number(nextValue) || 0), 0), Math.max(capacity - otherSpent, 0));
    updateEntry(entry.instanceId, (current) => ({
      ...current,
      training: { ...current.training, [statKey]: value }
    }));
  };

  const updateCrisprCount = (entry, nextCount) => {
    const crew = crewById.get(String(entry.crewId));
    const crisprCount = Math.min(Math.max(Math.trunc(Number(nextCount) || 0), 0), 2);
    const capacity = getTrainingCapacity(crew, crisprCount);
    updateEntry(entry.instanceId, (current) => ({
      ...current,
      crisprCount,
      training: clampTrainingAllocation(current.training, capacity)
    }));
  };

  const activeEntry = entries.find((entry) => entry.instanceId === activeEntryId);
  const activeCrew = activeEntry ? crewById.get(String(activeEntry.crewId)) : null;
  const activeCapacity = activeCrew ? getTrainingCapacity(activeCrew, activeEntry.crisprCount) : 0;
  const activeSpent = activeEntry
    ? TRAINING_STATS.reduce((sum, stat) => sum + (Number(activeEntry.training?.[stat.key]) || 0), 0)
    : 0;

  if (loading) {
    return <div className="p-12 text-center font-mono text-xs text-slate-400">{t('pages.inventory.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pages.inventory.title')}</h1>
          <p className="mt-1 text-xs text-slate-400">{t('pages.inventory.description')}</p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(t('pages.inventory.clearConfirm'))) {
                setEntries([]);
                setActiveEntryId(null);
              }
            }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-rose-950/60 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-900"
          >
            <Trash2 className="h-4 w-4" />
            {t('pages.inventory.clear')}
          </button>
        )}
      </div>

      <section className="rounded-lg bg-slate-900 p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-100">
          <UserPlus className="h-4 w-4 text-indigo-400" />
          {t('pages.inventory.addCrew')}
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(180px,0.8fr)_minmax(220px,1.2fr)_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={crewSearch}
              onChange={(event) => setCrewSearch(event.target.value)}
              placeholder={t('pages.inventory.searchCrew')}
              className="w-full rounded-lg bg-slate-950 py-2.5 pl-9 pr-3 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </label>
          <select
            value={selectedCrewId}
            onChange={(event) => setSelectedCrewId(event.target.value)}
            className="w-full rounded-lg bg-slate-950 px-3 py-2.5 text-xs font-bold text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {filteredCrews.map((crew) => (
              <option key={crew.id} value={crew.id}>{crew.name} · #{crew.id} · {crew.rarity}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addCrew}
            disabled={!selectedCrewId}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-black text-white transition hover:bg-indigo-500 disabled:opacity-40"
          >
            <UserPlus className="h-4 w-4" />
            {t('pages.inventory.add')}
          </button>
        </div>
      </section>

      {entries.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 px-6 py-16 text-center">
          <Backpack className="mx-auto h-10 w-10 text-slate-600" />
          <p className="mt-3 text-sm font-bold text-slate-300">{t('pages.inventory.empty')}</p>
          <p className="mt-1 text-xs text-slate-500">{t('pages.inventory.emptyHint')}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {entries.map((entry, index) => {
            const crew = crewById.get(String(entry.crewId));
            if (!crew) return null;
            const capacity = getTrainingCapacity(crew, entry.crisprCount);
            const spent = TRAINING_STATS.reduce((sum, stat) => sum + (Number(entry.training?.[stat.key]) || 0), 0);
            return (
              <InventoryCard
                key={entry.instanceId}
                entry={entry}
                crew={crew}
                copyNumber={index + 1}
                slots={getCrewEquipmentSlots(crew)}
                stats={calculateInventoryStats(crew, entry, itemById).stats}
                spent={spent}
                capacity={capacity}
                itemById={itemById}
                formatNumber={formatNumber}
                t={t}
                onOpen={() => setActiveEntryId(entry.instanceId)}
                onDuplicate={() => duplicateCrew(entry)}
                onRemove={() => removeCrew(entry.instanceId)}
              />
            );
          })}
        </div>
      )}

      <InventoryEditor
        entry={activeEntry}
        crew={activeCrew}
        capacity={activeCapacity}
        spent={activeSpent}
        slots={activeCrew ? getCrewEquipmentSlots(activeCrew) : []}
        statResult={activeCrew
          ? calculateInventoryStats(activeCrew, activeEntry, itemById)
          : { stats: [], extraBonuses: [] }}
        itemsBySubtype={itemsBySubtype}
        itemById={itemById}
        formatNumber={formatNumber}
        t={t}
        onClose={() => setActiveEntryId(null)}
        onUpdate={(updater) => updateEntry(activeEntry.instanceId, updater)}
        onUpdateCrispr={(value) => updateCrisprCount(activeEntry, value)}
        onUpdateTraining={(statKey, value) => updateTraining(activeEntry, statKey, value)}
      />
    </div>
  );
}

export default InventoryPage;
