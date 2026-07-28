import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/useTranslation';
import { EntityCard } from '../../components/ui/EntityCard';
import { DataTable } from '../../components/ui/DataTable';
import { FilterDrawer } from '../../components/ui/FilterDrawer';
import { CompareTray } from '../../components/ui/CompareTray';
import { SpriteFrame } from '../../components/ui/SpriteFrame';
import { RarityBadge } from '../../components/ui/RarityBadge';

const abilityMapping = {
  DeductReload: {
    name: 'Rush Command',
    spriteId: 2703
  },
  HealSelfHp: {
    name: 'First Aid',
    spriteId: 2707
  },
  HealSameRoomCharacters: {
    name: 'Healing Rain',
    spriteId: 2705
  },
  AddReload: {
    name: 'Rush Command',
    spriteId: 2703
  },
  DamageToRoom: {
    name: 'System Hack',
    spriteId: 2710
  },
  HealRoomHp: {
    name: 'Urgent Repair',
    spriteId: 2709
  },
  DamageToSameRoomCharacters: {
    name: 'Gas Cloud',
    spriteId: 2706
  },
  DamageToCurrentEnemy: {
    name: 'Critical Strike',
    spriteId: 2708
  },
  FireWalk: {
    name: 'Fire Walk',
    spriteId: 5389
  },
  Freeze: {
    name: 'Freeze',
    spriteId: 5390
  },
  Bloodlust: {
    name: 'Bloodlust',
    spriteId: 13866
  },
  SetFire: {
    name: 'Arson',
    spriteId: 5388
  },
  ProtectRoom: {
    name: 'Shield Protect',
    spriteId: 13320
  },
  Invulnerability: {
    name: 'Invulnerability',
    spriteId: 13319
  },
  PoisonCrew: {
    name: 'Poison Gas',
    spriteId: 2706
  },
  SelfDestruct: {
    name: 'Kamikaze',
    spriteId: 21296
  },
  None: {
    name: 'No Special Ability',
    spriteId: null
  }
};

