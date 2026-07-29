import React, { useState } from 'react';
import { Plus, Trash2, Zap, Shield, ShieldAlert, Wind } from 'lucide-react';
import { calculateDefenseMetrics } from '../utils/capacityCalculations';
import { useTranslation } from '../../../i18n/useTranslation';

export function DefenseConfigurator({
  defenses = [],
  allRooms = [],
  bonusStats = {},
  duration = null,
  onAddDefense,
  onUpdateDefense,
  onRemoveDefense
}) {
  const { t } = useTranslation();
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('');

  // Filter available defense/support room designs from normalized rooms
  const defenseRoomOptions = allRooms.filter(r => {
    const rawType = (r.type || '').toLowerCase();
    const catType = (r.category || '').toLowerCase();
    return (
      rawType.includes('shield') ||
      rawType.includes('engine') ||
      rawType.includes('cloak') ||
      rawType.includes('repair') ||
      rawType.includes('anti') ||
      rawType.includes('barrier') ||
      rawType.includes('defense') ||
      catType.includes('defense') ||
      catType.includes('support')
    );
  });

  const handleAddSelectedRoom = () => {
    if (!selectedRoomName) return;
    const room = allRooms.find(r => r.name === selectedRoomName || r.rootId === Number(selectedRoomName));
    if (!room) return;

    const levels = room.levels || [room];
    const topLevel = levels[levels.length - 1] || levels[0];
    const raw = topLevel.raw || topLevel;

    const maxPwr = topLevel.powerRequested || raw.MaxSystemPower || 3;
    const isEngineRoom = (raw.RoomType || room.type || '').toLowerCase().includes('engine');

    const defaultInit = isEngineRoom
      ? (raw.DefaultDefenceBonus > 0 ? raw.DefaultDefenceBonus / 100 : (raw.Capacity || 16.0))
      : (raw.Capacity || topLevel.capacity || 12);

    const defaultRegen = isEngineRoom
      ? 1
      : (raw.ManufactureRate > 0 ? raw.ManufactureRate : 1);

    const newDefense = {
      id: `d-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      roomId: room.rootId || room.id,
      roomName: room.name,
      type: raw.RoomType || room.type || 'Shield',
      level: topLevel.level || levels.length || 1,
      assignedPower: maxPwr,
      maxPower: maxPwr,
      count: 1,
      bonusStat: 0,
      haste: 0,
      initValue: defaultInit,
      regenValue: defaultRegen,
      capacity: raw.Capacity || topLevel.capacity || 12,
      baseStats: {
        ReloadTime: raw.ReloadTime || topLevel.cooldown || 280,
        Capacity: raw.Capacity || topLevel.capacity || 12,
        DefaultDefenceBonus: raw.DefaultDefenceBonus || 0,
        ManufactureRate: raw.ManufactureRate || 0,
        RoomType: raw.RoomType || room.type
      }
    };

    onAddDefense(newDefense);
    setSelectedRoomName('');
    setShowRoomPicker(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg backdrop-blur-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-sky-950/80 text-sky-400 border border-sky-800/40">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              {t('pages.capacity.defenseRoomsTitle')}
            </h3>
            <p className="text-[11px] text-slate-400">
              {t('pages.capacity.defenseRoomsDescription')}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRoomPicker(!showRoomPicker)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-all shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t('pages.capacity.addDefense')}</span>
        </button>
      </div>

      {/* Room Picker Drawer */}
      {showRoomPicker && (
        <div className="bg-slate-950/90 border border-sky-900/50 p-3 rounded-lg space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300">{t('pages.capacity.selectDefense')}</span>
            <button onClick={() => setShowRoomPicker(false)} className="text-xs text-slate-400 hover:text-white">{t('pages.capacity.close')}</button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRoomName}
              onChange={(e) => setSelectedRoomName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-sans"
            >
              <option value="">{t('pages.capacity.chooseDefense')}</option>
              {defenseRoomOptions.map(r => (
                <option key={r.name} value={r.name}>
                  {r.name} ({r.type || 'Defense'})
                </option>
              ))}
            </select>

            <button
              disabled={!selectedRoomName}
              onClick={handleAddSelectedRoom}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-xs font-bold text-white rounded-lg transition-all"
            >
              {t('pages.capacity.addRoom')}
            </button>
          </div>
        </div>
      )}

      {/* Defenses Table */}
      {defenses.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
          {t('pages.capacity.noDefenses')}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 scrollbar-thin">
          <table className="w-full text-left text-xs font-mono border-collapse whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
              <tr>
                <th className="p-3 min-w-[160px]">{t('pages.capacity.roomDesign')}</th>
                <th className="p-3 w-20">{t('pages.capacity.level')}</th>
                <th className="p-3 min-w-[130px]">{t('pages.capacity.power')}</th>
                <th className="p-3 w-14">{t('pages.capacity.quantity')}</th>
                <th className="p-3 w-24 text-sky-400">{t('pages.capacity.initialValue')}</th>
                <th className="p-3 w-24 text-amber-400">{t('pages.capacity.regenCycle')}</th>
                <th className="p-3 w-20 text-sky-400">{t('pages.capacity.statBonus')}</th>
                <th className="p-3 w-20 text-amber-400">{t('pages.capacity.hastePercent')}</th>
                <th className="p-3 min-w-[160px]">{t('pages.capacity.defensiveOutput')}</th>
                <th className="p-3 text-right w-12">{t('pages.capacity.deleteShort')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {defenses.map((d, idx) => {
                const metrics = calculateDefenseMetrics(d, bonusStats, duration);
                const matchedRoom = allRooms.find(r => r.name === d.roomName) || allRooms.find(r => r.rootId === d.roomId) || allRooms[0];
                const rawLevels = matchedRoom?.levels || [];

                // Deduplicate levels numerically
                const uniqueLevelsMap = new Map();
                rawLevels.forEach(l => {
                  if (l.level && !uniqueLevelsMap.has(l.level)) {
                    uniqueLevelsMap.set(l.level, l);
                  }
                });
                const uniqueLevels = Array.from(uniqueLevelsMap.values()).sort((a, b) => a.level - b.level);

                const isShield = d.type?.toLowerCase().includes('shield') || d.baseStats?.RoomType === 'Shield';
                const isEngine = d.type?.toLowerCase().includes('engine') || d.baseStats?.RoomType === 'Engine';

                return (
                  <tr key={d.id || idx} className="hover:bg-slate-900/60 transition-colors">
                    {/* Room Design */}
                    <td className="p-3 font-sans">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0">
                          {isShield ? (
                            <ShieldAlert className="h-3.5 w-3.5 text-sky-400" />
                          ) : isEngine ? (
                            <Wind className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </div>
                        <div className="font-bold text-xs text-slate-100 truncate max-w-[140px]" title={d.roomName}>
                          {d.roomName}
                        </div>
                      </div>
                    </td>

                    {/* Level Selector */}
                    <td className="p-3">
                      {uniqueLevels.length > 0 ? (
                        <select
                          value={d.level}
                          onChange={(e) => {
                            const newLv = Number(e.target.value);
                            const targetLvlData = uniqueLevels.find(l => l.level === newLv) || uniqueLevels[0];
                            const raw = targetLvlData.raw || targetLvlData;
                            const isEng = (raw.RoomType || d.type || '').toLowerCase().includes('engine');

                            const apiInit = isEng
                              ? (raw.DefaultDefenceBonus > 0 ? raw.DefaultDefenceBonus / 100 : (raw.Capacity || 16.0))
                              : (raw.Capacity || targetLvlData.capacity || 12);

                            const apiRegen = isEng ? 1 : (raw.ManufactureRate > 0 ? raw.ManufactureRate : 1);

                            onUpdateDefense(d.id, {
                              level: newLv,
                              maxPower: targetLvlData.powerRequested || raw.MaxSystemPower || 3,
                              assignedPower: Math.min(d.assignedPower, targetLvlData.powerRequested || raw.MaxSystemPower || 3),
                              capacity: raw.Capacity || targetLvlData.capacity || 12,
                              initValue: apiInit,
                              regenValue: apiRegen,
                              baseStats: {
                                ...d.baseStats,
                                ReloadTime: raw.ReloadTime || targetLvlData.cooldown || 280,
                                Capacity: raw.Capacity || targetLvlData.capacity || 12,
                                DefaultDefenceBonus: raw.DefaultDefenceBonus || 0,
                                ManufactureRate: raw.ManufactureRate || 0
                              }
                            });
                          }}
                          className="bg-slate-900 border border-slate-700 text-sky-300 font-bold rounded px-1.5 py-1 text-xs focus:outline-none focus:border-sky-500 font-mono"
                        >
                          {uniqueLevels.map(l => (
                            <option key={l.level} value={l.level}>Lv {l.level}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs font-bold text-sky-300 font-mono">Lv {d.level}</span>
                      )}
                    </td>

                    {/* Power */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <Zap className={`h-3.5 w-3.5 ${d.assignedPower > 0 ? 'text-amber-400 fill-amber-400/20' : 'text-slate-600'}`} />
                        <span className="text-slate-300 font-mono text-[10px] min-w-[36px]">{d.assignedPower}/{d.maxPower}</span>
                        <input
                          type="range"
                          min="0"
                          max={d.maxPower}
                          value={d.assignedPower}
                          onChange={(e) => onUpdateDefense(d.id, { assignedPower: Number(e.target.value) })}
                          className="w-16 accent-sky-500 cursor-pointer"
                        />
                      </div>
                    </td>

                    {/* Qty */}
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={d.count}
                        onChange={(e) => onUpdateDefense(d.id, { count: Math.max(1, Number(e.target.value)) })}
                        className="w-10 bg-slate-900 border border-slate-700 text-slate-200 text-center rounded py-0.5 text-xs focus:outline-none font-mono"
                      />
                    </td>

                    {/* Initial Value Input */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1 font-mono text-xs">
                        <input
                          type="number"
                          step="0.1"
                          placeholder={isShield ? '12' : '4.0'}
                          value={d.initValue ?? ''}
                          onChange={(e) => onUpdateDefense(d.id, { initValue: e.target.value })}
                          className="w-14 bg-slate-950 border border-sky-600/60 text-sky-300 font-bold rounded px-1 py-0.5 text-center focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400">{isShield ? 'HP' : '%'}</span>
                      </div>
                    </td>

                    {/* Regen Value per Cycle Input */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1 font-mono text-xs">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="1"
                          value={d.regenValue ?? ''}
                          onChange={(e) => onUpdateDefense(d.id, { regenValue: e.target.value })}
                          className="w-14 bg-slate-950 border border-amber-600/60 text-amber-300 font-bold rounded px-1 py-0.5 text-center focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-400">{isShield ? 'HP' : '%'}</span>
                      </div>
                    </td>

                    {/* Room Stat Bonus % */}
                    <td className="p-3">
                      <input
                        type="number"
                        placeholder="0%"
                        value={d.bonusStat || ''}
                        onChange={(e) => onUpdateDefense(d.id, { bonusStat: Number(e.target.value) })}
                        className="w-16 bg-slate-950 border border-slate-700 text-sky-400 font-bold rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-sky-500 font-mono"
                      />
                    </td>

                    {/* Room Haste Boost % */}
                    <td className="p-3">
                      <input
                        type="number"
                        placeholder="0%"
                        value={d.haste || ''}
                        onChange={(e) => onUpdateDefense(d.id, { haste: Number(e.target.value) })}
                        className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </td>

                    {/* Defensive Capacity Output */}
                    <td className="p-3 font-mono text-xs">
                      {isShield ? (
                        <div>
                          <div className="font-bold text-sky-400">+{metrics.shieldGenRate.toFixed(2)} HP/s</div>
                          <div className="text-[10px] text-slate-400">
                            ({metrics.initialShieldCap} init + {metrics.generatedShield} gen) / {duration || 10}s
                          </div>
                        </div>
                      ) : isEngine ? (
                        <div>
                          <div className="font-bold text-emerald-400">+{metrics.evasionContribution.toFixed(1)}% Evasion</div>
                          <div className="text-[10px] text-slate-400">Init Evasion: {metrics.initialEvasion.toFixed(1)}%</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">{metrics.isPowered ? 'ACTIVE' : 'OFF'}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onRemoveDefense(d.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                        title={t('pages.capacity.removeDefense')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
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
