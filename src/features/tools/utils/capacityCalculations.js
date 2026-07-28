/**
 * Ship Capacity Analytics Calculation Utility
 */

export function calculateWeaponMetrics(weapon, bonusStats = {}, customBonuses = [], duration = null) {
  const {
    assignedPower = 0,
    maxPower = 1,
    count = 1,
    craftCount = 1,
    selectedAmmo = null,
    selectedCraft = null,
    applySymphony = false,
    symphonyShots = 5,
    symphonyBoost = 25,
    bonusStat = 0,
    haste = 0,
    baseStats = {}
  } = weapon;

  const hasteBonus = Number(haste ?? bonusStats.hasteBonus ?? 0);
  const weaponBonus = Number(bonusStat ?? bonusStats.weaponBonus ?? 0);

  const P = Number(assignedPower);
  const Pmax = Math.max(1, Number(maxPower));

  if (P <= 0) {
    return {
      isPowered: false,
      shotsPerSec: 0,
      baseReloadSec: (baseStats.ReloadTime || 120) / 40,
      effectiveReloadSec: 0,
      totalCycleSec: 0,
      firstShotFinishTime: 0,
      volley: baseStats.Volley || 1,
      volleyDelaySec: (baseStats.VolleyDelay || 0) / 40,
      totalShots: 0,
      totalVolleys: 0,
      sysDmg: 0,
      shieldDmg: 0,
      crewDmg: 0,
      hullDmg: 0,
      apDmg: 0,
      systemDmgRate: 0,
      shieldDmgRate: 0,
      crewDmgRate: 0,
      hullDmgRate: 0,
      apDmgRate: 0,
      totalSystemDmg: 0,
      totalShieldDmg: 0,
      totalCrewDmg: 0,
      totalHullDmg: 0,
      totalApDmg: 0
    };
  }

  // Raw base values from room, ammo, or craft
  let rawReloadTicks = baseStats.ReloadTime || 120;
  let cooldownTicks = baseStats.CooldownTime || 0;
  let V = baseStats.Volley || 1;
  let volleyDelayTicks = baseStats.VolleyDelay || 0;
  let baseSysDmg = baseStats.SystemDamage || 0;
  let baseShieldDmg = baseStats.ShieldDamage || 0;
  let baseCrewDmg = baseStats.CharacterDamage || 0;
  let baseHullDmg = baseStats.HullDamage || 0;
  let baseApDmg = baseStats.DirectSystemDamage || 0;

  if (selectedAmmo) {
    baseSysDmg = selectedAmmo.SystemDamage ?? baseSysDmg;
    baseShieldDmg = selectedAmmo.ShieldDamage ?? baseShieldDmg;
    baseCrewDmg = selectedAmmo.CharacterDamage ?? baseCrewDmg;
    baseHullDmg = selectedAmmo.HullDamage ?? baseHullDmg;
    baseApDmg = selectedAmmo.DirectSystemDamage ?? baseApDmg;
    V = selectedAmmo.Volley ?? V;
    if (selectedAmmo.VolleyDelay !== undefined && selectedAmmo.VolleyDelay !== null) {
      volleyDelayTicks = selectedAmmo.VolleyDelay;
    }
  } else if (selectedCraft) {
    if (selectedCraft.Reload) rawReloadTicks = selectedCraft.Reload;
    if (selectedCraft.Volley) V = selectedCraft.Volley;
    if (selectedCraft.VolleyDelay !== undefined && selectedCraft.VolleyDelay !== null) {
      volleyDelayTicks = selectedCraft.VolleyDelay;
    }
    if (selectedCraft.MissileDesign) {
      const md = selectedCraft.MissileDesign;
      baseSysDmg = md.SystemDamage ?? baseSysDmg;
      baseShieldDmg = md.ShieldDamage ?? baseShieldDmg;
      baseCrewDmg = md.CharacterDamage ?? baseCrewDmg;
      baseHullDmg = md.HullDamage ?? baseHullDmg;
      baseApDmg = md.DirectSystemDamage ?? baseApDmg;
      if (md.VolleyDelay !== undefined && md.VolleyDelay !== null) {
        volleyDelayTicks = md.VolleyDelay;
      }
    }
  }

  // Formula variables:
  // R: base reload time in seconds
  const R = rawReloadTicks / 40;
  // B: reload-speed bonus / weapon bonus as a decimal
  const B = weaponBonus / 100;
  // H: haste percentage
  const H = hasteBonus;
  // C: cooldown after final volley (seconds)
  const C = cooldownTicks >= 160 ? cooldownTicks / 40 : 0;
  // Delta: delay between volleys (seconds)
  const Delta = volleyDelayTicks / 40;
  // K: damage bonus for first n shots as a decimal
  const K = applySymphony ? (symphonyBoost / 100) : 0;
  // n: number of boosted shots (0 <= n <= 5)
  const n = Math.min(5, Math.max(0, Number(symphonyShots || 5)));
  // Effective craft count multiplier & room quantity
  const effectiveCraftCount = selectedCraft ? Math.max(1, Number(craftCount || 1)) : 1;
  const roomQuantity = Number(count || 1);

  // Time when the first shot finishes: F
  const reloadHasteTerm = (R * (Pmax / P)) / (1 + B);
  const hasteFactor = Math.max(0, 1 - H / (100 * Pmax));
  const F = reloadHasteTerm * hasteFactor + (V - 1) * Delta;

  // Cycle duration between shots:
  const cycleDuration = C + reloadHasteTerm + (V - 1) * Delta;

  const hasSnapshotDuration = (duration !== null && duration !== undefined && duration > 0);
  const T = hasSnapshotDuration ? Number(duration) : 10;

  // Number of shots / volleys: N
  let N = 0;
  if (hasSnapshotDuration) {
    if (T >= F) {
      N = 1 + (cycleDuration > 0 ? Math.floor((T - F) / cycleDuration) : 0);
    } else {
      N = 0;
    }
  } else {
    // Steady state / infinite duration
    const steadyCyclePerSec = cycleDuration > 0 ? 1 / cycleDuration : 0;
    N = Math.max(1, Math.ceil(steadyCyclePerSec * T));
  }

  // Boosted count = min(N, min(n, 5))
  const boostedShots = Math.min(N, Math.min(n, 5));
  // Effective shot multiplier: [N + K * min(N, min(n, 5))]
  const effMult = N + K * boostedShots;

  // Damage per volley with bonus B: D = Base * (1 + B)
  const sysDmg = baseSysDmg * (1 + B);
  const shieldDmg = baseShieldDmg * (1 + B);
  const crewDmg = baseCrewDmg * (1 + B);
  const hullDmg = baseHullDmg * (1 + B);
  const apDmg = baseApDmg * (1 + B);

  // DPS(T) for each damage type = (V * D / T) * [N + K * min(N, min(n, 5))] * roomQuantity * craftCount
  const systemDmgRate = (V * sysDmg / T) * effMult * roomQuantity * effectiveCraftCount;
  const shieldDmgRate = (V * shieldDmg / T) * effMult * roomQuantity * effectiveCraftCount;
  const crewDmgRate = (V * crewDmg / T) * effMult * roomQuantity * effectiveCraftCount;
  const hullDmgRate = (V * hullDmg / T) * effMult * roomQuantity * effectiveCraftCount;
  const apDmgRate = (V * apDmg / T) * effMult * roomQuantity * effectiveCraftCount;

  const totalSystemDmg = systemDmgRate * T;
  const totalShieldDmg = shieldDmgRate * T;
  const totalCrewDmg = crewDmgRate * T;
  const totalHullDmg = hullDmgRate * T;
  const totalApDmg = apDmgRate * T;

  const totalShots = N * V * roomQuantity * effectiveCraftCount;
  const shotsPerSec = hasSnapshotDuration ? (totalShots / T) : (V * roomQuantity * effectiveCraftCount / cycleDuration);

  return {
    isPowered: true,
    baseReloadSec: R,
    effectiveReloadSec: reloadHasteTerm,
    volleyDelaySec: Delta,
    totalCycleSec: cycleDuration,
    firstShotFinishTime: F,
    volley: V,
    shotsPerSec,
    steadyShotsPerSec: V * roomQuantity * effectiveCraftCount / cycleDuration,
    totalShots,
    totalVolleys: N,
    sysDmg,
    shieldDmg,
    crewDmg,
    hullDmg,
    apDmg,
    systemDmgRate,
    shieldDmgRate,
    crewDmgRate,
    hullDmgRate,
    apDmgRate,
    totalSystemDmg,
    totalShieldDmg,
    totalCrewDmg,
    totalHullDmg,
    totalApDmg,
    hasSymphony: applySymphony
  };
}

