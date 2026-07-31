import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { EyeOff, SlidersHorizontal, Plus, Trash2 } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { getCrewHeadSpriteId } from '../../utils/crewSprites';
import { getStoredCompareIds, setStoredCompareIds } from './compareStorage';
import { useTranslation } from '../../i18n/useTranslation';

export function CompareWorkspace() {
  const { lang, type } = useParams();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideIdentical, setHideIdentical] = useState(false);
  const [highlightDiffs, setHighlightDiffs] = useState(true);

  const rawIds = searchParams.get('ids') || '';
  const queryIds = rawIds ? rawIds.split(',').filter(Boolean) : [];
  const [storedIds, setStoredIds] = useState(() => getStoredCompareIds(type));
  const entityIds = queryIds.length > 0 ? queryIds : storedIds;
  const resolvedIds = entityIds.join(',');

  useEffect(() => {
    const ids = queryIds.length > 0 ? setStoredCompareIds(type, queryIds) : getStoredCompareIds(type);
    setStoredIds(ids);
  }, [type, rawIds]);

  useEffect(() => {
    if (entityIds.length === 0) {
      setEntities([]);
      setLoading(false);
      return;
    }

    const dataFile = `/data/active/${type === 'rooms' ? 'rooms' : type}.json`;
    fetch(dataFile)
      .then(res => res.json())
      .then(data => {
        const selected = entityIds.map(idStr => {
          if (type === 'rooms') {
            return data.find(r => String(r.rootId) === idStr);
          }
          return data.find(item => String(item.id) === idStr);
        }).filter(Boolean);

        setEntities(selected);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type, resolvedIds]);

  const handleRemove = (idToRemove) => {
    const updated = entityIds.filter(id => id !== String(idToRemove));
    setStoredIds(setStoredCompareIds(type, updated));
    setSearchParams({ ids: updated.join(',') });
  };

  const getComparisonRows = () => {
    if (type === 'crew') {
      return [
        { label: 'Rarity', getVal: c => c.rarity },
        { label: 'Max HP', getVal: c => c.finalHp },
        { label: 'Max Attack', getVal: c => c.finalAttack },
        { label: 'Max Repair', getVal: c => c.finalRepair },
        { label: 'Max Pilot', getVal: c => c.finalPilot },
        { label: 'Max Weapon', getVal: c => c.finalWeapon },
        { label: 'Max Science', getVal: c => c.finalScience },
        { label: 'Special Ability', getVal: c => c.specialAbilityType || 'None' },
        { label: 'Walk Speed', getVal: c => c.walkSpeed }
      ];
    } else if (type === 'rooms') {
      return [
        { label: 'Room Type', getVal: r => r.type },
        { label: 'Category', getVal: r => r.category || 'General' },
        { label: 'Max Level', getVal: r => r.levels?.length || 1 },
        { label: 'Min Ship Level', getVal: r => r.levels?.[0]?.minShipLevel },
        { label: 'Grid Dimensions', getVal: r => `${r.levels?.[0]?.columns}x${r.levels?.[0]?.rows}` },
        { label: 'Power Req (Max)', getVal: r => `${r.levels?.[r.levels.length - 1]?.powerRequested} kW` }
      ];
    } else if (type === 'ships') {
      return [
        { label: 'Ship Level', getVal: s => s.shipLevel },
        { label: 'Hull HP', getVal: s => s.hp },
        { label: 'Grid Size', getVal: s => `${s.columns}x${s.rows}` },
        { label: 'Repair Cost', getVal: s => s.repairCost }
      ];
    } else {
      return [
        { label: 'Rarity', getVal: i => i.rarity },
        { label: 'Item Type', getVal: i => i.itemType },
        { label: 'Rank', getVal: i => i.rank },
        { label: 'Enhancement', getVal: i => i.enhancementType ? `+${i.enhancementValue}` : 'None' },
        { label: 'Fair Price', getVal: i => i.fairPrice }
      ];
    }
  };

  const rows = getComparisonRows();

  if (loading) return <div className="p-8 text-center text-slate-400">{t('pages.compare.loading')}</div>;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span className="capitalize">{t('pages.compare.title', { type })}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('pages.compare.description')}
          </p>
        </div>

        {/* Toggles */}
        <div className="grid w-full grid-cols-1 gap-2 text-xs min-[420px]:grid-cols-2 md:flex md:w-auto md:items-center">
          <button
            onClick={() => setHighlightDiffs(p => !p)}
            className={`flex min-h-10 items-center justify-center space-x-1.5 rounded-lg px-3 py-1.5 font-bold transition-colors ${
              highlightDiffs ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{t('pages.compare.highlight')}</span>
          </button>

          <button
            onClick={() => setHideIdentical(p => !p)}
            className={`flex min-h-10 items-center justify-center space-x-1.5 rounded-lg px-3 py-1.5 font-bold transition-colors ${
              hideIdentical ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span>{t('pages.compare.hideIdentical')}</span>
          </button>
        </div>
      </div>

      {entities.length === 0 ? (
        <div className="space-y-4 rounded-lg bg-slate-900 p-6 text-center shadow-sm sm:p-12">
          <p className="text-sm text-slate-400">{t('pages.compare.empty')}</p>
          <Link
            to={`/${lang}/library/${type}`}
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t('pages.compare.browse', { type })}</span>
          </Link>
        </div>
      ) : (
        /* Comparison Table */
        <div className="overflow-x-auto rounded-lg bg-slate-900 shadow-sm">
          <table className="w-full min-w-[560px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950">
                <th className="sticky left-0 z-10 w-36 bg-slate-950 p-3 text-slate-400 font-semibold sm:w-48 sm:p-4">{t('pages.compare.field')}</th>
                {entities.map(e => {
                  const name = e.name;
                  const eId = type === 'rooms' ? e.rootId : e.id;
                  const spriteId = type === 'rooms' ? e.levels?.[e.levels.length - 1]?.imageSpriteId : (e.profileSpriteId || e.imageSpriteId);

                  return (
                    <th key={eId} className="min-w-[180px] p-3 text-slate-100 font-bold sm:min-w-[200px] sm:p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <SpriteFrame
                            spriteId={spriteId}
                            fallbackSpriteId={type === 'crew' ? getCrewHeadSpriteId(e) : undefined}
                            alt={name}
                            size="md"
                          />
                          <div>
                            <div className="text-sm text-slate-100">{name}</div>
                            <div className="text-[10px] text-slate-400">#{eId}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(eId)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                          title={t('pages.compare.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/40 font-mono">
              {rows.map(row => {
                const values = entities.map(e => row.getVal(e));
                const allEqual = values.every(v => v === values[0]);

                if (hideIdentical && allEqual) return null;

                return (
                  <tr
                    key={row.label}
                    className={highlightDiffs && !allEqual ? 'bg-indigo-950/40 font-bold' : ''}
                  >
                    <td className={`sticky left-0 z-[1] p-3 font-sans font-medium text-slate-400 sm:p-4 ${
                      highlightDiffs && !allEqual ? 'bg-indigo-950' : 'bg-slate-900'
                    }`}>{row.label}</td>
                    {values.map((val, idx) => (
                      <td key={idx} className="p-4 text-slate-200">
                        {val !== undefined && val !== null ? String(val) : '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
