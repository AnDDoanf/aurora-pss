import React, { useState, useEffect } from 'react';
import { Shield, Sword, Sliders, BarChart3, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SEOHead } from '../../components/SEOHead';
import { SnapshotTimeline } from './components/SnapshotTimeline';
import { WeaponConfigurator } from './components/WeaponConfigurator';
import { DefenseConfigurator } from './components/DefenseConfigurator';
import { AnalyticsResults } from './components/AnalyticsResults';

const STORAGE_KEY_SNAPSHOTS = 'pss_capacity_analytics_snapshots';
const STORAGE_KEY_ACTIVE_ID = 'pss_capacity_analytics_active_id';

function createDefaultSnapshot(id, name, duration = null) {
  return {
    id,
    name,
    duration,
    weapons: [],
    defenses: [],
    bonusStats: {
      weaponBonus: 0,
      scienceBonus: 0,
      engineBonus: 0,
      hasteBonus: 0
    },
    customBonuses: []
  };
}

function normalizeRooms(rawRooms) {
  const map = new Map();

  rawRooms.forEach(roomGroup => {
    const rawLevels = roomGroup.levels || [roomGroup];
    rawLevels.forEach(lvlObj => {
      const raw = lvlObj.raw || lvlObj;
      const roomName = raw.RoomName || lvlObj.name || roomGroup.name || '';
      const cleanName = roomName.replace(/\s+Lv\d+/gi, '').trim();

      if (!cleanName) return;

      if (!map.has(cleanName)) {
        map.set(cleanName, {
          rootId: lvlObj.rootId || roomGroup.rootId,
          name: cleanName,
          type: raw.RoomType || roomGroup.type || 'Weapon',
          category: raw.CategoryType || roomGroup.category || '',
          levels: []
        });
      }

      map.get(cleanName).levels.push(lvlObj);
    });
  });

  return Array.from(map.values()).map(r => {
    r.levels.sort((a, b) => (a.level || 0) - (b.level || 0));
    return r;
  });
}