export function calculateDefenseMetrics(defense, bonusStats = {}, duration = null) {
  const {
    type = 'Shield',
    assignedPower = 0,
    maxPower = 1,
    count = 1,
    level = 1,
    capacity = 12,
    initValue = null,
    regenValue = null,
    bonusStat = 0,
    haste = 0,
    baseStats = {}
  } = defense;

  const scienceBonus = Number(bonusStat ?? bonusStats.scienceBonus ?? 0);
  const engineBonus = Number(bonusStat ?? bonusStats.engineBonus ?? 0);
  const hasteBonus = Number(haste ?? bonusStats.hasteBonus ?? 0);

  const pwrRatio = maxPower > 0 ? Math.min(1, Math.max(0, assignedPower / maxPower)) : 1;
  if (pwrRatio <= 0) {
    return {
      isPowered: false,
      shieldGenRate: 0,
      initialShieldCap: 0,
      generatedShield: 0,
      totalShieldInSnapshot: 0,
      effectiveReloadSec: 0,
      evasionContribution: 0,
      initialEvasion: 0
    };
  }

  let shieldGenRate = 0;
  let initialShieldCap = 0;
  let generatedShield = 0;
  let totalShieldInSnapshot = 0;
  let effectiveReloadSec = 0;
  let evasionContribution = 0;
  let initialEvasion = 0;

  const isShield = type === 'Shield' || baseStats.RoomType === 'Shield' || baseStats.CategoryType === 'Defense';
  const isEngine = type === 'Engine' || baseStats.RoomType === 'Engine';

  if (isShield) {
    const rawReload = baseStats.ReloadTime || 280; 
    const speedMult = pwrRatio * (1 + hasteBonus / 100);
    effectiveReloadSec = speedMult > 0 ? (rawReload / 40) / speedMult : Infinity;
    
    // Initial starting shield buffer (user custom initValue OR API baseStats.Capacity)
    const baseInit = (initValue !== null && initValue !== undefined && initValue !== '')
      ? Number(initValue)
      : (baseStats.Capacity || capacity || 12);
    initialShieldCap = baseInit * count;

    // Base shield regen per cycle with science bonus (user custom regenValue OR API baseStats.ManufactureRate / 1)
    const baseRegen = (regenValue !== null && regenValue !== undefined && regenValue !== '')
      ? Number(regenValue)
      : (baseStats.ManufactureRate || baseStats.RegenValue || 1);

    const regenPerCycle = baseRegen * (1 + scienceBonus / 100);

    const hasSnapshotDuration = (duration !== null && duration !== undefined && duration > 0);
    const calcDuration = hasSnapshotDuration ? Number(duration) : null;

    if (calcDuration !== null && calcDuration > 0) {
      // Discrete hasted reload cycles: if remaining time < effectiveReloadSec -> skip!
      const completedCycles = effectiveReloadSec > 0 ? Math.floor(calcDuration / effectiveReloadSec) : 0;
      generatedShield = completedCycles * (regenPerCycle * count);
      totalShieldInSnapshot = initialShieldCap + generatedShield;
      shieldGenRate = totalShieldInSnapshot / calcDuration;
    } else {
      // Infinite / Steady-state
      shieldGenRate = effectiveReloadSec > 0 ? (regenPerCycle * count) / effectiveReloadSec : 0;
      totalShieldInSnapshot = initialShieldCap;
      generatedShield = 0;
    }
  }

  if (isEngine) {
    // Engine initial evasion value (user custom initValue OR API DefaultDefenceBonus / 100)
    let baseEvasion = 0;
    if (initValue !== null && initValue !== undefined && initValue !== '') {
      baseEvasion = Number(initValue);
    } else if (baseStats.DefaultDefenceBonus > 0) {
      baseEvasion = baseStats.DefaultDefenceBonus / 100;
    } else if (baseStats.Capacity > 0) {
      baseEvasion = baseStats.Capacity;
    } else {
      baseEvasion = Number(level) * 1.2 + 4;
    }

    initialEvasion = baseEvasion * count;
    evasionContribution = initialEvasion * pwrRatio * (1 + engineBonus / 100);
  }

  return {
    isPowered: true,
    shieldGenRate,
    initialShieldCap,
    generatedShield,
    totalShieldInSnapshot,
    effectiveReloadSec,
    evasionContribution,
    initialEvasion
  };
}

