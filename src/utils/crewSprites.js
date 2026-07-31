export function getCrewPartSpriteId(crew, partType) {
  if (!crew || !partType) return null;

  const explicitKey = `${String(partType).toLowerCase()}SpriteId`;
  if (crew[explicitKey]) return crew[explicitKey];

  const parts = crew?.raw?.CharacterParts?.CharacterPart
    ?? crew?.CharacterParts?.CharacterPart;
  if (!parts) return null;

  const part = (Array.isArray(parts) ? parts : [parts])
    .find((candidate) => candidate?.CharacterPartType === partType);

  return part?.StandardSpriteId ?? null;
}

export function getCrewHeadSpriteId(crew) {
  return getCrewPartSpriteId(crew, 'Head');
}