export function ShipCapacityAnalytics() {
  const { t, lang } = useTranslation();

  const [allRooms, setAllRooms] = useState([]);
  const [allMissiles, setAllMissiles] = useState([]);
  const [allCrafts, setAllCrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Snapshots State with LocalStorage persistence
  const [snapshots, setSnapshots] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SNAPSHOTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed restoring capacity analytics snapshots from localStorage:', e);
    }
    return [
      createDefaultSnapshot('snap-1', 'Snapshot 1 (Rush)', 10),
      createDefaultSnapshot('snap-2', 'Snapshot 2 (Sustained)', null)
    ];
  });

  const [activeSnapshotId, setActiveSnapshotId] = useState(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId) return savedId;
    } catch (e) {}
    return 'snap-1';
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SNAPSHOTS, JSON.stringify(snapshots));
    } catch (e) {
      console.error('Failed saving snapshots to localStorage:', e);
    }
  }, [snapshots]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeSnapshotId);
    } catch (e) {
      console.error('Failed saving active snapshot ID to localStorage:', e);
    }
  }, [activeSnapshotId]);

  // Load data files on mount
  useEffect(() => {
    Promise.all([
      fetch('/data/active/rooms.json').then(r => r.ok ? r.json() : []),
      fetch('/data/active/missiles.json').then(r => r.ok ? r.json() : []),
      fetch('/data/active/crafts.json').then(r => r.ok ? r.json() : [])
    ])
      .then(([rooms, missiles, crafts]) => {
        setAllRooms(normalizeRooms(rooms));
        setAllMissiles(missiles);
        setAllCrafts(crafts);
      })
      .catch(err => console.error('Failed loading room/ammo data for capacity analytics:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const activeSnapshot = snapshots.find(s => s.id === activeSnapshotId) || snapshots[0];

  // Handlers for Snapshots
  const handleAddSnapshot = () => {
    const nextIdx = snapshots.length + 1;
    const newId = `snap-${Date.now()}`;
    const newSnap = createDefaultSnapshot(newId, `Snapshot ${nextIdx}`, 15);

    if (activeSnapshot) {
      newSnap.weapons = JSON.parse(JSON.stringify(activeSnapshot.weapons));
      newSnap.defenses = JSON.parse(JSON.stringify(activeSnapshot.defenses));
      newSnap.bonusStats = { ...activeSnapshot.bonusStats };
      newSnap.customBonuses = JSON.parse(JSON.stringify(activeSnapshot.customBonuses || []));
    }

    setSnapshots([...snapshots, newSnap]);
    setActiveSnapshotId(newId);
  };

  const handleCopySnapshotLayout = (sourceId, targetId) => {
    const source = snapshots.find(s => s.id === sourceId);
    if (!source) return;

    setSnapshots(snapshots.map(s => {
      if (s.id === targetId) {
        return {
          ...s,
          weapons: JSON.parse(JSON.stringify(source.weapons)),
          defenses: JSON.parse(JSON.stringify(source.defenses)),
          bonusStats: { ...source.bonusStats },
          customBonuses: JSON.parse(JSON.stringify(source.customBonuses || []))
        };
      }
      return s;
    }));
  };

  const handleDeleteSnapshot = (idToDelete) => {
    if (snapshots.length <= 1) return;
    const filtered = snapshots.filter(s => s.id !== idToDelete);
    setSnapshots(filtered);
    if (activeSnapshotId === idToDelete) {
      setActiveSnapshotId(filtered[0].id);
    }
  };

  const handleUpdateDuration = (id, duration) => {
    setSnapshots(snapshots.map(s => s.id === id ? { ...s, duration } : s));
  };

  const handleUpdateName = (id, name) => {
    setSnapshots(snapshots.map(s => s.id === id ? { ...s, name } : s));
  };

  // Handlers for Weapons
  const handleAddWeapon = (newWeapon) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return { ...s, weapons: [...s.weapons, newWeapon] };
      }
      return s;
    }));
  };

  const handleUpdateWeapon = (weaponId, patch) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return {
          ...s,
          weapons: s.weapons.map(w => w.id === weaponId ? { ...w, ...patch } : w)
        };
      }
      return s;
    }));
  };

  const handleRemoveWeapon = (weaponId) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return {
          ...s,
          weapons: s.weapons.filter(w => w.id !== weaponId)
        };
      }
      return s;
    }));
  };

  // Handlers for Defenses
  const handleAddDefense = (newDefense) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return { ...s, defenses: [...s.defenses, newDefense] };
      }
      return s;
    }));
  };

  const handleUpdateDefense = (defenseId, patch) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return {
          ...s,
          defenses: s.defenses.map(d => d.id === defenseId ? { ...d, ...patch } : d)
        };
      }
      return s;
    }));
  };

  const handleRemoveDefense = (defenseId) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return {
          ...s,
          defenses: s.defenses.filter(d => d.id !== defenseId)
        };
      }
      return s;
    }));
  };

  // Handlers for Bonus Stats
  const handleUpdateBonusStats = (newStats) => {
    setSnapshots(snapshots.map(s => {
      if (s.id === activeSnapshotId) {
        return { ...s, bonusStats: newStats };
      }
      return s;
    }));
  };

  const pageTitle = `${t('pages.capacity.title')} | Pixel Starships`;
  const pageDesc = t('pages.capacity.description');

  return (
    <div className="space-y-6 pb-12 max-w-[1600px] mx-auto">
      <SEOHead title={pageTitle} description={pageDesc} />

      <div className="page-header">
        <div>
          <h1 className="page-title">
            {t('pages.capacity.title')}
          </h1>
            <p className="mt-1 max-w-3xl text-xs text-slate-400">
              {t('pages.capacity.description')}
            </p>
        </div>
        <div className="flex w-full items-center md:w-auto">
            <button
              onClick={() => {
                const defaultSnaps = [
                  createDefaultSnapshot('snap-1', 'Snapshot 1 (Rush)', 10),
                  createDefaultSnapshot('snap-2', 'Snapshot 2 (Sustained)', null)
                ];
                setSnapshots(defaultSnaps);
                setActiveSnapshotId('snap-1');
                try {
                  localStorage.removeItem(STORAGE_KEY_SNAPSHOTS);
                  localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
                } catch (e) {}
              }}
              className="flex min-h-10 w-full items-center justify-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 md:w-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('pages.capacity.reset')}</span>
            </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-slate-400 font-mono animate-pulse">
          {t('pages.capacity.loading')}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Snapshot Timeline Tabs Bar */}
          <SnapshotTimeline
            snapshots={snapshots}
            activeSnapshotId={activeSnapshotId}
            onSelectSnapshot={setActiveSnapshotId}
            onAddSnapshot={handleAddSnapshot}
            onCopySnapshotLayout={handleCopySnapshotLayout}
            onDeleteSnapshot={handleDeleteSnapshot}
            onUpdateDuration={handleUpdateDuration}
            onUpdateName={handleUpdateName}
          />

          {/* Full-Width Stacked Layout: Configuration Top -> Analytics Dashboard Bottom */}
          <div className="space-y-6">
            {/* Weapon Rooms Table Section (Full Width) */}
            <WeaponConfigurator
              weapons={activeSnapshot?.weapons || []}
              allRooms={allRooms}
              allMissiles={allMissiles}
              allCrafts={allCrafts}
              bonusStats={activeSnapshot?.bonusStats || {}}
              customBonuses={activeSnapshot?.customBonuses || []}
              duration={activeSnapshot?.duration}
              onAddWeapon={handleAddWeapon}
              onUpdateWeapon={handleUpdateWeapon}
              onRemoveWeapon={handleRemoveWeapon}
            />

            {/* Defense Rooms Table Section (Full Width) */}
            <DefenseConfigurator
              defenses={activeSnapshot?.defenses || []}
              allRooms={allRooms}
              bonusStats={activeSnapshot?.bonusStats || {}}
              duration={activeSnapshot?.duration}
              onAddDefense={handleAddDefense}
              onUpdateDefense={handleUpdateDefense}
              onRemoveDefense={handleRemoveDefense}
            />

            {/* Analytics Results Dashboard (Full Width) */}
            <AnalyticsResults
              snapshots={snapshots}
              activeSnapshotId={activeSnapshotId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShipCapacityAnalytics;
