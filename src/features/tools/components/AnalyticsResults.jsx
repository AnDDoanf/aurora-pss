import React from 'react';
import { BarChart3, Shield, Zap, Users, Crosshair, HeartPulse, Flame, Target, Sparkles, Layers } from 'lucide-react';
import { calculateSnapshotTotals, calculateTimelineSummary, calculateWeaponMetrics, calculateDefenseMetrics } from '../utils/capacityCalculations';
import { useTranslation } from '../../../i18n/useTranslation';

export function AnalyticsResults({ snapshots = [], activeSnapshotId }) {
  const { t } = useTranslation();
  const activeSnapshot = snapshots.find(s => s.id === activeSnapshotId) || snapshots[0];
  const activeTotals = activeSnapshot ? calculateSnapshotTotals(activeSnapshot) : null;
  const timelineSummary = calculateTimelineSummary(snapshots);

  if (!activeSnapshot || !activeTotals) return null;

  const isInfinite = activeSnapshot.duration === null || activeSnapshot.duration === undefined || activeSnapshot.duration === '';
  const evalDuration = activeTotals.duration || 10;

  return (
    <div className="space-y-6">
      {/* Active Snapshot Metrics Overview */}
      <div className="bg-slate-900/90 rounded-xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/20 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-indigo-950/80 text-indigo-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider flex items-center space-x-2">
                <span>{t('pages.capacity.analyticsTitle', { name: activeSnapshot.name })}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono">
                  {isInfinite ? t('pages.capacity.infiniteDuration') : `${evalDuration}s`}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('pages.capacity.analyticsDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* 7 Key Analytics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* System DPS */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>{t('pages.capacity.systemDps')}</span>
            </div>
            <div className="text-lg font-black text-slate-100 font-mono">
              {activeTotals.systemDmgRate.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {t('pages.capacity.total', { value: activeTotals.accumSystemDmg.toFixed(1) })}
            </div>
          </div>

          {/* Shield DPS */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>{t('pages.capacity.shieldDps')}</span>
            </div>
            <div className="text-lg font-black text-slate-100 font-mono">
              {activeTotals.shieldDmgRate.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {t('pages.capacity.total', { value: activeTotals.accumShieldDmg.toFixed(1) })}
            </div>
          </div>

          {/* Crew DPS */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{t('pages.capacity.crewDps')}</span>
            </div>
            <div className="text-lg font-black text-slate-100 font-mono">
              {activeTotals.crewDmgRate.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {t('pages.capacity.total', { value: activeTotals.accumCrewDmg.toFixed(1) })}
            </div>
          </div>

          {/* Hull DPS */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
              <Flame className="h-3 w-3" />
              <span>{t('pages.capacity.hullDps')}</span>
            </div>
            <div className="text-lg font-black text-slate-100 font-mono">
              {activeTotals.hullDmgRate.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {t('pages.capacity.total', { value: activeTotals.accumHullDmg.toFixed(1) })}
            </div>
          </div>

          {/* AP DPS */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
              <Crosshair className="h-3 w-3" />
              <span>{t('pages.capacity.apDps')}</span>
            </div>
            <div className="text-lg font-black text-slate-100 font-mono">
              {activeTotals.apDmgRate.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {t('pages.capacity.total', { value: activeTotals.accumApDmg.toFixed(1) })}
            </div>
          </div>

          {/* Shield Gen Rate */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>{t('pages.capacity.shieldGen')}</span>
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              +{activeTotals.shieldGenRate.toFixed(2)}/s
            </div>
            <div className="text-[10px] text-slate-400">
              {t('pages.capacity.shieldPerSecond')}
            </div>
          </div>

          {/* Evasion Generation Rate */}
          <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
            <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1">
              <HeartPulse className="h-3 w-3" />
              <span>{t('pages.capacity.evasionRate')}</span>
            </div>
            <div className="text-lg font-black text-teal-400 font-mono">
              {activeTotals.evasionContribution.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400">
              {activeTotals.rawEvasion > 75
                ? t('pages.capacity.rawRate', { value: activeTotals.rawEvasion.toFixed(1) })
                : t('pages.capacity.dodgeRate')}
            </div>
          </div>
        </div>

        {/* Individual Room Contribution Table */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            {t('pages.capacity.roomBreakdown')}
          </div>

          <div className="overflow-x-auto rounded-lg bg-slate-950/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800/20">
                <tr>
                  <th className="p-2.5">{t('pages.capacity.room')}</th>
                  <th className="p-2.5">{t('pages.capacity.powerQuantity')}</th>
                  <th className="p-2.5">{t('pages.capacity.shotsSecond')}</th>
                  <th className="p-2.5 text-orange-400">{t('pages.capacity.systemDps')}</th>
                  <th className="p-2.5 text-sky-400">{t('pages.capacity.shieldDps')}</th>
                  <th className="p-2.5 text-purple-400">{t('pages.capacity.crewDps')}</th>
                  <th className="p-2.5 text-rose-400">{t('pages.capacity.hullDps')}</th>
                  <th className="p-2.5 text-amber-400">{t('pages.capacity.apDps')}</th>
                  <th className="p-2.5 text-emerald-400">{t('pages.capacity.shieldGen')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/20 bg-slate-950/40">
                {activeSnapshot.weapons?.map((w, i) => {
                  const m = calculateWeaponMetrics(w, activeSnapshot.bonusStats, activeSnapshot.customBonuses, activeSnapshot.duration);
                  return (
                    <tr key={w.id || i} className="hover:bg-slate-900/60">
                      <td className="p-2.5 font-bold font-sans text-slate-200">
                        {w.roomName} <span className="text-[10px] text-slate-400">Lv{w.level}</span>
                        {w.applySymphony && (
                          <span className="ml-1.5 text-[9px] bg-amber-500/20 text-amber-300 font-mono px-1 rounded">
                            Symphony ({w.symphonyShots || 5}s)
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-300">
                        {w.assignedPower}/{w.maxPower}kW × {w.count}
                      </td>
                      <td className="p-2.5 text-amber-300 font-bold">
                        {m.shotsPerSec.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-orange-400">{m.systemDmgRate.toFixed(2)}</td>
                      <td className="p-2.5 text-sky-400">{m.shieldDmgRate.toFixed(2)}</td>
                      <td className="p-2.5 text-purple-400">{m.crewDmgRate.toFixed(2)}</td>
                      <td className="p-2.5 text-rose-400">{m.hullDmgRate.toFixed(2)}</td>
                      <td className="p-2.5 text-amber-400">{m.apDmgRate.toFixed(2)}</td>
                      <td className="p-2.5 text-slate-500">—</td>
                    </tr>
                  );
                })}

                {activeSnapshot.defenses?.map((d, i) => {
                  const m = calculateDefenseMetrics(d, activeSnapshot.bonusStats);
                  return (
                    <tr key={d.id || i} className="hover:bg-slate-900/60">
                      <td className="p-2.5 font-bold font-sans text-slate-200">
                        {d.roomName} <span className="text-[10px] text-slate-400">Lv{d.level}</span>
                      </td>
                      <td className="p-2.5 text-slate-300">
                        {d.assignedPower}/{d.maxPower}kW × {d.count}
                      </td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-slate-500">—</td>
                      <td className="p-2.5 text-emerald-400 font-bold">
                        {m.shieldGenRate > 0 ? `+${m.shieldGenRate.toFixed(2)} HP/s` : m.evasionContribution > 0 ? `+${m.evasionContribution.toFixed(1)}% Evasion` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Multi-Snapshot Timeline Battle Summary */}
      {snapshots.length > 1 && (
        <div className="bg-slate-900/90 rounded-xl p-5 space-y-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800/20 pb-3">
            <Layers className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                {t('pages.capacity.timelineTitle', { count: snapshots.length })}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t('pages.capacity.timelineDescription')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
              <div className="text-[10px] text-slate-400 font-sans uppercase">{t('pages.capacity.totalTimeline')}</div>
              <div className="text-lg font-bold text-slate-100">
                {timelineSummary.totalDuration > 0 ? t('pages.capacity.seconds', { value: timelineSummary.totalDuration }) : t('pages.capacity.continuous')}
                {timelineSummary.hasInfinite && <span className="text-xs text-amber-400 ml-1">{t('pages.capacity.infiniteTail')}</span>}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
              <div className="text-[10px] text-slate-400 font-sans uppercase">{t('pages.capacity.totalSystemDamage')}</div>
              <div className="text-lg font-bold text-orange-400">
                {timelineSummary.totalSystemDmg.toFixed(1)}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
              <div className="text-[10px] text-slate-400 font-sans uppercase">{t('pages.capacity.totalHullDamage')}</div>
              <div className="text-lg font-bold text-rose-400">
                {timelineSummary.totalHullDmg.toFixed(1)}
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg space-y-1">
              <div className="text-[10px] text-slate-400 font-sans uppercase">{t('pages.capacity.weightedShield')}</div>
              <div className="text-lg font-bold text-emerald-400">
                +{timelineSummary.avgShieldGenRate.toFixed(2)} HP/s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
