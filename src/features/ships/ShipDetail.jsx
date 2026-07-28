import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid } from 'lucide-react';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function ShipDetail() {
  const { lang, id } = useParams();
  const navigate = useNavigate();
  const [ship, setShip] = useState(null);
  const [lineage, setLineage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/ships.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(s => String(s.id) === String(id));
        if (found) {
          setShip(found);
          
          const cleanName = (name) => name
            .replace(/\s*\((Light|Medium|Heavy|Class\s+\d+|MKI+|MK\s+\d+|Retro|Special|Refit|Normal|Extended|Ext|Class\s+[A-Z])\)\s*/i, '')
            .replace(/\s+(Light|Medium|Heavy|Class\s+\d+|MKI+|MK\s+\d+|Retro|Special|Refit|Normal|Extended|Ext)$/i, '')
            .trim();
          
          const targetBase = cleanName(found.name);
          const related = data.filter(s => s.raceId === found.raceId && cleanName(s.name) === targetBase);
          related.sort((a, b) => {
            if (a.shipLevel !== b.shipLevel) return a.shipLevel - b.shipLevel;
            return a.id - b.id;
          });
          setLineage(related);
        } else {
          setShip(null);
          setLineage([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading ship layout details...</div>;
  if (!ship) return <div className="p-8 text-center text-rose-400">Ship hull #{id} not found.</div>;

  const uniqueLevels = Array.from(new Set(lineage.map(s => s.shipLevel))).sort((a, b) => a - b);
  const currentLevel = ship?.shipLevel;
  const variantsAtLevel = lineage.filter(s => s.shipLevel === currentLevel);
  const sortedVariants = [...variantsAtLevel].sort((a, b) => (a.columns * a.rows) - (b.columns * b.rows));
  const normalDesign = sortedVariants[0];
  const extendedDesign = sortedVariants.length > 1 ? sortedVariants[sortedVariants.length - 1] : null;
  const isCurrentlyExtended = ship && extendedDesign && ship.id === extendedDesign.id;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      
      <Link 
        to={`/${lang}/library/ships`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Ship Catalog</span>
      </Link>

      {/* Level selector */}
      {lineage.length > 1 && (
        <div className="flex flex-wrap gap-3 items-center p-3 rounded-lg bg-slate-900 border border-slate-800 justify-between">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-semibold text-slate-400 mr-2">Hull Levels:</span>
            {uniqueLevels.map(lvl => {
              // Find representative ship for this level (prefer normal design)
              const levelShips = lineage.filter(s => s.shipLevel === lvl);
              const sortedLevelShips = [...levelShips].sort((a, b) => (a.columns * a.rows) - (b.columns * b.rows));
              const targetShip = sortedLevelShips[0];
              
              const isActive = currentLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => navigate(`/${lang}/library/ships/${targetShip.id}`)}
                  className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  Lv {lvl}
                </button>
              );
            })}
          </div>

          {/* Extend toggle button */}
          {extendedDesign && (
            <button
              onClick={() => {
                const target = isCurrentlyExtended ? normalDesign : extendedDesign;
                if (target) navigate(`/${lang}/library/ships/${target.id}`);
              }}
              className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all flex items-center space-x-1.5 ${
                isCurrentlyExtended 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>Show Extended Layout</span>
            </button>
          )}
        </div>
      )}

      <div className="rounded-lg bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-slate-950/40 rounded-xl border border-slate-800/60 p-2 flex items-center justify-center">
              <SpriteFrame spriteId={ship.raw?.ExteriorSpriteId} alt={ship.name} size="full" className="max-w-full max-h-full" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{ship.name}</h1>
                <CategoryBadge category={`Level ${ship.shipLevel}`} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Ship Design ID: <span className="font-mono text-slate-300">#{ship.id}</span> • Race ID: <span className="font-mono text-slate-300">{ship.raceId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center">
            <div className="text-slate-400">Ship Level</div>
            <div className="text-lg font-bold text-indigo-400 mt-1">Level {ship.shipLevel}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center">
            <div className="text-slate-400">Hull HP</div>
            <div className="text-lg font-bold text-slate-100 mt-1">{ship.hp}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center">
            <div className="text-slate-400">Grid Dimensions</div>
            <div className="text-lg font-bold text-purple-400 mt-1">{ship.columns} x {ship.rows}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center">
            <div className="text-slate-400">Repair Cost</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{ship.repairCost?.toLocaleString() || 0}</div>
          </div>
        </div>

        {/* Accessible Grid Mask Representation */}
        <div className="rounded-lg bg-slate-950 p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
            <Grid className="h-4 w-4 text-indigo-400" />
            <span>Accessible Ship Grid Area Bounds</span>
          </h2>
          
          <div className="p-4 rounded-lg bg-slate-900 text-xs font-mono text-slate-400 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-3">
              <span>Grid Columns: {ship.columns}</span>
              <span>Grid Rows: {ship.rows}</span>
              <span>Total Cell Count: {ship.columns * ship.rows} cells</span>
            </div>
            {ship.raw?.InteriorSpriteId ? (
              <div className="pt-2 flex flex-col items-center justify-center space-y-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1">Interior Layout View</span>
                <div className="w-full h-48 sm:h-64 md:h-80 p-4 rounded-xl bg-slate-950/60 border border-slate-800/40 flex items-center justify-center overflow-hidden">
                  <SpriteFrame spriteId={ship.raw.InteriorSpriteId} alt={`${ship.name} Interior`} size="full" className="w-full h-full max-w-4xl" />
                </div>
              </div>
            ) : (
              ship.mask && (
                <div className="pt-2 text-[10px] break-all text-slate-400">
                  Raw Layout Mask Payload: <code>{ship.mask}</code>
                </div>
              )
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
