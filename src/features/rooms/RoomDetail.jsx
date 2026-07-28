import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, Minus, Plus } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { CategoryBadge } from '../../components/ui/CategoryBadge';

function parsePrice(str) {
  if (!str) return null;
  const [currency, amount] = str.split(':');
  if (!amount) return null;
  return `${Number(amount).toLocaleString()} ${currency}`;
}

function formatReload(ticks) {
  if (!ticks) return null;
  return `${(ticks / 40).toFixed(1)}s`;
}

function formatTime(secs) {
  if (!secs) return '—';
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.round(secs / 60)}m`;
  if (secs < 86400) return `${(secs / 3600).toFixed(1)}h`;
  return `${(secs / 86400).toFixed(1)}d`;
}

function meaningful(val) {
  if (val === null || val === undefined) return false;
  if (val === 0 || val === '' || val === 'None') return false;
  return true;
}

function buildStatCards(raw, prevRaw, selectedCraft, allMissiles, craftCount = 1) {
  const diff = (cur, prev, unit = '') => {
    if (!cur) return null;
    const d = prev != null ? cur - prev : 0;
    return (
      <span>
        {unit ? `${cur}${unit}` : cur}
        {d > 0 && prevRaw && <span className="text-[10px] text-green-400 ml-1">(+{d}{unit})</span>}
      </span>
    );
  };

  // Weapon stats from embedded MissileDesign
  const md = raw.MissileDesign;
  const reload = raw.ReloadTime || 0;
  const reloadSec = reload > 0 ? reload / 40 : null;

  const dmgDps = (dmg, volley = 1) => {
    if (!dmg || dmg <= 0) return null;
    const total = dmg * volley;
    if (!reloadSec) return `${total}`;
    return `${total} (${(total / reloadSec).toFixed(2)}/s)`;
  };

  const weaponCards = md ? [
    md.SystemDamage > 0 && { label: 'System Dmg / DPS', value: dmgDps(md.SystemDamage, md.Volley), color: 'text-orange-400' },
    md.HullDamage > 0 && { label: 'Hull Dmg / DPS', value: dmgDps(md.HullDamage, md.Volley), color: 'text-red-400' },
    md.ShieldDamage > 0 && { label: 'Shield Dmg / DPS', value: dmgDps(md.ShieldDamage, md.Volley), color: 'text-sky-400' },
    md.CharacterDamage > 0 && { label: 'Char Dmg / DPS', value: dmgDps(md.CharacterDamage, md.Volley), color: 'text-purple-400' },
    md.CraftDamage > 0 && { label: 'Craft Dmg / DPS', value: dmgDps(md.CraftDamage, md.Volley), color: 'text-amber-400' },
    md.DirectSystemDamage > 0 && { label: 'Direct Sys Dmg', value: dmgDps(md.DirectSystemDamage, md.Volley), color: 'text-orange-400' },
    md.HullPercentageDamage > 0 && { label: 'Hull % Dmg', value: `${(md.HullPercentageDamage * 100).toFixed(1)}%`, color: 'text-red-400' },
    md.Volley > 1 && { label: 'Volley', value: md.Volley, color: 'text-slate-200' },
    reloadSec && { label: 'Reload', value: `${reloadSec.toFixed(1)}s`, color: 'text-sky-400' },
    md.StunLength > 0 && { label: 'Stun', value: `${(md.StunLength / 40).toFixed(1)}s`, color: 'text-yellow-400' },
    md.EMPLength > 0 && { label: 'EMP', value: `${(md.EMPLength / 40).toFixed(1)}s`, color: 'text-yellow-400' },
    md.FireLength > 0 && { label: 'Fire', value: `${(md.FireLength / 40).toFixed(1)}s`, color: 'text-orange-400' },
    md.BreachChance > 0 && { label: 'Breach Chance', value: `${(md.BreachChance * 100).toFixed(0)}%`, color: 'text-rose-400' },
    meaningful(md.MissileEffect) && { label: 'Effect', value: `${md.MissileEffect} (${md.MissileEffectArgument})`, color: 'text-indigo-400' },
    md.Speed > 0 && { label: 'Speed', value: md.Speed, color: 'text-slate-300' },
    md.ExplosionRadius > 0 && { label: 'Explosion Radius', value: md.ExplosionRadius, color: 'text-orange-400' },
    { label: 'Type', value: `${md.MissileType} · ${md.FlightType} · ${md.ExplosionType}`, color: 'text-slate-400' },
  ].filter(Boolean) : [];

  // Craft stats for hangar rooms
  const craftMissile = selectedCraft && allMissiles
    ? allMissiles.find(m => m.MissileDesignId === selectedCraft.MissileDesignId)
    : null;

  const craftReload100 = selectedCraft && selectedCraft.Reload ? selectedCraft.Reload / 40 : null;
  const craftReload0 = craftReload100 ? craftReload100 * 2 : null; // 50% attack speed when unpowered

  const count = Math.max(1, craftCount || 1);

  const craftDmgDps = (dmg, volley = 1) => {
    if (!dmg || dmg <= 0) return null;
    const totalSingle = dmg * volley;
    const totalCombined = totalSingle * count;
    if (!craftReload100) return `${totalCombined}`;
    const dps100 = (totalCombined / craftReload100).toFixed(2);
    const dps0 = (totalCombined / craftReload0).toFixed(2);
    if (count > 1) {
      return `${totalCombined} (${dps100}/s @100% · ${dps0}/s @0%) [${totalSingle}×${count}]`;
    }
    return `${totalCombined} (${dps100}/s @100% · ${dps0}/s @0%)`;
  };

  const craftCards = selectedCraft ? [
    { label: 'Craft Type', value: `${selectedCraft.CraftAttackType}`, color: 'text-slate-300' },
    raw.MaxSystemPower > 0 && { label: 'Max Deployment', value: `${raw.MaxSystemPower} Crafts`, color: 'text-indigo-400' },
    { label: 'Active Crafts', value: `${count} / ${raw.MaxSystemPower || count}`, color: 'text-indigo-400' },
    selectedCraft.Hp > 0 && { label: 'Craft HP (Each)', value: selectedCraft.Hp, color: 'text-green-400' },
    selectedCraft.FlightSpeed > 0 && { label: 'Flight Speed', value: selectedCraft.FlightSpeed, color: 'text-sky-400' },
    selectedCraft.Volley > 0 && { label: 'Volley (Per Craft)', value: selectedCraft.Volley, color: 'text-slate-200' },
    count > 1 && selectedCraft.Volley > 0 && { label: 'Total Volley', value: selectedCraft.Volley * count, color: 'text-slate-200' },
    craftReload100 && { label: 'Attack Reload (100% Pwr)', value: `${craftReload100.toFixed(1)}s`, color: 'text-sky-400' },
    craftReload0 && { label: 'Attack Reload (0% Pwr)', value: `${craftReload0.toFixed(1)}s (50% spd)`, color: 'text-amber-400' },
    selectedCraft.AttackRange > 0 && { label: 'Attack Range', value: selectedCraft.AttackRange, color: 'text-slate-200' },
    selectedCraft.EntityCount > 1 && { label: 'Squad Size', value: selectedCraft.EntityCount, color: 'text-indigo-400' },
    craftMissile && craftMissile.SystemDamage > 0 && { label: 'Combined Sys Dmg / DPS', value: craftDmgDps(craftMissile.SystemDamage, selectedCraft.Volley), color: 'text-orange-400' },
    craftMissile && craftMissile.HullDamage > 0 && { label: 'Combined Hull Dmg / DPS', value: craftDmgDps(craftMissile.HullDamage, selectedCraft.Volley), color: 'text-red-400' },
    craftMissile && craftMissile.ShieldDamage > 0 && { label: 'Combined Shield Dmg / DPS', value: craftDmgDps(craftMissile.ShieldDamage, selectedCraft.Volley), color: 'text-sky-400' },
    craftMissile && craftMissile.CharacterDamage > 0 && { label: 'Combined Char Dmg / DPS', value: craftDmgDps(craftMissile.CharacterDamage, selectedCraft.Volley), color: 'text-purple-400' },
  ].filter(Boolean) : [];

  return [
    ...weaponCards,
    ...craftCards,
    raw.MaxSystemPower > 0 && { label: 'Power Required', value: diff(raw.MaxSystemPower, prevRaw?.MaxSystemPower), color: 'text-amber-400' },
    raw.MaxPowerGenerated > 0 && { label: 'Power Generated', value: diff(raw.MaxPowerGenerated, prevRaw?.MaxPowerGenerated), color: 'text-green-400' },
    raw.Capacity > 0 && { label: 'Capacity', value: diff(raw.Capacity, prevRaw?.Capacity), color: 'text-indigo-400' },
    raw.ReloadTime > 0 && !md && { label: 'Reload Time', value: formatReload(raw.ReloadTime), color: 'text-sky-400' },
    raw.CooldownTime > 0 && { label: 'Cooldown', value: formatReload(raw.CooldownTime), color: 'text-sky-400' },
    raw.Range > 0 && { label: 'Range', value: raw.Range, color: 'text-slate-200' },
    raw.MinRange > 0 && { label: 'Min Range', value: raw.MinRange, color: 'text-slate-200' },
    raw.DefaultDefenceBonus > 0 && { label: 'Defence Bonus', value: diff(raw.DefaultDefenceBonus, prevRaw?.DefaultDefenceBonus, '%'), color: 'text-green-400' },
    raw.ManufactureCapacity > 0 && { label: 'Mfg Capacity', value: raw.ManufactureCapacity, color: 'text-purple-400' },
    raw.ManufactureRate > 0 && { label: 'Mfg Rate', value: raw.ManufactureRate, color: 'text-purple-400' },
    meaningful(raw.ManufactureType) && { label: 'Mfg Type', value: raw.ManufactureType, color: 'text-slate-200' },
    raw.RefillUnitCost > 0 && { label: 'Refill Unit Cost', value: raw.RefillUnitCost, color: 'text-slate-200' },
    meaningful(raw.EnhancementType) && { label: 'Enhancement', value: raw.EnhancementType, color: 'text-indigo-400' },
    meaningful(raw.TargetType) && { label: 'Target Type', value: raw.TargetType, color: 'text-slate-200' },
    raw.ActivationDelay > 0 && { label: 'Activation Delay', value: `${raw.ActivationDelay}s`, color: 'text-slate-200' },
    raw.ItemRank > 0 && { label: 'Item Rank', value: raw.ItemRank, color: 'text-slate-200' },
    raw.MaxCount > 0 && { label: 'Max Per Ship', value: raw.MaxCount, color: 'text-slate-200' },
    raw.MinShipLevel > 0 && { label: 'Min Ship Level', value: `Lv ${raw.MinShipLevel}`, color: 'text-indigo-400' },
    raw.MinStarbaseShipLevel > 1 && { label: 'Min Starbase Lv', value: `Lv ${raw.MinStarbaseShipLevel}`, color: 'text-indigo-400' },
    { label: 'Build Time', value: formatTime(raw.ConstructionTime), color: 'text-slate-300' },
    (parsePrice(raw.PriceString)) && { label: 'Price', value: parsePrice(raw.PriceString), color: 'text-amber-400' },
    (parsePrice(raw.StarbasePriceString)) && { label: 'Starbase Price', value: parsePrice(raw.StarbasePriceString), color: 'text-amber-400' },
    meaningful(raw.RefillCostString) && { label: 'Refill Cost', value: parsePrice(raw.RefillCostString) || raw.RefillCostString, color: 'text-amber-400' },
  ].filter(Boolean);
}

// Returns root missiles compatible with room
function getCompatibleMissiles(room, allMissiles) {
  const rawLvl = room.levels[0].raw || {};
  if (rawLvl.ManufactureType !== 'Missile' || rawLvl.MissileDesign) return [];

  const roomName = (room.name || '').toLowerCase();
  const roots = allMissiles.filter(m => m.RootMissileDesignId === m.MissileDesignId);

  if (roomName.includes('ion cannon')) {
    return roots.filter(m => m.MissileDesignName.toLowerCase().includes('ion'));
  }
  if (roomName.includes('torpedo')) {
    return roots.filter(m => m.MissileType === 'Rocket' && m.MissileDesignName.toLowerCase().includes('torpedo'));
  }
  if (roomName.includes('artillery')) {
    return roots.filter(m => m.MissileType === 'Rocket' && m.MissileDesignName.toLowerCase().includes('artillery'));
  }
  if (rawLvl.RoomType === 'Missile') {
    return roots.filter(m =>
      (m.MissileType === 'Rocket' || m.MissileType === 'LongDistanceMissile') &&
      !m.MissileDesignName.toLowerCase().includes('torpedo') &&
      !m.MissileDesignName.toLowerCase().includes('artillery')
    );
  }
  return [];
}

// Returns root crafts compatible with a specific carrier room based on in-game manufacturing mechanics
function getCompatibleCrafts(room, allCrafts) {
  const rawLvl = room.levels[0].raw || {};
  if (rawLvl.ManufactureType !== 'Craft') return [];

  const roomName = (room.name || '').toLowerCase();
  const shortName = (rawLvl.RoomShortName || '').toLowerCase();
  const roots = allCrafts.filter(c => c.RootCraftDesignId === c.CraftDesignId);

  if (roomName.includes('defense hangar') || shortName.startsWith('dfh')) {
    // DFH (Defense Hangar) -> Defense Support Drones
    return roots.filter(c => c.CraftPathingType === 'Defend' || c.CraftName.toLowerCase().includes('turret drone') || c.CraftName.toLowerCase().includes('repair drone') || c.CraftName.toLowerCase().includes('shield drone') || c.CraftName.toLowerCase().includes('ecm drone'));
  }
  if (roomName.includes('drone hangar') || shortName.startsWith('dh')) {
    // DH (Drone Hangar) -> Drones & Special Craft (Bombshell, Prism, Shieldbuster, Catapult, Kamikaze, Nukes, Turret & Support Drones)
    const droneNames = ['bombshell', 'prism', 'shieldbuster', 'catapult', 'kamikaze', 'nuke', 'rocket', 'drone'];
    return roots.filter(c => droneNames.some(d => c.CraftName.toLowerCase().includes(d)) || c.CraftPathingType === 'Defend');
  }
  if (roomName.includes('decoy drone')) {
    // DB (Decoy Drone Bay) -> Decoy Drones
    return roots.filter(c => c.CraftName.toLowerCase().includes('decoy'));
  }
  if (roomName.includes('corvette hangar') || shortName.startsWith('ch')) {
    // CH (Corvette Hangar) -> Corvette-class starships (Pawn, Knight, Bishop, Rook, Queen, King)
    const corvetteNames = ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
    return roots.filter(c => corvetteNames.some(n => c.CraftName.toLowerCase().includes(n)));
  }
  if (roomName.includes('gray launch pad')) {
    // Gray Launch Pad -> Saucers
    return roots.filter(c => c.CraftName.toLowerCase().includes('saucer') || c.CraftName.toLowerCase().includes('gray'));
  }
  // Standard Hangars (HAN, STA, LP, WPH, TH) -> Standard Fighters & Bombers
  const excluded = ['bombshell', 'prism', 'shieldbuster', 'catapult', 'kamikaze', 'nuke', 'rocket', 'drone', 'decoy', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
  return roots.filter(c => !excluded.some(s => c.CraftName.toLowerCase().includes(s)));
}

export function RoomDetail() {
  const { lang, id } = useParams();
  const [roomGroup, setRoomGroup] = useState(null);
  const [allMissiles, setAllMissiles] = useState([]);
  const [allCrafts, setAllCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Craft selectors
  const [selectedCraftRootId, setSelectedCraftRootId] = useState(null);
  const [selectedCraftId, setSelectedCraftId] = useState(null);
  const [craftCount, setCraftCount] = useState(null);

  // Missile selectors
  const [selectedMissileRootId, setSelectedMissileRootId] = useState(null);
  const [selectedMissileId, setSelectedMissileId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/active/rooms.json').then(r => r.json()),
      fetch('/data/active/missiles.json').then(r => r.json()),
      fetch('/data/active/crafts.json').then(r => r.json()),
    ]).then(([rooms, missiles, crafts]) => {
      const found = rooms.find(r => String(r.rootId) === String(id));
      setRoomGroup(found || null);
      setAllMissiles(missiles);
      setAllCrafts(crafts);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading room design details...</div>;
  if (!roomGroup) return <div className="p-8 text-center text-rose-400">Room system #{id} not found.</div>;

  const first = roomGroup.levels[0];
  const selectedLvl = roomGroup.levels[selectedIdx] || first;
  const prevLvl = selectedIdx > 0 ? roomGroup.levels[selectedIdx - 1] : null;
  const raw = selectedLvl.raw || {};
  const prevRaw = prevLvl?.raw || null;

  // Sprite proportional to grid: 2x scale for display
  const spriteW = Math.max((first.columns || 2) * 40 * 2, 120);
  const spriteH = Math.max((first.rows || 2) * 40 * 2, 120);

  const mfgType = raw.ManufactureType;
  const isCarrier = mfgType === 'Craft';
  const isLoadableMissile = mfgType === 'Missile' && !raw.MissileDesign;

  // Craft resolution
  const compatibleCraftRoots = isCarrier
    ? getCompatibleCrafts(roomGroup, allCrafts)
    : [];

  const activeCraftRoot = compatibleCraftRoots.length > 0
    ? (compatibleCraftRoots.find(c => c.CraftDesignId === selectedCraftRootId) || compatibleCraftRoots[0])
    : null;

  const availableCraftLevels = activeCraftRoot
    ? allCrafts.filter(c => (c.RootCraftDesignId || c.CraftDesignId) === activeCraftRoot.CraftDesignId)
    : [];

  const activeCraft = availableCraftLevels.length > 0
    ? (availableCraftLevels.find(c => c.CraftDesignId === selectedCraftId) || availableCraftLevels[0])
    : null;

  const maxDeploy = raw.MaxSystemPower || 1;
  const activeCraftCount = craftCount !== null ? Math.min(Math.max(1, craftCount), maxDeploy) : maxDeploy;

  // Missile resolution
  const compatibleMissileRoots = isLoadableMissile
    ? getCompatibleMissiles(roomGroup, allMissiles)
    : [];

  const activeMissileRoot = compatibleMissileRoots.length > 0
    ? (compatibleMissileRoots.find(m => m.MissileDesignId === selectedMissileRootId) || compatibleMissileRoots[0])
    : null;

  const availableMissileLevels = activeMissileRoot
    ? allMissiles.filter(m => (m.RootMissileDesignId || m.MissileDesignId) === activeMissileRoot.MissileDesignId)
    : [];

  const activeMissile = availableMissileLevels.length > 0
    ? (availableMissileLevels.find(m => m.MissileDesignId === selectedMissileId) || availableMissileLevels[availableMissileLevels.length - 1])
    : null;

  // Override raw.MissileDesign with selected ammo for stat calculation
  const effectiveRaw = activeMissile
    ? { ...raw, MissileDesign: activeMissile }
    : raw;

  const statCards = buildStatCards(effectiveRaw, prevRaw, activeCraft, allMissiles, activeCraftCount);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">

      <Link
        to={`/${lang}/library/rooms`}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Room Catalog</span>
      </Link>

      <div className="rounded-lg bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div
            className="flex-shrink-0 flex items-center justify-center transition-all duration-300"
            style={{ width: spriteW, height: spriteH }}
          >
            <SpriteFrame
              key={selectedLvl.imageSpriteId}
              spriteId={selectedLvl.imageSpriteId}
              alt={selectedLvl.name}
              size="full"
              borderless
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 space-y-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{selectedLvl.name}</h1>
              <CategoryBadge category={roomGroup.type} />
              {meaningful(raw.CategoryType) && <CategoryBadge category={raw.CategoryType} />}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Room Design ID: <span className="text-slate-300">#{roomGroup.rootId}</span>
              {' · '}Grid: <span className="text-indigo-400">{first.columns}×{first.rows}</span>
              {' · '}<span className="text-indigo-400">Level {selectedLvl.level}</span> / {roomGroup.levels.length}
            </p>
            {raw.RoomDescription && (
              <p className="text-sm text-slate-300 italic">{raw.RoomDescription}</p>
            )}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              {raw.Rotate && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">Rotatable</span>}
              {raw.FlipOnEnemyShip && <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">Flips on Enemy</span>}
              {meaningful(raw.Tags) && raw.Tags.split(',').map(t => (
                <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">{t.trim()}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Carrier Controls: Craft Type, Craft Level, Deployed Count */}
        {isCarrier && compatibleCraftRoots.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-xl space-y-3 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
              Craft Deployment & Damage Simulator
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Craft Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Craft Type</label>
                <select
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  value={activeCraftRoot?.CraftDesignId || ''}
                  onChange={e => {
                    const id = Number(e.target.value);
                    setSelectedCraftRootId(id);
                    setSelectedCraftId(null);
                  }}
                >
                  {compatibleCraftRoots.map(c => (
                    <option key={c.CraftDesignId} value={c.CraftDesignId}>
                      {c.CraftName.replace(/\s+Lv\d+$/i, '')} ({c.CraftAttackType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Craft Level */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Craft Level</label>
                <select
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  value={activeCraft?.CraftDesignId || ''}
                  onChange={e => setSelectedCraftId(Number(e.target.value))}
                >
                  {availableCraftLevels.map(c => (
                    <option key={c.CraftDesignId} value={c.CraftDesignId}>
                      {c.CraftName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Deployed Crafts */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">
                  Deployed Crafts (Max {maxDeploy})
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setCraftCount(Math.max(1, activeCraftCount - 1))}
                    disabled={activeCraftCount <= 1}
                    className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 text-slate-200"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxDeploy}
                    value={activeCraftCount}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setCraftCount(Math.min(Math.max(1, val), maxDeploy));
                    }}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-center text-xs font-mono text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setCraftCount(Math.min(maxDeploy, activeCraftCount + 1))}
                    disabled={activeCraftCount >= maxDeploy}
                    className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-40 text-slate-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-mono">/ {maxDeploy}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loadable Missile Controls: Ammo Type, Ammo Level */}
        {isLoadableMissile && compatibleMissileRoots.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-xl space-y-3 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
              Ammo & Damage Simulator
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Ammo Type */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Ammo Type</label>
                <select
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  value={activeMissileRoot?.MissileDesignId || ''}
                  onChange={e => {
                    const id = Number(e.target.value);
                    setSelectedMissileRootId(id);
                    setSelectedMissileId(null);
                  }}
                >
                  {compatibleMissileRoots.map(m => (
                    <option key={m.MissileDesignId} value={m.MissileDesignId}>
                      {m.MissileDesignName.replace(/\s+(Level\s+\d+|\d+)$/i, '')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ammo Level */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Ammo Level</label>
                <select
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  value={activeMissile?.MissileDesignId || ''}
                  onChange={e => setSelectedMissileId(Number(e.target.value))}
                >
                  {availableMissileLevels.map(m => (
                    <option key={m.MissileDesignId} value={m.MissileDesignId}>
                      {m.MissileDesignName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stat Cards — updates per selected level + craft/ammo controls */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {statCards.map((s, i) => (
              <div key={i} className="bg-slate-950 rounded-lg px-3 py-2 text-xs font-mono">
                <div className="text-slate-500">{s.label}</div>
                <div className={`font-bold mt-0.5 ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Level Progression Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Level Progression</span>
            <span className="text-[11px] font-normal text-slate-500 ml-1">— click a row to preview that level</span>
          </h2>

          <div className="overflow-x-auto rounded-lg bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800/40">
                <tr>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Build Time</th>
                  <th className="px-4 py-3">Min Ship</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono">
                {roomGroup.levels.map((lvl, idx) => {
                  const r = lvl.raw || {};
                  const isSelected = idx === selectedIdx;
                  return (
                    <tr
                      key={lvl.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : 'hover:bg-slate-900/60'}`}
                    >
                      <td className={`px-4 py-3 font-bold ${isSelected ? 'text-indigo-400' : 'text-indigo-400/60'}`}>Lv {lvl.level}</td>
                      <td className={`px-4 py-3 font-sans font-medium ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>{lvl.name}</td>
                      <td className="px-4 py-3 text-slate-400">{parsePrice(r.PriceString) || parsePrice(r.StarbasePriceString) || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{formatTime(lvl.constructionTime || r.ConstructionTime)}</td>
                      <td className="px-4 py-3 text-slate-400">Lv {lvl.minShipLevel || r.MinShipLevel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
