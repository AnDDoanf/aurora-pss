export const TRAINING_STATS = [
  { key: 'hp', label: 'HP', crewKey: 'finalHp', color: '#f43f5e', spriteId: 3073 },
  { key: 'atk', label: 'ATK', crewKey: 'finalAttack', color: '#fb923c', spriteId: 3074 },
  { key: 'rpr', label: 'RPR', crewKey: 'finalRepair', color: '#facc15', spriteId: 3076 },
  { key: 'abl', label: 'ABL', crewKey: 'specialAbilityFinalArgument', color: '#a78bfa', spriteId: 3081 },
  { key: 'sta', label: 'STA', crewKey: null, color: '#2dd4bf', spriteId: 3077 },
  { key: 'plt', label: 'PLT', crewKey: 'finalPilot', color: '#38bdf8', spriteId: 3079 },
  { key: 'sci', label: 'SCI', crewKey: 'finalScience', color: '#60a5fa', spriteId: 8380 },
  { key: 'eng', label: 'ENG', crewKey: 'finalEngine', color: '#818cf8', spriteId: 3080 },
  { key: 'wpn', label: 'WPN', crewKey: 'finalWeapon', color: '#e879f9', spriteId: 3078 }
];

export const EMPTY_TRAINING = Object.fromEntries(TRAINING_STATS.map(({ key }) => [key, 0]));

const FALLBACK_CAPACITY = {
  Common: 50,
  Elite: 60,
  Unique: 70,
  Epic: 80,
  Hero: 90,
  Special: 100,
  Legendary: 110,
  Captain: 200
};

export function getTrainingCapacity(crew) {
  const apiCapacity = Number(crew?.raw?.TrainingCapacity);
  if (Number.isFinite(apiCapacity) && apiCapacity > 0) return apiCapacity;
  return FALLBACK_CAPACITY[crew?.rarity] ?? 0;
}

export function clampTrainingValue(value, capacity) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(Math.max(Math.round(parsed), 0), Math.max(capacity, 0));
}

export function calculateTrainedStat(baseStat, trainingPoints, statKey) {
  const base = Number(baseStat);
  const points = Number(trainingPoints);
  if (!Number.isFinite(base) || !Number.isFinite(points)) return null;

  const trained = base * (1 + Math.max(points, 0) / 100);
  return statKey === 'hp'
    ? Math.round(trained)
    : Math.round((trained + Number.EPSILON) * 10) / 10;
}

export function summarizeTraining(training, capacity) {
  const spent = TRAINING_STATS.reduce((sum, stat) => sum + clampTrainingValue(training?.[stat.key], capacity), 0);
  return {
    spent,
    remaining: Math.max(capacity - spent, 0),
    overCapacity: Math.max(spent - capacity, 0)
  };
}

export function getProgramWeights(program, targetStat, quality = 'regular') {
  const weights = Object.fromEntries(TRAINING_STATS.map(({ key }) => [key, Math.max(Number(program?.[key]) || 0, 0)]));
  if (quality === 'elite' && weights[targetStat] > 0) {
    // Isolated until an authoritative Elite coefficient is published.
    weights[targetStat] *= 1.25;
  }
  return weights;
}

export function isPrimaryTrainingStat(program, targetStat) {
  const weights = TRAINING_STATS.map(({ key }) => Math.max(Number(program?.[key]) || 0, 0));
  const targetWeight = Math.max(Number(program?.[targetStat]) || 0, 0);
  return targetWeight > 0 && targetWeight === Math.max(...weights);
}

export function calculateDistribution(program, remaining, targetStat, quality = 'regular') {
  const weights = getProgramWeights(program, targetStat, quality);
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const variability = Math.max(Number(program?.variableChance) || 0, 0);
  const guarantee = Math.max(Number(program?.minGuarantee) || 0, 0);

  return TRAINING_STATS.map((stat) => {
    const share = totalWeight > 0 ? weights[stat.key] / totalWeight : 0;
    const expected = remaining * share;
    const guaranteed = stat.key === targetStat && share > 0 ? Math.min(guarantee, remaining) : 0;
    return {
      ...stat,
      weight: weights[stat.key],
      share,
      expected,
      min: Math.min(Math.max(expected * (1 - variability), guaranteed), remaining),
      max: Math.min(Math.max(expected * (1 + variability), guaranteed), remaining)
    };
  });
}

