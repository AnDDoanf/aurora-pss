import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, Award, Sliders, ExternalLink } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { RarityBadge } from '../../components/ui/RarityBadge';
import { StatBar, StatComparisonRow } from '../../components/ui/StatBar';

const abilityMapping = {
  DeductReload: {
    name: 'Rush Command',
    description: 'Instantly increases the reload progress of the room this crew is in.',
    spriteId: 2703
  },
  HealSelfHp: {
    name: 'First Aid',
    description: "Restores the crew member's own HP.",
    spriteId: 2707
  },
  HealSameRoomCharacters: {
    name: 'Healing Rain',
    description: 'Restores HP to all friendly crew members in the same room.',
    spriteId: 2705
  },
  AddReload: {
    name: 'Rush Command',
    description: 'Instantly increases the reload progress of the room this crew is in.',
    spriteId: 2703
  },
  DamageToRoom: {
    name: 'System Hack',
    description: 'Deals direct damage to the room this crew is currently in.',
    spriteId: 2710
  },
  HealRoomHp: {
    name: 'Urgent Repair',
    description: 'Restores HP of the room this crew is currently in.',
    spriteId: 2709
  },
  DamageToSameRoomCharacters: {
    name: 'Gas Cloud',
    description: 'Deals damage over time to all enemy crew members in the same room.',
    spriteId: 2706
  },
  DamageToCurrentEnemy: {
    name: 'Critical Strike',
    description: 'Deals massive direct damage to the enemy crew being attacked.',
    spriteId: 2708
  },
  FireWalk: {
    name: 'Fire Walk',
    description: 'Sets the current room on fire while moving through it.',
    spriteId: 5389
  },
  Freeze: {
    name: 'Freeze',
    description: 'Stuns and freezes enemy crew in the same room, preventing action.',
    spriteId: 5390
  },
  Bloodlust: {
    name: 'Bloodlust',
    description: 'Increases own movement speed and attack damage for a short duration.',
    spriteId: 13866
  },
  SetFire: {
    name: 'Arson',
    description: 'Sets the current room on fire.',
    spriteId: 5388
  },
  ProtectRoom: {
    name: 'Shield Protect',
    description: 'Creates a protective barrier on the room, reducing incoming damage.',
    spriteId: 13320
  },
  Invulnerability: {
    name: 'Invulnerability',
    description: 'Makes the crew member immune to all damage for a short duration.',
    spriteId: 13319
  },
  PoisonCrew: {
    name: 'Poison Gas',
    description: 'Poisons the target crew member, dealing damage over time.',
    spriteId: 2706
  },
  SelfDestruct: {
    name: 'Kamikaze',
    description: 'Explodes upon death or activation, dealing massive damage to the room and enemies.',
    spriteId: 21296
  },
  None: {
    name: 'No Special Ability',
    description: 'This crew member does not possess any active special ability.',
    spriteId: null
  }
};

// Parse prestige XML into array of {id1, id2, toId}
function parsePrestigeXml(xml) {
  const results = [];
  const regex = /CharacterDesignId1="(\d+)"\s+CharacterDesignId2="(\d+)"\s+ToCharacterDesignId="(\d+)"/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    results.push({ id1: Number(match[1]), id2: Number(match[2]), toId: Number(match[3]) });
  }
  return results;
}

