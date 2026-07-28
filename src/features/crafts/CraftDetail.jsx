import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SpriteFrame } from '../../components/ui/SpriteFrame';

export function CraftDetail() {
  const { lang, id } = useParams();
  const navigate = useNavigate();
  const [craft, setCraft] = useState(null);
  const [lineage, setLineage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/active/crafts.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => String(c.CraftDesignId) === String(id));
        if (found) {
          setCraft(found);
          const rootId = found.RootCraftDesignId || found.CraftDesignId;
          const related = data.filter(c => (c.RootCraftDesignId || c.CraftDesignId) === rootId);
          related.sort((a, b) => a.CraftDesignId - b.CraftDesignId);
          setLineage(related);
        } else {
          setCraft(null);
          setLineage([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading craft details...</div>;
  if (!craft) return <div className="p-8 text-center text-rose-400">Craft design #{id} not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <Link 
        to={`/${lang}/library/crafts`} 
        className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Crafts Catalog</span>
      </Link>

      {/* Level selector */}
      {lineage.length > 1 && (
        <div className="flex flex-wrap gap-1.5 items-center p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 mr-2">Craft Levels:</span>
          {lineage.map(c => {
            const isActive = String(c.CraftDesignId) === String(id);
            const levelMatch = (c.CraftName || '').match(/Lv\s*(\d+)/i);
            const levelLabel = levelMatch ? `Lv ${levelMatch[1]}` : `Lv ${c.CraftDesignId}`;
            return (
              <button
                key={c.CraftDesignId}
                onClick={() => navigate(`/${lang}/library/crafts/${c.CraftDesignId}`)}
                className={`px-3 py-1 rounded font-mono text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {levelLabel}
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <SpriteFrame spriteId={craft.SpriteId} alt={craft.CraftName} size="xl" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{craft.CraftName || 'Deployable Craft'}</h1>
              <p className="text-xs text-slate-400 mt-1">
                Craft Design ID: <span className="font-mono text-slate-300">#{craft.CraftDesignId}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Craft HP</div>
            <div className="text-lg font-bold text-emerald-400 mt-1">{craft.Hp || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Flight Speed</div>
            <div className="text-lg font-bold text-sky-400 mt-1">{craft.FlightSpeed || 0}</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Reload Time</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{craft.ReloadTime || craft.Reload || 0}s</div>
          </div>
          <div className="rounded-lg bg-slate-950 p-3 text-center border border-slate-800">
            <div className="text-slate-500">Volley / Capacity</div>
            <div className="text-lg font-bold text-purple-400 mt-1">{craft.Capacity || 1}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
