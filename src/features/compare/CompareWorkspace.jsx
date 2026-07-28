import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { EyeOff, SlidersHorizontal, Plus, Trash2 } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function CompareWorkspace() {
  const { lang, type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideIdentical, setHideIdentical] = useState(false);
  const [highlightDiffs, setHighlightDiffs] = useState(true);

  const rawIds = searchParams.get('ids') || '';
  const entityIds = rawIds ? rawIds.split(',').filter(Boolean) : [];

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
  }, [type, rawIds]);

  const handleRemove = (idToRemove) => {
    const updated = entityIds.filter(id => id !== String(idToRemove));
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

  if (loading) return <div className="p-8 text-center text-slate-400">Loading comparison metrics...</div>;

  return (
    <div className="space-y-6 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-100">
            <span className="capitalize">{type} Multi-Entity Comparison Workspace</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side field alignment and comparative diff analysis.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setHighlightDiffs(p => !p)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-bold ${
              highlightDiffs ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Highlight Diffs</span>
          </button>

          <button
            onClick={() => setHideIdentical(p => !p)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-bold ${
              hideIdentical ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span>Hide Identical</span>
          </button>
        </div>
      </div>

      {entities.length === 0 ? (
        <div className="rounded-lg bg-slate-900 p-12 text-center space-y-4 shadow-sm">
          <p className="text-sm text-slate-400">No entities selected for comparison.</p>
          <Link
            to={`/${lang}/library/${type}`}
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Browse {type} catalog to add entities</span>
          </Link>
        </div>
      ) : (
        /* Comparison Table */
        <div className="overflow-x-auto rounded-lg bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950">
                <th className="p-4 text-slate-400 font-semibold w-48">Spec Field</th>
                {entities.map(e => {
                  const name = e.name;
                  const eId = type === 'rooms' ? e.rootId : e.id;
                  const spriteId = type === 'rooms' ? e.levels?.[e.levels.length - 1]?.imageSpriteId : (e.profileSpriteId || e.imageSpriteId);

                  return (
                    <th key={eId} className="p-4 text-slate-100 font-bold min-w-[200px]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <SpriteFrame spriteId={spriteId} alt={name} size="md" />
                          <div>
                            <div className="text-sm text-slate-100">{name}</div>
                            <div className="text-[10px] text-slate-400">#{eId}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(eId)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                          title="Remove from comparison"
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
                    <td className="p-4 text-slate-400 font-sans font-medium">{row.label}</td>
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