export function calculateSnapshotTotals(snapshot) {
  const { duration = null, weapons = [], defenses = [], bonusStats = {}, customBonuses = [] } = snapshot;

  let totalSystemDmgRate = 0;
  let totalShieldDmgRate = 0;
  let totalCrewDmgRate = 0;
  let totalHullDmgRate = 0;
  let totalApDmgRate = 0;

  let accumSystemDmg = 0;
  let accumShieldDmg = 0;
  let accumCrewDmg = 0;
  let accumHullDmg = 0;
  let accumApDmg = 0;

  weapons.forEach(w => {
    const m = calculateWeaponMetrics(w, bonusStats, customBonuses, duration);
    totalSystemDmgRate += m.systemDmgRate;
    totalShieldDmgRate += m.shieldDmgRate;
    totalCrewDmgRate += m.crewDmgRate;
    totalHullDmgRate += m.hullDmgRate;
    totalApDmgRate += m.apDmgRate;

    accumSystemDmg += m.totalSystemDmg;
    accumShieldDmg += m.totalShieldDmg;
    accumCrewDmg += m.totalCrewDmg;
    accumHullDmg += m.totalHullDmg;
    accumApDmg += m.totalApDmg;
  });

  let totalShieldGenRate = 0;
  let totalInitialShieldCap = 0;
  let totalEvasion = 0;

  defenses.forEach(d => {
    const m = calculateDefenseMetrics(d, bonusStats, duration);
    totalShieldGenRate += m.shieldGenRate;
    totalInitialShieldCap += m.initialShieldCap;
    totalEvasion += m.evasionContribution;
  });

  const cappedEvasion = Math.min(75, totalEvasion);

  return {
    duration,
    systemDmgRate: totalSystemDmgRate,
    shieldDmgRate: totalShieldDmgRate,
    crewDmgRate: totalCrewDmgRate,
    hullDmgRate: totalHullDmgRate,
    apDmgRate: totalApDmgRate,
    accumSystemDmg,
    accumShieldDmg,
    accumCrewDmg,
    accumHullDmg,
    accumApDmg,
    shieldGenRate: totalShieldGenRate,
    initialShieldCap: totalInitialShieldCap,
    evasionContribution: cappedEvasion,
    rawEvasion: totalEvasion
  };
}

