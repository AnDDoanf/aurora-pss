import React, { useState } from 'react';
import { Plus, Trash2, Zap, Sword, Crosshair, Sparkles, Package } from 'lucide-react';
import { calculateWeaponMetrics } from '../utils/capacityCalculations';

export function WeaponConfigurator({
  weapons = [],
  allRooms = [],
  allMissiles = [],
  allCrafts = [],
  bonusStats = {},
  customBonuses = [],
  duration = null,
  onAddWeapon,
  onUpdateWeapon,
  onRemoveWeapon
}) {
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('');

  // Filter available weapon room designs from normalized rooms
  const weaponRoomOptions = allRooms.filter(r => {
    const rawType = (r.type || '').toLowerCase();
    const catType = (r.category || '').toLowerCase();
    return (
      rawType.includes('laser') ||
      rawType.includes('cannon') ||
      rawType.includes('missile') ||
      rawType.includes('hangar') ||
      rawType.includes('super') ||
      rawType.includes('emp') ||
      rawType.includes('photon') ||
      rawType.includes('torpedo') ||
      rawType.includes('plasma') ||
      rawType.includes('rail') ||
      rawType.includes('ion') ||
      rawType.includes('droid') ||
      rawType.includes('weapon') ||
      catType.includes('weapon') ||
      catType.includes('offense')
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

    const newWeapon = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      roomId: room.rootId || room.id,
      roomName: room.name,
      level: topLevel.level || levels.length || 1,
      assignedPower: maxPwr,
      maxPower: maxPwr,
      count: 1,
      craftCount: 1,
      bonusStat: 0,
      haste: 0,
      applySymphony: false,
      symphonyShots: 5,
      symphonyBoost: 25,
      baseStats: {
        ReloadTime: raw.ReloadTime || topLevel.cooldown || 120,
        CooldownTime: raw.CooldownTime || 0,
        ActivationDelay: raw.ActivationDelay || 0,
        Volley: raw.MissileDesign?.Volley || raw.Volley || 1,
        VolleyDelay: raw.VolleyDelay || raw.MissileDesign?.VolleyDelay || 0,
        SystemDamage: raw.MissileDesign?.SystemDamage || 0,
        ShieldDamage: raw.MissileDesign?.ShieldDamage || 0,
        CharacterDamage: raw.MissileDesign?.CharacterDamage || 0,
        HullDamage: raw.MissileDesign?.HullDamage || 0,
        DirectSystemDamage: raw.MissileDesign?.DirectSystemDamage || 0,
        RoomType: raw.RoomType || room.type
      },
      selectedAmmo: null,
      selectedCraft: null
    };

    onAddWeapon(newWeapon);
    setSelectedRoomName('');
    setShowRoomPicker(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg backdrop-blur-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-rose-950/80 text-rose-400 border border-rose-800/40">
            <Sword className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              Weapon Rooms (Offensive Capacity)
            </h3>
            <p className="text-[11px] text-slate-400">
              Each weapon room is a row. Select room design and decide room level directly in the row.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowRoomPicker(!showRoomPicker)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Weapon Room</span>
        </button>
      </div>

      {/* Room Picker Drawer */}
      {showRoomPicker && (
        <div className="bg-slate-950/90 border border-indigo-900/50 p-3 rounded-lg space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300">Select Weapon Room Design</span>
            <button onClick={() => setShowRoomPicker(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedRoomName}
              onChange={(e) => setSelectedRoomName(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
            >
              <option value="">-- Choose Weapon Room Design --</option>
              {weaponRoomOptions.map(r => (
                <option key={r.name} value={r.name}>
                  {r.name} ({r.type || 'Weapon'})
                </option>
              ))}
            </select>

            <button
              disabled={!selectedRoomName}
              onClick={handleAddSelectedRoom}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white rounded-lg transition-all"
            >
              Add Room
            </button>
          </div>
        </div>
      )}

      {/* Weapons Table - Each Room a Row */}
      {weapons.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
          No weapon rooms configured yet. Click <strong>Add Weapon Room</strong> to add cannons, lasers, missiles, or hangars.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 scrollbar-thin">
          <table className="w-full text-left text-xs font-mono border-collapse whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
              <tr>
                <th className="p-3 min-w-[170px]">Room Design</th>
                <th className="p-3 w-20">Level</th>
                <th className="p-3 min-w-[130px]">Power (kW)</th>
                <th className="p-3 w-14">Qty</th>
                <th className="p-3 w-20 text-rose-400">Weapon %</th>
                <th className="p-3 w-20 text-amber-400">Haste %</th>
                <th className="p-3 min-w-[180px]">Ammo / Craft Selection</th>
                <th className="p-3 min-w-[140px]">Apply Symphony</th>
                <th className="p-3 min-w-[140px]">API Base Stats</th>
                <th className="p-3 min-w-[100px]">Shots / sec</th>
                <th className="p-3 text-right w-12">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {weapons.map((w, idx) => {
                const metrics = calculateWeaponMetrics(w, bonusStats, customBonuses, duration);
                const matchedRoom = allRooms.find(r => r.name === w.roomName) || allRooms.find(r => r.rootId === w.roomId) || allRooms[0];
                const rawLevels = matchedRoom?.levels || [];

                // Deduplicate levels numerically
                const uniqueLevelsMap = new Map();
                rawLevels.forEach(l => {
                  if (l.level && !uniqueLevelsMap.has(l.level)) {
                    uniqueLevelsMap.set(l.level, l);
                  }
                });
                const uniqueLevels = Array.from(uniqueLevelsMap.values()).sort((a, b) => a.level - b.level);

                const roomTypeLower = (w.baseStats?.RoomType || w.roomName || '').toLowerCase();
                const isHangar = roomTypeLower.includes('hangar') || roomTypeLower.includes('carrier');

                return (
                  <tr key={w.id || idx} className="hover:bg-slate-900/60 transition-colors">
                    {/* Room Design (Clean Name) */}
                    <td className="p-3 font-sans">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center border border-slate-800 shrink-0 relative">
                          <Crosshair className="h-3.5 w-3.5 text-rose-400" />
                          {w.applySymphony && (
                            <Sparkles className="h-2.5 w-2.5 text-amber-400 absolute -top-1 -right-1" />
                          )}
                        </div>
                        <div className="font-bold text-xs text-slate-100 truncate max-w-[150px]" title={w.roomName}>
                          {w.roomName}
                        </div>
                      </div>
                    </td>

                    {/* Room Level Selector */}
                    <td className="p-3">
                      {uniqueLevels.length > 0 ? (
                        <select
                          value={w.level}
                          onChange={(e) => {
                            const newLv = Number(e.target.value);
                            const targetLvlData = uniqueLevels.find(l => l.level === newLv) || uniqueLevels[0];
                            const raw = targetLvlData.raw || targetLvlData;
                            onUpdateWeapon(w.id, {
                              level: newLv,
                              maxPower: targetLvlData.powerRequested || raw.MaxSystemPower || 3,
                              assignedPower: Math.min(w.assignedPower, targetLvlData.powerRequested || raw.MaxSystemPower || 3),
                              baseStats: {
                                ...w.baseStats,
                                ReloadTime: raw.ReloadTime || targetLvlData.cooldown || 120,
                                CooldownTime: raw.CooldownTime || targetLvlData.CooldownTime || 0,
                                ActivationDelay: raw.ActivationDelay || targetLvlData.ActivationDelay || 0,
                                Volley: raw.MissileDesign?.Volley || raw.Volley || 1,
                                VolleyDelay: raw.VolleyDelay || targetLvlData.VolleyDelay || raw.MissileDesign?.VolleyDelay || 0,
                                SystemDamage: raw.MissileDesign?.SystemDamage || 0,
                                ShieldDamage: raw.MissileDesign?.ShieldDamage || 0,
                                CharacterDamage: raw.MissileDesign?.CharacterDamage || 0,
                                HullDamage: raw.MissileDesign?.HullDamage || 0,
                                DirectSystemDamage: raw.MissileDesign?.DirectSystemDamage || 0,
                              }
                            });
                          }}
                          className="bg-slate-900 border border-slate-700 text-indigo-300 font-bold rounded px-1.5 py-1 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                        >
                          {uniqueLevels.map(l => (
                            <option key={l.level} value={l.level}>Lv {l.level}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-xs font-bold text-indigo-300 font-mono">Lv {w.level}</span>
                      )}
                    </td>

                    {/* Power Allocation Slider */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5 text-xs">
                        <Zap className={`h-3.5 w-3.5 ${w.assignedPower > 0 ? 'text-amber-400 fill-amber-400/20' : 'text-slate-600'}`} />
                        <span className="text-slate-300 text-[10px] min-w-[36px]">{w.assignedPower}/{w.maxPower}</span>
                        <input
                          type="range"
                          min="0"
                          max={w.maxPower}
                          value={w.assignedPower}
                          onChange={(e) => onUpdateWeapon(w.id, { assignedPower: Number(e.target.value) })}
                          className="w-16 accent-indigo-500 cursor-pointer"
                        />
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={w.count}
                        onChange={(e) => onUpdateWeapon(w.id, { count: Math.max(1, Number(e.target.value)) })}
                        className="w-10 bg-slate-900 border border-slate-700 text-slate-200 text-center rounded py-0.5 text-xs focus:outline-none font-mono"
                      />
                    </td>

                    {/* Room Weapon Stat Bonus (%) */}
                    <td className="p-3">
                      <input
                        type="number"
                        placeholder="0%"
                        value={w.bonusStat || ''}
                        onChange={(e) => onUpdateWeapon(w.id, { bonusStat: Number(e.target.value) })}
                        className="w-16 bg-slate-950 border border-slate-700 text-rose-400 font-bold rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-rose-500 font-mono"
                      />
                    </td>

                    {/* Room Haste Boost (%) */}
                    <td className="p-3">
                      <input
                        type="number"
                        placeholder="0%"
                        value={w.haste || ''}
                        onChange={(e) => onUpdateWeapon(w.id, { haste: Number(e.target.value) })}
                        className="w-16 bg-slate-950 border border-slate-700 text-amber-400 font-bold rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </td>

                    {/* Ammo / Hangar Craft Selector */}
                    <td className="p-3 font-sans">
                      {isHangar ? (
                        <div className="space-y-1">
                          <select
                            value={w.selectedCraft?.CraftDesignId || ''}
                            onChange={(e) => {
                              const craft = allCrafts.find(c => c.CraftDesignId === Number(e.target.value)) || null;
                              onUpdateWeapon(w.id, { selectedCraft: craft });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded px-1.5 py-1 focus:outline-none"
                          >
                            <option value="">-- Choose Hangar Craft --</option>
                            {allCrafts.map(c => (
                              <option key={c.CraftDesignId} value={c.CraftDesignId}>
                                {c.CraftName} (Rld:{(c.Reload / 40).toFixed(1)}s)
                              </option>
                            ))}
                          </select>

                          {/* Carrier Craft Count */}
                          <div className="flex items-center space-x-1 text-[10px] font-mono">
                            <span className="text-slate-400">Craft Qty:</span>
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={w.craftCount || 1}
                              onChange={(e) => onUpdateWeapon(w.id, { craftCount: Math.max(1, Number(e.target.value)) })}
                              className="w-10 bg-slate-950 border border-slate-700 text-indigo-300 text-center rounded py-0.2 font-bold focus:outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <select
                          value={w.selectedAmmo?.MissileDesignId || ''}
                          onChange={(e) => {
                            const ammo = allMissiles.find(m => m.MissileDesignId === Number(e.target.value)) || null;
                            onUpdateWeapon(w.id, { selectedAmmo: ammo });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded px-1.5 py-1 focus:outline-none max-w-[190px] truncate"
                        >
                          <option value="">-- Built-in Ammo --</option>
                          {allMissiles.map(m => (
                            <option key={m.MissileDesignId} value={m.MissileDesignId}>
                              {m.MissileDesignName} (Sys:{m.SystemDamage} | Shd:{m.ShieldDamage} | Hull:{m.HullDamage})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    {/* Apply Symphony (+25% power on first N shots) */}
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="checkbox"
                          id={`row-sym-${w.id}`}
                          checked={w.applySymphony || false}
                          onChange={(e) => onUpdateWeapon(w.id, { applySymphony: e.target.checked })}
                          className="h-3.5 w-3.5 accent-amber-500 rounded cursor-pointer"
                        />
                        <label htmlFor={`row-sym-${w.id}`} className="text-xs font-sans text-amber-300 font-semibold cursor-pointer">
                          Symphony
                        </label>
                        {w.applySymphony && (
                          <select
                            value={w.symphonyShots || 5}
                            onChange={(e) => onUpdateWeapon(w.id, { symphonyShots: Number(e.target.value) })}
                            className="bg-slate-900 border border-amber-500/50 text-amber-300 font-bold text-[10px] rounded px-1 py-0.5 focus:outline-none font-mono"
                          >
                            <option value="3">3 shots</option>
                            <option value="4">4 shots</option>
                            <option value="5">5 shots</option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* API Derived Base Stats */}
                    <td className="p-3">
                      <div className="text-[10px] text-slate-300 space-y-0.5 font-mono">
                        {w.baseStats?.CooldownTime >= 160 && (
                          <div className="text-amber-400 font-bold">
                            Cooldown: {(w.baseStats.CooldownTime / 40).toFixed(1)}s
                          </div>
                        )}
                        <div>
                          Rld: <span className="font-bold text-sky-400">{metrics.effectiveReloadSec ? `${metrics.effectiveReloadSec.toFixed(2)}s` : 'OFF'}</span>
                          {metrics.totalCycleSec > metrics.effectiveReloadSec && (
                            <span className="text-slate-400 text-[9px] ml-1">(Cycle:{metrics.totalCycleSec.toFixed(2)}s)</span>
                          )}
                        </div>
                        <div className="text-slate-400">
                          Volley: <span className="text-amber-300 font-bold">{metrics.volley}</span>
                          {metrics.volleyDelaySec > 0 && (
                            <span className="text-slate-400 text-[9px] ml-1">(Dly:{metrics.volleyDelaySec.toFixed(2)}s)</span>
                          )}
                        </div>
                        <div className="text-slate-400">
                          Sys:<span className="text-orange-400 font-bold">{metrics.sysDmg.toFixed(1)}</span> · Shd:<span className="text-sky-400 font-bold">{metrics.shieldDmg.toFixed(1)}</span> · Hull:<span className="text-rose-400 font-bold">{metrics.hullDmg.toFixed(1)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Shots per Second Output */}
                    <td className="p-3">
                      <div className="font-bold text-amber-400 text-xs">
                        {metrics.shotsPerSec.toFixed(2)}/s
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Sys: {(metrics.systemDmgRate).toFixed(1)}/s
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onRemoveWeapon(w.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove weapon"
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
