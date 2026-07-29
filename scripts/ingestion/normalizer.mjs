import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true,
  processEntities: false
});

function extractRecordsFromObject(obj) {
  if (!obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) return obj;
  
  const keys = Object.keys(obj);
  for (const k of keys) {
    if (Array.isArray(obj[k])) {
      return obj[k];
    }
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const nested = extractRecordsFromObject(obj[k]);
      if (nested.length > 0) return nested;
    }
  }
  return [];
}

/**
 * Helper to ensure parsed entity container returns array of items
 */
function extractRecords(xmlContent) {
  if (!xmlContent) return [];
  const parsed = parser.parse(xmlContent);
  return extractRecordsFromObject(parsed);
}

/**
 * Main normalization pipeline
 */
export function normalizeSnapshot(snapshotDir) {
  const rawDir = path.join(snapshotDir, 'raw');
  const normalizedDir = path.join(snapshotDir, 'normalized');
  fs.mkdirSync(normalizedDir, { recursive: true });

  console.log(`[Normalizer] Normalizing XML snapshots from ${rawDir}...`);

  const readRaw = (endpoint) => {
    const filename = endpoint.replace(/\//g, '_') + '.xml';
    const filePath = path.join(rawDir, filename);
    if (!fs.existsSync(filePath)) return [];
    const xml = fs.readFileSync(filePath, 'utf8');
    return extractRecords(xml);
  };

  // 1. Files & Sprites
  const filesList = readRaw('FileService/ListFiles4');
  const spritesList = readRaw('FileService/ListSprites2');

  const filesMap = {};
  for (const f of filesList) {
    if (f.Id) {
      filesMap[f.Id] = {
        fileId: f.Id,
        filename: f.Filename || '',
        awsFilename: f.AwsFilename || '',
        size: f.Size || 0,
        category: f.DownloadCategory || ''
      };
    }
  }

  const spritesMap = {};
  for (const s of spritesList) {
    if (s.SpriteId) {
      spritesMap[s.SpriteId] = {
        spriteId: s.SpriteId,
        imageFileId: s.ImageFileId,
        x: s.X || 0,
        y: s.Y || 0,
        width: s.Width || 0,
        height: s.Height || 0,
        spriteKey: s.SpriteKey || ''
      };
    }
  }

  // 2. Characters / Crew
  const crewRaw = readRaw('CharacterService/ListAllCharacterDesigns2');
  const crewActions = readRaw('CharacterService/ListAllCharacterDesignActions');

  const crewCatalog = crewRaw.map(c => ({
    id: c.CharacterDesignId,
    name: c.CharacterDesignName || '',
    title: c.CharacterTitle || '',
    rarity: c.Rarity || 'Common',
    hp: c.Hp || 0,
    finalHp: c.FinalHp || c.Hp || 0,
    attack: c.Attack || 0,
    finalAttack: c.FinalAttack || c.Attack || 0,
    repair: c.Repair || 0,
    finalRepair: c.FinalRepair || c.Repair || 0,
    pilot: c.Pilot || 0,
    finalPilot: c.FinalPilot || c.Pilot || 0,
    weapon: c.Weapon || 0,
    finalWeapon: c.FinalWeapon || c.Weapon || 0,
    science: c.Science || 0,
    finalScience: c.FinalScience || c.Science || 0,
    engine: c.Engine || 0,
    finalEngine: c.FinalEngine || c.Engine || 0,
    research: c.Research || 0,
    finalResearch: c.FinalResearch || c.Research || 0,
    walkSpeed: c.WalkSpeed || 0,
    runSpeed: c.RunSpeed || 0,
    specialAbilityType: c.SpecialAbilityType || '',
    specialAbilityArgument: c.SpecialAbilityArgument || 0,
    specialAbilityFinalArgument: c.SpecialAbilityFinalArgument || 0,
    profileSpriteId: c.ProfileSpriteId || null,
    collectionId: c.CollectionDesignId || null,
    progressionType: c.ProgressionType || '',
    maxLevel: c.MaxLevel || 40,
    parts: {
      head: c.HeadPartId || null,
      body: c.BodyPartId || null,
      leg: c.LegPartId || null
    },
    raw: c
  }));

  // 3. Training programs
  const trainingRaw = readRaw('TrainingService/ListAllTrainingDesigns2');
  const trainingCatalog = trainingRaw.map(training => ({
    id: training.TrainingDesignId,
    name: training.TrainingName || '',
    description: training.TrainingDescription || '',
    rank: training.Rank || 0,
    mineralCost: training.MineralCost || 0,
    gasCost: training.GasCost || 0,
    duration: training.Duration || 0,
    fatigue: training.Fatigue || 0,
    roomLevel: training.RequiredRoomLevel || 0,
    xpChance: training.XpChance || 0,
    minGuarantee: training.MinimumGuarantee || 0,
    variableChance: training.VariableChance ?? 0.25,
    hp: training.HpChance || 0,
    atk: training.AttackChance || 0,
    plt: training.PilotChance || 0,
    rpr: training.RepairChance || 0,
    wpn: training.WeaponChance || 0,
    sci: training.ScienceChance || 0,
    eng: training.EngineChance || 0,
    sta: training.StaminaChance || 0,
    abl: training.AbilityChance || 0,
    prereq: training.RequiredTrainingDesignId || 0,
    reqResearch: training.RequiredResearchDesignId || 0,
    spriteId: training.TrainingSpriteId || null,
    animationStyle: training.TrainingAnimationStyle || ''
  }));

  // 4. Rooms
  const roomsRaw = readRaw('RoomService/ListRoomDesigns2');
  const roomSpritesRaw = readRaw('RoomDesignSpriteService/ListRoomDesignSprites2');
  const roomActionsRaw = readRaw('RoomService/ListActionTypes2');
  const roomConditionsRaw = readRaw('RoomService/ListConditionTypes2');

  const roomGroups = {};
  for (const r of roomsRaw) {
    const rootId = r.RootRoomDesignId || r.RoomDesignId;
    if (!roomGroups[rootId]) {
      roomGroups[rootId] = {
        rootId,
        name: r.RoomName || '',
        type: r.RoomType || '',
        category: r.Category || '',
        levels: []
      };
    }

    roomGroups[rootId].levels.push({
      id: r.RoomDesignId,
      rootId,
      name: r.RoomName || '',
      shortName: r.ShortRoomName || '',
      level: r.Level || 1,
      rows: r.Rows || 0,
      columns: r.Columns || 0,
      capacity: r.Capacity || 0,
      cooldown: r.Cooldown || 0,
      reload: r.Reload || 0,
      powerGenerated: r.PowerGenerated || 0,
      powerRequested: r.PowerRequested || 0,
      price: r.Price || 0,
      constructionTime: r.ConstructionTime || 0,
      minShipLevel: r.MinShipLevel || 1,
      imageSpriteId: r.ImageSpriteId || null,
      constructionSpriteId: r.ConstructionSpriteId || null,
      destroyedSpriteId: r.DestroyedSpriteId || null,
      craftId: r.CraftDesignId || null,
      missileId: r.MissileDesignId || null,
      raw: r
    });
  }

  // Sort levels sequentially for each room chain
  Object.values(roomGroups).forEach(group => {
    group.levels.sort((a, b) => a.level - b.level);
  });

  // 5. Ships
  const shipsRaw = readRaw('ShipService/ListAllShipDesigns2');
  const shipsCatalog = shipsRaw.map(s => ({
    id: s.ShipDesignId,
    name: s.ShipDesignName || '',
    shipType: s.ShipType || '',
    raceId: s.RaceId || 0,
    shipLevel: s.ShipLevel || 1,
    rows: s.Rows || 0,
    columns: s.Columns || 0,
    mask: s.Mask || '',
    hp: s.Hp || 0,
    repairCost: s.RepairCost || 0,
    interiorFileId: s.InteriorFileId || null,
    exteriorFileId: s.ExteriorFileId || null,
    miniShipFileId: s.MiniShipFileId || null,
    raw: s
  }));

  // 6. Items
  const itemsRaw = readRaw('ItemService/ListItemDesigns2');
  const itemsCatalog = itemsRaw.map(item => ({
    id: item.ItemDesignId,
    name: item.ItemDesignName || '',
    itemType: item.ItemType || '',
    itemSubType: item.ItemSubType || '',
    rarity: item.Rarity || 'Common',
    rank: item.Rank || 0,
    enhancementType: item.EnhancementType || '',
    enhancementValue: item.EnhancementValue || 0,
    imageSpriteId: item.ImageSpriteId || null,
    logoSpriteId: item.LogoSpriteId || null,
    fairPrice: item.FairPrice || 0,
    raw: item
  }));

  // 7. Crafts & Missiles
  const craftsRaw = readRaw('RoomService/ListCraftDesigns');
  const missilesRaw = readRaw('RoomService/ListMissileDesigns');

  // 8. Research & Missions
  const researchRaw = readRaw('ResearchService/ListAllResearchDesigns2');
  const missionsRaw = readRaw('MissionService/ListAllMissionDesigns4');

  // 9. Galaxy
  const starSystems = readRaw('GalaxyService/ListStarSystems');
  const systemLinks = readRaw('GalaxyService/ListStarSystemLinks');
  const planets = readRaw('GalaxyService/ListPlanets');

  // 10. Collections
  const collectionsRaw = readRaw('CollectionService/ListAllCollectionDesigns');
  const collectionsCatalog = collectionsRaw.map(col => ({
    id: col.CollectionDesignId,
    name: col.CollectionName || '',
    minCombo: col.MinCombo || 0,
    maxCombo: col.MaxCombo || 0,
    enhancementType: col.EnhancementType || '',
    baseEnhancementValue: col.BaseEnhancementValue || 0,
    stepEnhancementValue: col.StepEnhancementValue || 0,
    description: col.CollectionDescription || '',
    spriteId: col.SpriteId || null,
    iconSpriteId: col.IconSpriteId || null,
    colorString: col.ColorString || '255,255,255',
    abilityName: col.AbilityName || '',
    abilityIconSpriteId: col.AbilityIconSpriteId || null,
    baseChance: col.BaseChance || 0,
    stepChance: col.StepChance || 0,
    raw: col
  }));

  // Write normalized JSON bundles
  const writeJson = (filename, data) => {
    fs.writeFileSync(path.join(normalizedDir, filename), JSON.stringify(data, null, 2), 'utf8');
  };

  writeJson('files.json', filesMap);
  writeJson('sprites.json', spritesMap);
  writeJson('crew.json', crewCatalog);
  writeJson('training.json', trainingCatalog);
  writeJson('rooms.json', Object.values(roomGroups));
  writeJson('ships.json', shipsCatalog);
  writeJson('items.json', itemsCatalog);
  writeJson('crafts.json', craftsRaw);
  writeJson('missiles.json', missilesRaw);
  writeJson('research.json', researchRaw);
  writeJson('missions.json', missionsRaw);
  writeJson('galaxy.json', { starSystems, systemLinks, planets });
  writeJson('collections.json', collectionsCatalog);

  const meta = {
    normalizedAt: new Date().toISOString(),
    counts: {
      files: Object.keys(filesMap).length,
      sprites: Object.keys(spritesMap).length,
      crew: crewCatalog.length,
      training: trainingCatalog.length,
      roomGroups: Object.keys(roomGroups).length,
      ships: shipsCatalog.length,
      items: itemsCatalog.length,
      crafts: craftsRaw.length,
      missiles: missilesRaw.length,
      research: researchRaw.length,
      missions: missionsRaw.length,
      collections: collectionsCatalog.length
    }
  };

  writeJson('meta.json', meta);
  console.log(`[Normalizer] Normalization complete. Meta counts:`, meta.counts);
  return meta;
}