export function CrewCatalog() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderSkillBadge = (abilityType) => {
    if (abilityType === 'None' || !abilityType) return null;
    const mapped = abilityMapping[abilityType] || {
      name: abilityType,
      spriteId: null
    };

    return (
      <span className="inline-flex items-center space-x-1.5 py-0.5">
        {mapped.spriteId && (
          <SpriteFrame spriteId={mapped.spriteId} alt={mapped.name} size="xxs" borderless className="shrink-0 bg-transparent" />
        )}
        <span>{mapped.name}</span>
      </span>
    );
  };

  const [crewList, setCrewList] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortColumn, setSortColumn] = useState('hp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [comparedIds, setComparedIds] = useState([]);
  const [activeIframeCrewId, setActiveIframeCrewId] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveIframeCrewId(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/data/active/crew.json').then(res => res.json()),
      fetch('/data/active/collections.json').then(res => res.json())
    ])
      .then(([crewData, collectionsData]) => {
        setCrewList(crewData);
        setCollections(collectionsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load crew data:', err);
        setLoading(false);
      });
  }, []);

  const toggleCompare = (id) => {
    setComparedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : (prev.length < 4 ? [...prev, id] : prev)
    );
  };

  const romanToNum = (roman) => {
    const map = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
    return map[roman.toLowerCase()] || 1;
  };

  const groupsMap = {};
  crewList.forEach(c => {
    const match = c.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
    if (match) {
      const baseName = c.name.replace(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i, '').trim();
      if (!groupsMap[baseName]) {
        groupsMap[baseName] = {
          name: baseName,
          isGroup: true,
          levels: []
        };
      }
      groupsMap[baseName].levels.push(c);
    } else {
      groupsMap[c.id] = {
        name: c.name,
        isGroup: false,
        levels: [c]
      };
    }
  });

  const groupedCrew = Object.values(groupsMap).map(g => {
    g.levels.sort((a, b) => {
      const matchA = a.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
      const matchB = b.name.match(/\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i);
      const lvlA = matchA ? romanToNum(matchA[1]) : 1;
      const lvlB = matchB ? romanToNum(matchB[1]) : 1;
      return lvlA - lvlB;
    });

    const rootLevel = g.levels[0];
    const topLevel = g.levels[g.levels.length - 1];

    return {
      id: rootLevel.id,
      name: g.isGroup ? g.name : rootLevel.name,
      title: rootLevel.title,
      maxLevel: topLevel.maxLevel,
      rarity: topLevel.rarity,
      specialAbilityType: topLevel.specialAbilityType,
      profileSpriteId: topLevel.profileSpriteId,
      collectionId: topLevel.collectionId,
      hp: rootLevel.hp,
      finalHp: topLevel.finalHp,
      attack: rootLevel.attack,
      finalAttack: topLevel.finalAttack,
      repair: rootLevel.repair,
      finalRepair: topLevel.finalRepair,
      pilot: rootLevel.pilot,
      finalPilot: topLevel.finalPilot,
      weapon: rootLevel.weapon,
      finalWeapon: topLevel.finalWeapon,
      science: rootLevel.science,
      finalScience: topLevel.finalScience,
      isGroup: g.isGroup,
      levels: g.levels
    };
  });

  const filteredCrew = groupedCrew.filter(c => {
    const matchesSearch = !search.trim() || 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.levels.some(l => String(l.id).includes(search) || l.name.toLowerCase().includes(search.toLowerCase()));
    const matchesRarity = selectedRarity === 'All' || c.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const sortedCrew = [...filteredCrew].sort((a, b) => {
    let valA = a[sortColumn] ?? 0;
    let valB = b[sortColumn] ?? 0;
    if (sortColumn === 'collection') {
      const colA = collections.find(x => String(x.id) === String(a.collectionId))?.name || '';
      const colB = collections.find(x => String(x.id) === String(b.collectionId))?.name || '';
      if (!colA && !colB) return 0;
      if (!colA) return 1; // push empty collections to bottom
      if (!colB) return -1;
      return sortDirection === 'asc' ? colA.localeCompare(colB) : colB.localeCompare(colA);
    }
    if (sortColumn === 'rarity') {
      const rarityOrder = { common: 1, elite: 2, unique: 3, epic: 4, hero: 5, special: 6, legendary: 7, legend: 7 };
      const weightA = rarityOrder[String(valA).toLowerCase()] ?? 0;
      const weightB = rarityOrder[String(valB).toLowerCase()] ?? 0;
      return sortDirection === 'asc' ? weightA - weightB : weightB - weightA;
    }
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(colKey);
      setSortDirection('desc');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Crew Member',
      cell: (c) => (
        <div className="flex items-center space-x-3">
          <SpriteFrame spriteId={c.profileSpriteId} alt={c.name} size="sm" />
          <div>
            <div className="font-bold text-slate-100">{c.name}</div>
            <div className="text-[10px] text-slate-400">
              {c.isGroup ? `${c.levels.length} Grades • Root ID: ${c.id}` : `ID: ${c.id}`}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'rarity',
      header: 'Rarity',
      cell: (c) => <RarityBadge rarity={c.rarity} />
    },
    {
      key: 'collection',
      header: 'Collection',
      cell: (c) => {
        const col = collections.find(x => String(x.id) === String(c.collectionId));
        if (!col) return <span className="text-slate-500 font-mono text-xs">—</span>;
        return (
          <Link
            to={`/${lang}/library/collections`}
            state={{ search: col.name }}
            className="flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 hover:underline font-bold text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {col.iconSpriteId && (
              <SpriteFrame spriteId={col.iconSpriteId} alt={col.name} size="xxs" borderless className="shrink-0 bg-transparent" />
            )}
            <span>{col.name}</span>
          </Link>
        );
      }
    },
    { key: 'finalHp', header: 'HP', cell: (c) => c.finalHp },
    { key: 'finalAttack', header: 'ATK', cell: (c) => c.finalAttack },
    { key: 'finalRepair', header: 'RPR', cell: (c) => c.finalRepair },
    { key: 'finalPilot', header: 'PLT', cell: (c) => c.finalPilot },
    { key: 'finalWeapon', header: 'WPN', cell: (c) => c.finalWeapon },
    { key: 'finalScience', header: 'SCI', cell: (c) => c.finalScience }
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      
      <div>
        <h1 className="text-2xl font-black text-slate-100">Crew Catalog</h1>
      </div>

      {/* Filter drawer */}
      <FilterDrawer
        searchQuery={search}
        onSearchChange={setSearch}
        selectedRarity={selectedRarity}
        onRarityChange={setSelectedRarity}
        rarities={['All', 'Common', 'Elite', 'Unique', 'Epic', 'Hero', 'Special', 'Legendary']}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={() => { setSearch(''); setSelectedRarity('All'); }}
        totalResults={sortedCrew.length}
      />

      {/* Grid or Table Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedCrew.map(c => (
            <EntityCard
              key={c.id}
              id={c.id}
              name={c.name}
              subtitle={c.isGroup ? `${c.levels.length} Grades Available` : (c.title || `Max Level ${c.maxLevel}`)}
              rarity={c.rarity}
              category={renderSkillBadge(c.specialAbilityType)}
              spriteId={c.profileSpriteId}
              targetPath={`/${lang}/library/crew/${c.id}`}
              onClick={setActiveIframeCrewId}
              isCompared={comparedIds.includes(c.id)}
              onToggleCompare={toggleCompare}
              stats={[
                { label: 'HP', value: `${c.hp} → ${c.finalHp}` },
                { label: 'ATK', value: `${c.attack} → ${c.finalAttack}` },
                { label: 'RPR', value: `${c.repair} → ${c.finalRepair}` },
                { label: 'WPN', value: `${c.weapon} → ${c.finalWeapon}` }
              ]}
            />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={sortedCrew}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRowClick={(c) => setActiveIframeCrewId(c.id)}
        />
      )}

      {/* Floating comparison tray */}
      <CompareTray
        selectedIds={comparedIds}
        type="crew"
        onClear={() => setComparedIds([])}
      />

      {/* Embedded Crew Details Iframe Dialog Modal */}
      {activeIframeCrewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="relative w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-950/40 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">Crew Profile Preview</span>
              <button 
                onClick={() => setActiveIframeCrewId(null)}
                className="text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
              >
                Close (ESC)
              </button>
            </div>

            {/* Iframe Viewport Container */}
            <div className="flex-1 w-full bg-slate-950 relative">
              <iframe
                src={`/${lang}/library/crew/${activeIframeCrewId}?embed=true`}
                title="Crew Profile Details"
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