export function calculateTimelineSummary(snapshots = []) {
  let totalDuration = 0;
  let hasInfinite = false;

  let totalSystemDmg = 0;
  let totalShieldDmg = 0;
  let totalCrewDmg = 0;
  let totalHullDmg = 0;
  let totalApDmg = 0;

  let weightedShieldGenRateSum = 0;
  let weightedEvasionSum = 0;

  const analyzedSnapshots = snapshots.map((snap) => {
    const totals = calculateSnapshotTotals(snap);
    const snapDuration = (snap.duration !== null && snap.duration !== undefined && snap.duration > 0)
      ? Number(snap.duration)
      : null;

    if (snapDuration === null) {
      hasInfinite = true;
    } else {
      totalDuration += snapDuration;
      totalSystemDmg += totals.systemDmgRate * snapDuration;
      totalShieldDmg += totals.shieldDmgRate * snapDuration;
      totalCrewDmg += totals.crewDmgRate * snapDuration;
      totalHullDmg += totals.hullDmgRate * snapDuration;
      totalApDmg += totals.apDmgRate * snapDuration;

      weightedShieldGenRateSum += totals.shieldGenRate * snapDuration;
      weightedEvasionSum += totals.evasionContribution * snapDuration;
    }

    return {
      ...snap,
      totals,
      snapDuration
    };
  });

  const avgShieldGenRate = totalDuration > 0 ? weightedShieldGenRateSum / totalDuration : (analyzedSnapshots[0]?.totals?.shieldGenRate || 0);
  const avgEvasion = totalDuration > 0 ? weightedEvasionSum / totalDuration : (analyzedSnapshots[0]?.totals?.evasionContribution || 0);

  return {
    totalDuration,
    hasInfinite,
    totalSystemDmg,
    totalShieldDmg,
    totalCrewDmg,
    totalHullDmg,
    totalApDmg,
    avgShieldGenRate,
    avgEvasion,
    analyzedSnapshots
  };
}