export function calculateTrainingPossibilities(program, capacity, training, fatigue, targetStat, quality = 'regular') {
  const safeCapacity = Math.max(Number(capacity) || 0, 0);
  const summary = summarizeTraining(training, safeCapacity);
  const weights = getProgramWeights(program, targetStat, quality);
  const fatigueValue = Math.min(Math.max(Number(fatigue) || 0, 0), 100);
  const fatigueMultiplier = fatigueValue === 0 ? 1 : fatigueValue <= 50 ? 0.5 : fatigueValue < 100 ? 1 / 3 : 0;
  const remainingTotalFactor = safeCapacity > 0 ? Math.max(1 - summary.spent / safeCapacity, 0) : 0;
  const guarantee = Math.max(Number(program?.minGuarantee) || 0, 0);
  const variability = Math.max(Number(program?.variableChance) ?? 0.25, 0);
  const isConsumable = Number(program?.rank) === 100;

  const rows = TRAINING_STATS.map((stat) => {
    const current = clampTrainingValue(training?.[stat.key], safeCapacity);
    const remainingStatFactor = safeCapacity > 0 ? Math.max(1 - current / safeCapacity, 0) : 0;
    const effect = weights[stat.key];
    const gainFactor = effect * remainingTotalFactor * remainingStatFactor;
    const divisor = remainingTotalFactor * remainingStatFactor * fatigueMultiplier;
    const requiredEffect = divisor > 0 ? Math.floor((1 / divisor) * 10000) / 10000 : Number.POSITIVE_INFINITY;
    const isMainStat = stat.key === targetStat;
    const roundGain = (value) => stat.key === 'sta' ? Math.ceil(value) : Math.floor(value);

    let max = 0;
    let min = 0;

    if (isConsumable) {
      if (effect > 0) {
        const baseGain = isMainStat && guarantee > 0
          ? Math.max(guarantee * 1.5, guarantee + 2)
          : Math.max(1, Math.round(effect / 16));
        const calcMin = isMainStat && guarantee > 0 ? guarantee : Math.floor(baseGain * (1 - variability));
        const calcMax = Math.ceil(baseGain * (1 + variability));
        min = Math.max(isMainStat && guarantee > 0 ? guarantee : 0, calcMin);
        max = Math.max(min, calcMax);
      }
    } else {
      if (isMainStat && fatigueValue === 100) {
        max = guarantee;
      } else if (fatigueValue >= 1 && fatigueValue <= 50 && requiredEffect > 0 && effect / requiredEffect > 1.5) {
        max = roundGain(gainFactor);
      } else if (isMainStat && guarantee > 0) {
        max = Math.max(roundGain(fatigueMultiplier * gainFactor), guarantee);
      } else if (effect >= requiredEffect) {
        max = roundGain(fatigueMultiplier * gainFactor);
      } else {
        max = effect > 0 ? Math.max(1, roundGain(effect * fatigueMultiplier)) : 0;
      }

      const calculatedMin = max > 0 ? Math.floor(max * (1 - variability)) : 0;
      min = isMainStat && guarantee > 0 ? Math.max(guarantee, calculatedMin) : Math.min(calculatedMin, max);
    }

    const remainingForStat = Math.max(0, safeCapacity - summary.spent);
    const finalMin = Math.min(min, remainingForStat);
    const finalMax = Math.min(Math.max(max, finalMin), remainingForStat);

    return {
      ...stat,
      weight: effect,
      min: finalMin,
      max: finalMax,
      expected: (finalMin + finalMax) / 2
    };
  });

  const totalExpected = rows.reduce((sum, row) => sum + row.expected, 0);
  return rows.map((row) => ({
    ...row,
    share: totalExpected > 0 ? row.expected / totalExpected : 0
  }));
}

export function recommendPrograms(programs, targetStat, quality = 'regular', fatigue = 0) {
  const targetPrograms = programs.filter((program) => isPrimaryTrainingStat(program, targetStat));
  const repeatablePrograms = targetPrograms.filter((program) => Number(program.rank) !== 100);
  const candidates = repeatablePrograms.length > 0 ? repeatablePrograms : targetPrograms;

  return candidates
    .map((program) => {
      const weights = getProgramWeights(program, targetStat, quality);
      const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
      const share = total > 0 ? weights[targetStat] / total : 0;
      const fatigueCost = Math.max(Number(program.fatigue) || 0, 0);
      const available = fatigueCost === 0 || Number(fatigue) + fatigueCost <= 100;
      const score = share * 100 + (Number(program.minGuarantee) || 0) * 3 - (available ? 0 : 1000);
      return { ...program, targetShare: share, available, score };
    })
    .sort((a, b) =>
      Number(b.available) - Number(a.available)
      || b.score - a.score
      || (Number(a.duration) || 0) - (Number(b.duration) || 0)
      || String(a.name).localeCompare(String(b.name))
    );
}

export function formatDuration(seconds) {
  const value = Number(seconds) || 0;
  if (value <= 0) return 'Instant';
  if (value % 3600 === 0) return `${value / 3600}h`;
  if (value >= 3600) return `${Math.floor(value / 3600)}h ${Math.round((value % 3600) / 60)}m`;
  return `${Math.round(value / 60)}m`;
}
