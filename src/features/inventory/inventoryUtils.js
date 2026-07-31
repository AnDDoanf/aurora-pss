import {
  EMPTY_TRAINING,
  TRAINING_STATS,
  calculateTrainedStat,
  clampTrainingAllocation,
  getTrainingCapacity
} from '../training/trainingCalculations.js';

export const INVENTORY_STORAGE_KEY = 'pss_crew_inventory_v1';

export const EQUIPMENT_SLOTS = [
  { key: 'head', bit: 1, subtype: 'EquipmentHead' },
  { key: 'body', bit: 2, subtype: 'EquipmentBody' },
  { key: 'leg', bit: 4, subtype: 'EquipmentLeg' },
  { key: 'weapon', bit: 8, subtype: 'EquipmentWeapon' },
  { key: 'accessory', bit: 16, subtype: 'EquipmentAccessory' },
  { key: 'pet', bit: 32, subtype: 'EquipmentPet' }
];

export const INVENTORY_STATS = [
  { key: 'hp', label: 'HP', crewKey: 'finalHp', enhancementType: 'Hp', spriteId: 3073 },
  { key: 'atk', label: 'ATK', crewKey: 'finalAttack', enhancementType: 'Attack', spriteId: 3074 },
  { key: 'rpr', label: 'RPR', crewKey: 'finalRepair', enhancementType: 'Repair', spriteId: 3076 },
  { key: 'abl', label: 'ABL', crewKey: 'specialAbilityFinalArgument', enhancementType: 'Ability', spriteId: 3081 },
  { key: 'sta', label: 'STA', crewKey: null, enhancementType: 'Stamina', spriteId: 3077 },
  { key: 'plt', label: 'PLT', crewKey: 'finalPilot', enhancementType: 'Pilot', spriteId: 3079 },
  { key: 'sci', label: 'SCI', crewKey: 'finalScience', enhancementType: 'Science', spriteId: 8380 },
  { key: 'eng', label: 'ENG', crewKey: 'finalEngine', enhancementType: 'Engine', spriteId: 3080 },
  { key: 'wpn', label: 'WPN', crewKey: 'finalWeapon', enhancementType: 'Weapon', spriteId: 3078 },
  { key: 'fr', label: 'FR', crewKey: 'fireResistance', enhancementType: 'FireResistance', spriteId: 3075 }
];

function createInstanceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createInventoryEntry(crewId) {
  return {
    instanceId: createInstanceId(),
    crewId: String(crewId),
    nickname: '',
    crisprCount: 0,
    training: { ...EMPTY_TRAINING },
    equipment: {},
    secondaryStats: {}
  };
}

export function getCrewEquipmentSlots(crew) {
  const mask = Number(crew?.raw?.EquipmentMask) || 0;
  return EQUIPMENT_SLOTS.filter((slot) => (mask & slot.bit) === slot.bit);
}

export function normalizeInventoryEntry(entry, crew) {
  const crisprCount = Math.min(Math.max(Math.trunc(Number(entry?.crisprCount) || 0), 0), 2);
  const capacity = getTrainingCapacity(crew, crisprCount);
  const training = clampTrainingAllocation(entry?.training, capacity);

  const allowedSlots = new Set(getCrewEquipmentSlots(crew).map(({ key }) => key));
  const equipment = Object.fromEntries(
    Object.entries(entry?.equipment || {})
      .filter(([slot, itemId]) => allowedSlots.has(slot) && itemId)
      .map(([slot, itemId]) => [slot, String(itemId)])
  );
  const validTrainingStats = new Set(TRAINING_STATS.map(({ key }) => key));
  const secondaryStats = Object.fromEntries(
    Object.entries(entry?.secondaryStats || {})
      .filter(([slot, bonus]) => (
        allowedSlots.has(slot)
        && equipment[slot]
        && validTrainingStats.has(bonus?.statKey)
        && Number.isFinite(Number(bonus?.value))
        && Number(bonus.value) > 0
      ))
      .map(([slot, bonus]) => [slot, {
        statKey: bonus.statKey,
        value: Math.min(Math.max(Number(bonus.value), 0), 999)
      }])
  );

  return {
    instanceId: entry?.instanceId || createInstanceId(),
    crewId: String(crew?.id ?? entry?.crewId ?? ''),
    nickname: String(entry?.nickname || ''),
    crisprCount,
    training,
    equipment,
    secondaryStats
  };
}

export function calculateInventoryStats(crew, entry, itemById) {
  const bonuses = {};
  const extraBonuses = [];

  for (const [slot, itemId] of Object.entries(entry?.equipment || {})) {
    const item = itemById.get(String(itemId));
    if (!item) continue;

    if (item.enhancementType && item.enhancementType !== 'None') {
      const value = Number(item.enhancementValue) || 0;
      const stat = INVENTORY_STATS.find(({ enhancementType }) => enhancementType === item.enhancementType);
      if (stat) {
        bonuses[stat.key] = (bonuses[stat.key] || 0) + value;
      } else {
        extraBonuses.push({ type: item.enhancementType, value, itemName: item.name });
      }
    }

    if (String(item.rarity).toLowerCase() === 'hero') {
      const secondary = entry?.secondaryStats?.[slot];
      const secondaryValue = Number(secondary?.value) || 0;
      if (secondary?.statKey && secondaryValue > 0) {
        bonuses[secondary.statKey] = (bonuses[secondary.statKey] || 0) + secondaryValue;
      }
    }
  }

  const stats = INVENTORY_STATS.map((stat) => {
    const rawBase = stat.key === 'fr'
      ? crew?.raw?.FireResistance
      : (stat.crewKey ? crew?.[stat.crewKey] : 0);
    const base = Number(rawBase) || 0;
    const trainingPoints = Number(entry?.training?.[stat.key]) || 0;
    const trained = stat.key === 'fr'
      ? base
      : (calculateTrainedStat(base, trainingPoints, stat.key) ?? base);
    const equipmentBonus = bonuses[stat.key] || 0;

    return {
      ...stat,
      base,
      trainingPoints,
      trained,
      equipmentBonus,
      total: trained + equipmentBonus
    };
  });

  return { stats, extraBonuses };
}

export function loadInventory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInventory(entries) {
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Keep the current in-memory inventory when storage is unavailable.
  }
}
