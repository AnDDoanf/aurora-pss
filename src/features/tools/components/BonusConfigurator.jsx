import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';

export function BonusConfigurator({
  bonusStats = {},
  onUpdateBonusStats
}) {
  const weaponBonus = bonusStats.weaponBonus || 0;
  const scienceBonus = bonusStats.scienceBonus || 0;
  const engineBonus = bonusStats.engineBonus || 0;
  const hasteBonus = bonusStats.hasteBonus || 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-amber-950/80 text-amber-400 border border-amber-800/40">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Total Bonus Stats
            </h3>
            <p className="text-[11px] text-slate-400">
              Apply total ship/crew stat bonuses (Weapon, Science, Engine, and Haste)
            </p>
          </div>
        </div>
      </div>

      {/* Global Stat Bonuses Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
        <div>
          <label className="text-[11px] font-semibold text-rose-400 block mb-1">
            Weapon Stat Bonus (%)
          </label>
          <input
            type="number"
            value={weaponBonus}
            onChange={(e) => onUpdateBonusStats({ ...bonusStats, weaponBonus: Number(e.target.value) })}
            placeholder="0"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-sky-400 block mb-1">
            Science Stat Bonus (%)
          </label>
          <input
            type="number"
            value={scienceBonus}
            onChange={(e) => onUpdateBonusStats({ ...bonusStats, scienceBonus: Number(e.target.value) })}
            placeholder="0"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-emerald-400 block mb-1">
            Engine Stat Bonus (%)
          </label>
          <input
            type="number"
            value={engineBonus}
            onChange={(e) => onUpdateBonusStats({ ...bonusStats, engineBonus: Number(e.target.value) })}
            placeholder="0"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-amber-400 block mb-1">
            Crew Haste Boost (%)
          </label>
          <input
            type="number"
            value={hasteBonus}
            onChange={(e) => onUpdateBonusStats({ ...bonusStats, hasteBonus: Number(e.target.value) })}
            placeholder="0"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