export function CrewDetail() {
  const { lang, id } = useParams();
  const [crew, setCrew] = useState(null);
  const [allCrew, setAllCrew] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(40);
  const [activeId, setActiveId] = useState(id);
  const [prestigeTo, setPrestigeTo] = useState([]); // recipes that produce this crew
  const [prestigeFrom, setPrestigeFrom] = useState([]); // recipes where this crew is an ingredient
  const [prestigeLoading, setPrestigeLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/data/active/crew.json').then(res => res.json()),
      fetch('/data/active/collections.json').then(res => res.json())
    ])
      .then(([crewData, collectionsData]) => {
        setAllCrew(crewData);
        setCollections(collectionsData);
        const found = crewData.find(c => String(c.id) === String(id));
        setCrew(found || null);
        setActiveId(id);
        if (found?.maxLevel) setLevel(found.maxLevel);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch prestige paths when activeId changes
  useEffect(() => {
    if (!activeId) return;
    setPrestigeLoading(true);
    setPrestigeTo([]);
    setPrestigeFrom([]);

    const base = 'https://api.pixelstarships.com/CharacterService';
    Promise.all([
      fetch(`${base}/PrestigeCharacterTo?characterDesignId=${activeId}`).then(r => r.text()).catch(() => ''),
      fetch(`${base}/PrestigeCharacterFrom?characterDesignId=${activeId}`).then(r => r.text()).catch(() => '')
    ]).then(([toXml, fromXml]) => {
      setPrestigeTo(parsePrestigeXml(toXml));
      setPrestigeFrom(parsePrestigeXml(fromXml));
      setPrestigeLoading(false);
    });
  }, [activeId]);

  const handleGradeChange = (targetId) => {
    const found = allCrew.find(c => String(c.id) === String(targetId));
    if (found) {
      setCrew(found);
      setActiveId(targetId);
      if (level > found.maxLevel) setLevel(found.maxLevel);
    }
  };

  // Group droids family members
  let familyGrades = [];
  if (crew) {
    const match = crew.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
    if (match) {
      const baseName = crew.name.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
      
      const romanToNum = (roman) => {
        const map = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
        return map[roman.toLowerCase()] || 1;
      };

      familyGrades = allCrew.filter(c => 
        c.name.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim() === baseName
      ).sort((a, b) => {
        const matchA = a.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
        const matchB = b.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
        const lvlA = matchA ? romanToNum(matchA[1]) : 1;
        const lvlB = matchB ? romanToNum(matchB[1]) : 1;
        return lvlA - lvlB;
      });
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading crew details...</div>;
  if (!crew) return <div className="p-8 text-center text-rose-400">Crew member #{id} not found.</div>;

  // Calculate scaled stat at selected level (Linear interpolation Level 1 -> MaxLevel)
  const calcStat = (base, final) => {
    if (crew.maxLevel <= 1) return base;
    const ratio = (level - 1) / (crew.maxLevel - 1);
    return Math.round((base + (final - base) * ratio) * 10) / 10;
  };

  const currentHp = calcStat(crew.hp, crew.finalHp);
  const currentAttack = calcStat(crew.attack, crew.finalAttack);
  const currentRepair = calcStat(crew.repair, crew.finalRepair);
  const currentPilot = calcStat(crew.pilot, crew.finalPilot);
  const currentWeapon = calcStat(crew.weapon, crew.finalWeapon);
  const currentScience = calcStat(crew.science, crew.finalScience);

  const getCrewPartSprite = (crewObj, partType) => {
    const parts = crewObj?.raw?.CharacterParts?.CharacterPart;
    if (!parts) return null;
    const partsArray = Array.isArray(parts) ? parts : [parts];
    const part = partsArray.find(p => p.CharacterPartType === partType);
    return part ? part.StandardSpriteId : null;
  };

  const headSpriteId = getCrewPartSprite(crew, 'Head');
  const bodySpriteId = getCrewPartSprite(crew, 'Body');
  const legSpriteId = getCrewPartSprite(crew, 'Leg');

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      {/* Back button */}
      {!new URLSearchParams(window.location.search).get('embed') && (
        <Link 
          to={`/${lang}/library/crew`} 
          className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Crew Catalog</span>
        </Link>
      )}

      {/* Hero detail card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-slate-950/40 rounded-xl border border-slate-800 flex items-center justify-center p-2">
              {headSpriteId || bodySpriteId || legSpriteId ? (
                <div className="flex flex-col items-center justify-center -space-y-1.5 select-none pointer-events-none scale-125">
                  {headSpriteId && (
                    <SpriteFrame spriteId={headSpriteId} alt="Head" size="sm" borderless className="h-11 w-auto object-contain z-30" />
                  )}
                  {bodySpriteId && (
                    <SpriteFrame spriteId={bodySpriteId} alt="Body" size="sm" borderless className="h-9 w-auto object-contain z-20" />
                  )}
                  {legSpriteId && (
                    <SpriteFrame spriteId={legSpriteId} alt="Legs" size="sm" borderless className="h-8 w-auto object-contain z-10" />
                  )}
                </div>
              ) : (
                <SpriteFrame spriteId={crew.profileSpriteId} alt={crew.name} size="full" className="max-w-full max-h-full" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{crew.name}</h1>
                <RarityBadge rarity={crew.rarity} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Official Entity ID: <span className="font-mono text-slate-300">#{crew.id}</span>
              </p>
              {(() => {
                const col = collections.find(x => String(x.id) === String(crew.collectionId));
                if (!col) return null;
                return (
                  <div className="flex items-center space-x-1.5 mt-1 text-xs text-slate-400">
                    <span>Collection:</span>
                    <Link
                      to={`/${lang}/library/collections`}
                      state={{ search: col.name }}
                      className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-350 hover:underline font-bold"
                    >
                      {col.iconSpriteId && (
                        <SpriteFrame spriteId={col.iconSpriteId} alt={col.name} size="xxs" borderless className="shrink-0 bg-transparent" />
                      )}
                      <span>{col.name}</span>
                    </Link>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Droid Grade/Level Selector */}
        {familyGrades.length > 1 && (
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-semibold text-emerald-400">
              Select Droid Grade / Design
            </div>
            <div className="flex flex-wrap gap-2">
              {familyGrades.map(gradeCrew => {
                const match = gradeCrew.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
                const gradeLabel = match ? match[1] : 'Base';
                const isActive = String(gradeCrew.id) === String(activeId);

                return (
                  <button
                    key={gradeCrew.id}
                    onClick={() => handleGradeChange(gradeCrew.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                      isActive 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50'
                    }`}
                  >
                    Grade {gradeLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Level Scaling Slider */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center space-x-2 text-emerald-400">
              <Sliders className="h-4 w-4" />
              <span>Progression Level Simulator</span>
            </span>
            <span className="font-mono text-slate-100 text-sm">Level {level} / {crew.maxLevel}</span>
          </div>

          <input
            type="range"
            min={1}
            max={crew.maxLevel || 40}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Current Level {level} Stats</h3>
            <StatBar label="HP" value={currentHp} maxValue={crew.finalHp || 100} color="emerald" />
            <StatBar label="Attack" value={currentAttack} maxValue={crew.finalAttack || 20} color="rose" />
            <StatBar label="Repair" value={currentRepair} maxValue={crew.finalRepair || 20} color="sky" />
            <StatBar label="Pilot" value={currentPilot} maxValue={crew.finalPilot || 20} color="purple" />
            <StatBar label="Weapon" value={currentWeapon} maxValue={crew.finalWeapon || 20} color="amber" />
            <StatBar label="Science" value={currentScience} maxValue={crew.finalScience || 20} color="emerald" />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200">Base (L1) vs Max (L{crew.maxLevel}) Range</h3>
            <StatComparisonRow label="HP" baseValue={crew.hp} finalValue={crew.finalHp} />
            <StatComparisonRow label="Attack" baseValue={crew.attack} finalValue={crew.finalAttack} />
            <StatComparisonRow label="Repair" baseValue={crew.repair} finalValue={crew.finalRepair} />
            <StatComparisonRow label="Pilot" baseValue={crew.pilot} finalValue={crew.finalPilot} />
            <StatComparisonRow label="Weapon" baseValue={crew.weapon} finalValue={crew.finalWeapon} />
            <StatComparisonRow label="Science" baseValue={crew.science} finalValue={crew.finalScience} />
          </div>
        </div>

        {/* Special Ability & Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          {(() => {
            const mapped = abilityMapping[crew.specialAbilityType] || {
              name: crew.specialAbilityType || 'None',
              description: 'Special active combat utility.',
              spriteId: null
            };
            return (
              <div className="rounded-lg bg-slate-950 p-4 flex items-start space-x-3 border border-slate-850">
                {mapped.spriteId && (
                  <SpriteFrame spriteId={mapped.spriteId} alt={mapped.name} size="xs" borderless className="shrink-0 bg-transparent mt-0.5" />
                )}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                    <Zap className="h-4 w-4" />
                    <span>Special Ability</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">{mapped.name}</div>
                  <p className="text-[11px] text-slate-400 leading-normal">{mapped.description}</p>
                  {crew.specialAbilityType && crew.specialAbilityType !== 'None' && (
                    <div className="text-[10px] text-emerald-400 font-mono pt-0.5">
                      Stat Modifier: {crew.specialAbilityArgument} → {crew.specialAbilityFinalArgument} (Active: {calcStat(crew.specialAbilityArgument, crew.specialAbilityFinalArgument)})
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="rounded-lg bg-slate-950 p-4 space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>Equipment Mask Slots</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
              <span>Head: #{crew.parts.head || 'None'}</span>
              <span>• Body: #{crew.parts.body || 'None'}</span>
              <span>• Leg: #{crew.parts.leg || 'None'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Prestige Paths Section */}
      {!prestigeLoading && (prestigeTo.length > 0 || prestigeFrom.length > 0) && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 text-sm font-bold text-amber-400">
            <Award className="h-5 w-5" />
            <span>Prestige Paths</span>
          </div>

          {/* Recipes TO make this crew */}
          {prestigeTo.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase">How to get {crew.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(() => {
                  // Deduplicate: treat (id1,id2) and (id2,id1) as the same recipe
                  const seen = new Set();
                  const unique = prestigeTo.filter(r => {
                    const key = [Math.min(r.id1, r.id2), Math.max(r.id1, r.id2)].join('-');
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  });
                  return unique.map((recipe, idx) => {
                    const c1 = allCrew.find(c => c.id === recipe.id1);
                    const c2 = allCrew.find(c => c.id === recipe.id2);
                    return (
                      <div key={idx} className="flex items-center space-x-2 bg-slate-950 rounded-lg px-3 py-2 border border-slate-800/60">
                        <Link to={`/${lang}/library/crew/${recipe.id1}${window.location.search}`} className="flex items-center space-x-1.5 min-w-0 flex-1 hover:bg-slate-800/50 rounded px-1 -mx-1 transition-colors">
                          {c1 && <SpriteFrame spriteId={c1.profileSpriteId} alt={c1.name} size="xxs" borderless className="shrink-0 bg-transparent" />}
                          <span className="text-xs text-slate-200 truncate font-medium hover:text-emerald-400 transition-colors">{c1?.name || `#${recipe.id1}`}</span>
                        </Link>
                        <span className="text-[10px] text-slate-500 font-bold">+</span>
                        <Link to={`/${lang}/library/crew/${recipe.id2}${window.location.search}`} className="flex items-center space-x-1.5 min-w-0 flex-1 hover:bg-slate-800/50 rounded px-1 -mx-1 transition-colors">
                          {c2 && <SpriteFrame spriteId={c2.profileSpriteId} alt={c2.name} size="xxs" borderless className="shrink-0 bg-transparent" />}
                          <span className="text-xs text-slate-200 truncate font-medium hover:text-emerald-400 transition-colors">{c2?.name || `#${recipe.id2}`}</span>
                        </Link>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Recipes FROM this crew (what it can make) */}
          {prestigeFrom.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">What {crew.name} can make</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(() => {
                  // Group by result crew, then show partner
                  const seen = new Set();
                  const unique = prestigeFrom.filter(r => {
                    const key = [Math.min(r.id1, r.id2), Math.max(r.id1, r.id2), r.toId].join('-');
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                  });
                  return unique.map((recipe, idx) => {
                    const partnerId = recipe.id1 === Number(activeId) ? recipe.id2 : recipe.id1;
                    const partner = allCrew.find(c => c.id === partnerId);
                    const result = allCrew.find(c => c.id === recipe.toId);
                    return (
                      <div key={idx} className="flex items-center space-x-2 bg-slate-950 rounded-lg px-3 py-2 border border-slate-800/60">
                        <Link to={`/${lang}/library/crew/${partnerId}${window.location.search}`} className="flex items-center space-x-1.5 min-w-0 flex-1 hover:bg-slate-800/50 rounded px-1 -mx-1 transition-colors">
                          <span className="text-[10px] text-slate-500 font-bold">+</span>
                          {partner && <SpriteFrame spriteId={partner.profileSpriteId} alt={partner.name} size="xxs" borderless className="shrink-0 bg-transparent" />}
                          <span className="text-xs text-slate-200 truncate font-medium hover:text-emerald-400 transition-colors">{partner?.name || `#${partnerId}`}</span>
                        </Link>
                        <span className="text-[10px] text-slate-500 font-bold">→</span>
                        <Link to={`/${lang}/library/crew/${recipe.toId}${window.location.search}`} className="flex items-center space-x-1.5 min-w-0 flex-1 hover:bg-slate-800/50 rounded px-1 -mx-1 transition-colors">
                          {result && <SpriteFrame spriteId={result.profileSpriteId} alt={result.name} size="xxs" borderless className="shrink-0 bg-transparent" />}
                          <span className="text-xs text-emerald-400 truncate font-bold hover:text-emerald-300 transition-colors">{result?.name || `#${recipe.toId}`}</span>
                        </Link>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {prestigeLoading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <div className="text-xs text-slate-400 animate-pulse">Loading prestige paths...</div>
        </div>
      )}

    </div>
  );
}
